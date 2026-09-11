import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { verifiedPrograms, VerifiedProgram } from '../data/verifiedPrograms';
import { UserProfile, extractProfileFromMessage, getMissingInformation, getNextQuestion, formatProfileForDisplay, detectLanguage } from '../lib/profile';
import { classifyIntent, getProgramsForIntent } from '../lib/intents';
import { getRecommendedPrograms, getEligibilityStatusText, getEligibilityStatusColor } from '../lib/recommendations';
import CopilotVoiceModal from '../components/CopilotVoiceModal';
import Logo from '../components/Logo';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { 
  Send, Bot, User, AlertTriangle,
  ArrowRight, Search, Info, MessageCircle,
  Loader2, UserCircle, X, ExternalLink, CheckCircle2, Mic, MicOff, Headphones
} from 'lucide-react';

interface SpeechRecognitionAlternativeResult {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeResult;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives?: number;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onnomatch?: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionInstance;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  programs?: string[];
  suggestions?: string[];
  nextSteps?: string[];
  documents?: string[];
}

const welcomeMessage = (language: 'en' | 'ur') => language === 'ur'
  ? "السلام علیکم! سرکار ساتھی میں خوش آمدید۔\n\nمیں آپ کو ان حکومتی پروگراموں کو تلاش کرنے میں مدد کروں گا جن کے آپ اہل ہو سکتے ہیں۔\n\n💬 **آپ مجھ سے گفتگو کر سکتے ہیں:**\n• اردو میں\n• رومن اردو میں\n• انگلش میں\n\nآئیے شروع کرتے ہیں - اپنے بارے میں بتائیں:\n• آپ کے خاندان کے کتنے افراد ہیں؟\n• آپ کی ماہانہ آمدن کتنی ہے؟\n• آپ کیا کام کرتے ہیں؟\n• آپ کو کس قسم کی حکومتی معاونت چاہیے؟"
  : "Assalam o Alaikum! Welcome to Sarkar Sathi.\n\nI'm here to help you find government programs you may be eligible for.\n\n💬 **You can chat with me in:**\n• English\n• Urdu (اردو)\n• Roman Urdu (e.g., \"mujhe madad chahiye\")\n\nI'll respond in the same language you use!\n\nLet's start - tell me about yourself:\n• How many family members do you have?\n• What is your monthly income?\n• What do you do for work?\n• What kind of support are you looking for?";

const welcomeSuggestions = (language: 'en' | 'ur') => language === 'ur'
  ? ['میرے 3 بچے ہیں اور آمدن 25,000 ہے', 'میں کسان ہوں اور 5 ایکڑ زمین ہے', 'مجھے صحت کی سہولت درکار ہے', 'روزگار کی اسکیم کے بارے میں بتائیں']
  : ['I have 3 kids and earn 25,000', "I'm a farmer with 5 acres", 'mujhe sehat ki madad chahiye', 'میرے 3 بچے ہیں اور آمدن 25,000 ہے'];

function responseMatchesLanguage(text: string, language: 'urdu' | 'roman_urdu' | 'english'): boolean {
  if (language !== 'urdu') return true;
  return /[\u0600-\u06FF]/.test(text);
}

export default function AssistantPage() {
  const { language, setLanguage } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: welcomeMessage(language),
      suggestions: welcomeSuggestions(language),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [showProfile, setShowProfile] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<'urdu' | 'roman_urdu' | 'english'>('english');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const [isVoiceModeOpen, setIsVoiceModeOpen] = useState(false);
  const [voiceLanguage, setVoiceLanguage] = useState<'en' | 'ur'>(language);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [voiceUserCaption, setVoiceUserCaption] = useState('');
  const [voiceAssistantCaption, setVoiceAssistantCaption] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const voiceTranscriptRef = useRef('');
  const voiceLiveTranscriptRef = useRef('');
  const voiceInputPrefixRef = useRef('');
  const isListeningRef = useRef(false);
  const manualStopRef = useRef(false);
  const voiceTurnSubmittingRef = useRef(false);
  const voiceSilenceTimerRef = useRef<number | null>(null);
  const { isSpeaking, isPaused, speak, pause, resume, stop } = useSpeechSynthesis();
  const loadingMessages = [1, 2, 3, 4].map(index => t(`assistant.loading.${index}`, language));

  useEffect(() => {
    setMessages(prev => {
      if (prev.length !== 1 || prev[0].id !== '1') return prev;
      return [{ ...prev[0], content: welcomeMessage(language), suggestions: welcomeSuggestions(language) }];
    });
  }, [language]);

  useEffect(() => {
    if (!isVoiceModeOpen) setVoiceLanguage(language);
  }, [language, isVoiceModeOpen]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setLoadingMessageIndex(prev => prev < loadingMessages.length - 1 ? prev + 1 : prev);
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading]);
  
  const handleSend = async (text?: string) => {
    const messageText = text ?? input.trim();
    if (!messageText || isLoading) return;
    
    // Detect language of user message
    const currentLang = detectLanguage(messageText);
    setDetectedLanguage(currentLang);
    
    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setLoadingMessageIndex(0);
    
    // Update profile from message
    const updatedProfile = extractProfileFromMessage(messageText, userProfile);
    setUserProfile(updatedProfile);
    
    // Try API first
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.role !== 'assistant' || m.id !== '1'), userMsg].map(m => ({
            role: m.role,
            content: m.content
          })),
          profile: updatedProfile,
          language: currentLang
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Update profile with any new information from API
        if (data.profileUpdates) {
          const newProfile = { ...updatedProfile, ...data.profileUpdates };
          setUserProfile(newProfile);
        }
        
        // Build response content
        let responseContent = data.answer || '';
        
        // Add follow-up question if present
        if (data.followUpQuestion) {
          responseContent += `\n\n---\n\n${data.followUpQuestion}`;
        }

        if (!responseMatchesLanguage(responseContent, currentLang)) {
          console.warn('Qwen returned a non-Urdu response for an Urdu request; using local Urdu fallback.');
        } else {
        
        // Create assistant message
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: responseContent,
          programs: data.recommendedPrograms && data.recommendedPrograms.length > 0 ? data.recommendedPrograms : undefined,
          suggestions: data.recommendedPrograms && data.recommendedPrograms.length > 0 
            ? data.recommendedPrograms.map((id: string) => {
                const prog = verifiedPrograms.find(p => p.id === id);
                if (!prog) return '';
                if (currentLang === 'urdu') return `مجھے ${prog.nameUrdu || prog.name} کے بارے میں بتائیں`;
                if (currentLang === 'roman_urdu') return `Mujhe ${prog.name} ke bare mein batayein`;
                return `Tell me about ${prog.name}`;
              }).filter(Boolean)
            : undefined,
        };
        
        setMessages(prev => [...prev, assistantMsg]);
        setVoiceAssistantCaption(responseContent);
        if (isVoiceModeOpen && !isVoiceMuted) {
          speak(responseContent, currentLang, () => {
            if (isVoiceModeOpen && !manualStopRef.current && !isLoading) startRecognition(voiceLanguage);
          });
        } else if (isVoiceModeOpen && !manualStopRef.current) {
          setIsLoading(false);
          startRecognition(voiceLanguage);
        }
        setIsLoading(false);
        return;
        }
      }
    } catch (error) {
      console.error('API error, using local logic:', error);
    }
    
    // Fallback to local logic if API fails
    // Classify intent
    const intentResult = classifyIntent(messageText);
    
    // Get missing information
    const missingInfo = getMissingInformation(updatedProfile);
    
    // Determine response
    let responseContent = '';
    let recommendedProgramIds: string[] = [];
    let suggestions: string[] = [];
    
    // Handle specific intents
    if (intentResult.intent === 'program_details' && intentResult.programId) {
      const program = verifiedPrograms.find(p => p.id === intentResult.programId);
      if (program) {
        responseContent = generateProgramDetailResponse(program);
        suggestions = currentLang === 'urdu'
          ? ['کون سی دستاویزات درکار ہیں؟', 'درخواست کیسے دوں؟', 'میری اہلیت چیک کریں']
          : currentLang === 'roman_urdu'
          ? ['Mujhe kaun se documents chahiye?', 'Apply kaise karoon?', 'Meri eligibility check karein']
          : ['What documents do I need?', 'How do I apply?', 'Check my eligibility'];
      }
    } else if (intentResult.intent === 'documents' || intentResult.intent === 'application_process') {
      if (updatedProfile.currentProgram) {
        const program = verifiedPrograms.find(p => p.id === updatedProfile.currentProgram);
        if (program) {
          if (intentResult.intent === 'documents') {
            responseContent = `For **${program.name}**, you will need:\n\n${program.documents.map(d => `• ${d}`).join('\n')}\n\nPlease verify these requirements with the official source as they may change.`;
          } else {
            responseContent = `**How to apply for ${program.name}:**\n\n${program.applicationSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\n**Where to apply:**\n${program.applicationChannels.map(c => `• ${c}`).join('\n')}`;
          }
        }
      } else {
        responseContent = "I'd be happy to help with documents and application process. Which specific program are you asking about?";
      }
    } else if (updatedProfile.needs && updatedProfile.needs.length > 0) {
      const recommendations = getRecommendedPrograms(updatedProfile, verifiedPrograms);
      const topRecommendations = recommendations.slice(0, 3);
      
      if (topRecommendations.length > 0) {
        recommendedProgramIds = topRecommendations.map(r => r.programId);
        responseContent = generateRecommendationResponse(updatedProfile, topRecommendations, missingInfo, currentLang);
        
        if (missingInfo.length > 0) {
          const nextQuestion = getNextQuestion(updatedProfile, missingInfo, currentLang);
          if (nextQuestion) {
            responseContent += `\n\n---\n\n${nextQuestion}`;
          }
        }
        
        suggestions = topRecommendations.map(r => {
          const prog = verifiedPrograms.find(p => p.id === r.programId);
          return prog ? `Tell me about ${prog.name}` : '';
        }).filter(Boolean);
      } else {
        responseContent = currentLang === 'urdu'
          ? "آپ کی معلومات کی بنیاد پر، ہمارے ڈیٹا میں کوئی مماثل پروگرام نہیں ملا۔ کیا آپ بتا سکتے ہیں کہ آپ کو کس قسم کی مدد چاہیے؟"
          : currentLang === 'roman_urdu'
          ? "Aap ki maloomat ki bina par, hamare data mein koi mumasil program nahi mila. Kya aap bata sakte hain ke aap ko kis qisam ki madad chahiye?"
          : "Based on what you've shared, I couldn't find any matching programs. Could you tell me more about what kind of support you're looking for?";
        if (missingInfo.length > 0) {
          const nextQuestion = getNextQuestion(updatedProfile, missingInfo, currentLang);
          if (nextQuestion) {
            responseContent += `\n\n${nextQuestion}`;
          }
        }
      }
    } else if (missingInfo.length > 0) {
      const nextQuestion = getNextQuestion(updatedProfile, missingInfo, currentLang);
      responseContent = generateProfileUpdateResponse(updatedProfile, messageText, currentLang);
      if (nextQuestion) {
        responseContent += `\n\n${nextQuestion}`;
      }
      suggestions = currentLang === 'urdu'
        ? ['مجھے مالی معاونت چاہیے', 'میں کاروبار شروع کرنا چاہتا ہوں', 'مجھے صحت کی سہولت چاہیے']
        : currentLang === 'roman_urdu'
        ? ['sehat ki madad', 'maali madad', 'karobar shuru karna']
        : ['I need health support', 'I need financial help', 'I want to start a business'];
    } else {
      if (currentLang === 'urdu') {
        responseContent = "شکریہ! بہتر پروگرام تلاش کرنے کے لیے، بتائیں آپ کو کس قسم کی مدد چاہیے؟\n\n• صحت یا طبی مدد\n• مالی امداد\n• تعلیمی مدد\n• کاروبار یا زراعت کے قرضے\n• مہارت کی تربیت\n\nآپ کے لیے کیا سب سے مفید ہوگا؟";
        suggestions = ['صحت کی مدد', 'مالی امداد', 'کاروباری قرض', 'تعلیمی مدد'];
      } else if (currentLang === 'roman_urdu') {
        responseContent = "Shukriya! Behtar program talash karne ke liye, batayein aap ko kis qisam ki madad chahiye?\n\n• Sehat ya tibbi madad\n• Maali imdaad\n• Taleemi madad\n• Karobar ya zirat ke qarzay\n• Maharat ki tarbeet\n\nAap ke liye kya sab se mufeed hoga?";
        suggestions = ['sehat ki madad', 'maali imdaad', 'karobar qarz', 'taleemi madad'];
      } else {
        responseContent = "Thank you for sharing. To help you find the right programs, could you tell me what kind of support you're looking for? For example:\n\n• Health or medical support\n• Financial assistance\n• Education support\n• Business or agriculture loans\n• Skills training\n\nWhat would be most helpful for you?";
        suggestions = ['Health support', 'Financial assistance', 'Business loan', 'Education support'];
      }
    }
    
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseContent,
      programs: recommendedProgramIds.length > 0 ? recommendedProgramIds : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
    
    setMessages(prev => [...prev, assistantMsg]);
    setVoiceAssistantCaption(responseContent);
    if (isVoiceModeOpen && !isVoiceMuted) {
      speak(responseContent, currentLang, () => {
        if (isVoiceModeOpen && !manualStopRef.current && !isLoading) startRecognition(voiceLanguage);
      });
    } else if (isVoiceModeOpen && !manualStopRef.current) {
      startRecognition(voiceLanguage);
    }
    setIsLoading(false);
  };

  const startRecognition = (requestedVoiceLanguage: 'en' | 'ur' = voiceLanguage) => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      setVoiceError(t('assistant.voiceUnsupported', language));
      return;
    }

    setVoiceError('');
    stop();
    voiceTranscriptRef.current = '';
    voiceLiveTranscriptRef.current = '';
    setVoiceUserCaption('');
    voiceInputPrefixRef.current = input.trim();
    manualStopRef.current = false;
    voiceTurnSubmittingRef.current = false;
    isListeningRef.current = true;

    const recognition = new SpeechRecognitionAPI();
    recognition.lang = requestedVoiceLanguage === 'ur' ? 'ur-PK' : 'en-US';
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isListeningRef.current = true;
      setIsListening(true);
    };
    recognition.onresult = (event) => {
      if (voiceSilenceTimerRef.current) {
        window.clearTimeout(voiceSilenceTimerRef.current);
        voiceSilenceTimerRef.current = null;
      }
      let finalTranscript = '';
      let interimTranscript = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const transcript = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      voiceTranscriptRef.current = `${voiceTranscriptRef.current} ${finalTranscript}`.trim();
      const liveTranscript = `${voiceTranscriptRef.current} ${interimTranscript}`.trim();
      voiceLiveTranscriptRef.current = liveTranscript;
      setInput([voiceInputPrefixRef.current, liveTranscript].filter(Boolean).join(' '));
      setVoiceUserCaption(liveTranscript);

      if (isVoiceModeOpen && finalTranscript.trim()) {
        if (voiceSilenceTimerRef.current) window.clearTimeout(voiceSilenceTimerRef.current);
        voiceSilenceTimerRef.current = window.setTimeout(() => {
          recognition.stop();
        }, 1400);
      }
    };
    recognition.onerror = (event) => {
      if (event.error === 'language-not-supported' && requestedVoiceLanguage === 'ur' && recognition.lang === 'ur-PK') {
        recognition.lang = 'ur';
        try {
          recognition.start();
          return;
        } catch (error) {
          // Fall through to the regular voice error state.
        }
      }

      if (event.error === 'no-speech') return;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed' || event.error === 'audio-capture') {
        manualStopRef.current = true;
        isListeningRef.current = false;
        setIsListening(false);
        setVoiceError(t('assistant.voiceUnsupported', language));
      }
    };
    recognition.onnomatch = () => {
      if (isVoiceModeOpen) setVoiceError(requestedVoiceLanguage === 'ur' ? 'اردو آواز سمجھ نہیں آئی، براہ کرم دوبارہ بولیں۔' : 'I could not understand that. Please try again.');
    };
    recognition.onend = () => {
      if (voiceSilenceTimerRef.current) {
        window.clearTimeout(voiceSilenceTimerRef.current);
        voiceSilenceTimerRef.current = null;
      }

      const completedTranscript = voiceLiveTranscriptRef.current.trim();
      if (isVoiceModeOpen && completedTranscript && !voiceTurnSubmittingRef.current && !manualStopRef.current) {
        voiceTurnSubmittingRef.current = true;
        isListeningRef.current = false;
        setIsListening(false);
        recognitionRef.current = null;
        handleSend(completedTranscript);
        return;
      }

      if (!manualStopRef.current && isListeningRef.current) {
        try {
          recognition.start();
        } catch (error) {
          // The browser may still be closing the previous session; onend will retry if needed.
        }
        return;
      }
      isListeningRef.current = false;
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
      recognitionRef.current = null;
      isListeningRef.current = false;
      setIsListening(false);
      setVoiceError(t('assistant.voiceUnsupported', language));
    }
  };

  const toggleVoiceInput = () => {
    if (isListening) {
      manualStopRef.current = true;
      isListeningRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
      if (isVoiceModeOpen && input.trim() && !voiceTurnSubmittingRef.current) handleSend(input.trim());
      return;
    }
    startRecognition();
  };

  const toggleVoiceMode = () => {
    if (isVoiceModeOpen) {
      manualStopRef.current = true;
      isListeningRef.current = false;
      recognitionRef.current?.stop();
      if (voiceSilenceTimerRef.current) window.clearTimeout(voiceSilenceTimerRef.current);
      stop();
      setIsListening(false);
      setIsVoiceModeOpen(false);
      return;
    }
    setVoiceAssistantCaption('');
    setVoiceLanguage(language);
    setIsVoiceModeOpen(true);
    startRecognition(language);
  };

  const switchVoiceLanguage = () => {
    const nextLanguage = voiceLanguage === 'ur' ? 'en' : 'ur';
    setVoiceLanguage(nextLanguage);
    setLanguage(nextLanguage);
    if (isListening) {
      manualStopRef.current = true;
      isListeningRef.current = false;
      recognitionRef.current?.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    return () => {
      manualStopRef.current = true;
      isListeningRef.current = false;
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.abort();
      }
      if (voiceSilenceTimerRef.current) window.clearTimeout(voiceSilenceTimerRef.current);
      stop();
    };
  }, [stop]);
  
  const generateProfileUpdateResponse = (
    profile: UserProfile,
    message: string,
    lang: 'urdu' | 'roman_urdu' | 'english' = detectedLanguage
  ): string => {
    
    // Urdu responses
    if (lang === 'urdu') {
      const parts: string[] = [];
      if (profile.monthlyIncome) parts.push(`ماہانہ آمدن Rs. ${profile.monthlyIncome.toLocaleString()}`);
      if (profile.children) parts.push(`${profile.children} بچے`);
      if (profile.occupation) parts.push(`پیشہ: ${profile.occupation.replace('_', ' ')}`);
      if (profile.landAcres) parts.push(`${profile.landAcres} ایکڑ زمین`);
      if (profile.age) parts.push(`عمر ${profile.age} سال`);
      if (profile.province) parts.push(`صوبہ: ${profile.province}`);
      
      if (parts.length > 0) {
        return `شکریہ! میں نے نوٹ کر لیا ہے:\n${parts.map(p => `• ${p}`).join('\n')}\n\nبہتر مدد کے لیے، بتائیں آپ کو کس قسم کی سہولت چاہیے؟`;
      }
      return "شکریہ! آپ کو کس قسم کی مدد چاہیے؟";
    }
    
    // Roman Urdu responses
    if (lang === 'roman_urdu') {
      const parts: string[] = [];
      if (profile.monthlyIncome) parts.push(`mahina income Rs. ${profile.monthlyIncome.toLocaleString()}`);
      if (profile.children) parts.push(`${profile.children} bachay`);
      if (profile.occupation) parts.push(`kaam: ${profile.occupation.replace('_', ' ')}`);
      if (profile.landAcres) parts.push(`${profile.landAcres} acres zameen`);
      if (profile.age) parts.push(`umar ${profile.age} saal`);
      if (profile.province) parts.push(`suba: ${profile.province}`);
      
      if (parts.length > 0) {
        return `Shukriya! Main ne note kar liya hai:\n${parts.map(p => `• ${p}`).join('\n')}\n\nBehtar madad ke liye, batayein aap ko kis qisam ki sahulat chahiye?`;
      }
      return "Shukriya! Aap ko kis qisam ki madad chahiye?";
    }
    
    // English responses (default)
    const parts: string[] = [];
    if (profile.monthlyIncome) parts.push(`monthly income of Rs. ${profile.monthlyIncome.toLocaleString()}`);
    if (profile.children) parts.push(`${profile.children} child${profile.children > 1 ? 'ren' : ''}`);
    if (profile.occupation) parts.push(`work as a ${profile.occupation.replace('_', ' ')}`);
    if (profile.landAcres) parts.push(`${profile.landAcres} acres of land`);
    if (profile.age) parts.push(`age ${profile.age}`);
    if (profile.province) parts.push(`live in ${profile.province}`);
    
    if (parts.length > 0) {
      return `Thanks for sharing. I've noted that you ${parts.join(', ')}.\n\nTo give you the best recommendations, I need to understand what kind of support you're looking for.`;
    }
    
    return "Thanks for that information. Could you tell me more about what kind of support you need?";
  };
  
  const generateRecommendationResponse = (
    profile: UserProfile,
    recommendations: ReturnType<typeof getRecommendedPrograms>,
    missingInfo: string[],
    language: 'urdu' | 'roman_urdu' | 'english'
  ): string => {
    const parts: string[] = [];
    const isUrdu = language === 'urdu';
    const isRomanUrdu = language === 'roman_urdu';

    const statusText = (status: Parameters<typeof getEligibilityStatusText>[0]) => {
      if (isUrdu) {
        if (status === 'likely_match') return 'ممکنہ طور پر اہل';
        if (status === 'potential_match') return 'ممکنہ مطابقت';
        if (status === 'needs_more_information') return 'مزید معلومات درکار ہیں';
        return 'مزید تصدیق درکار ہے';
      }
      if (isRomanUrdu) {
        if (status === 'likely_match') return 'Mumkin hai aap eligible hon';
        if (status === 'potential_match') return 'Mumkinah mutabiqat';
        if (status === 'needs_more_information') return 'Mazeed maloomat darkar hai';
        return 'Mazeed tasdeeq darkar hai';
      }
      return getEligibilityStatusText(status);
    };
    
    // Summary of what we know
    parts.push(isUrdu ? '**آپ کی فراہم کردہ معلومات کی بنیاد پر:**\n' : isRomanUrdu ? '**Aap ki di hui maloomat ki bunyaad par:**\n' : "**Based on what you've told me:**\n");
    if (profile.monthlyIncome) parts.push(`${isUrdu ? '• ماہانہ آمدن' : isRomanUrdu ? '• Mahina income' : '• Monthly income'}: Rs. ${profile.monthlyIncome.toLocaleString()}`);
    if (profile.children) parts.push(`${isUrdu ? '• بچے' : isRomanUrdu ? '• Bachay' : '• Children'}: ${profile.children}`);
    if (profile.occupation) parts.push(`${isUrdu ? '• پیشہ' : isRomanUrdu ? '• Kaam' : '• Occupation'}: ${profile.occupation.replace('_', ' ')}`);
    if (profile.landAcres) parts.push(`${isUrdu ? '• زمین' : isRomanUrdu ? '• Zameen' : '• Land'}: ${profile.landAcres} acres`);
    if (profile.age) parts.push(`${isUrdu ? '• عمر' : isRomanUrdu ? '• Umar' : '• Age'}: ${profile.age}`);
    if (profile.province) parts.push(`${isUrdu ? '• صوبہ' : isRomanUrdu ? '• Suba' : '• Province'}: ${profile.province}`);
    if (profile.needs && profile.needs.length > 0) parts.push(`${isUrdu ? '• مطلوبہ مدد' : isRomanUrdu ? '• Darkar madad' : '• Looking for'}: ${profile.needs.join(', ')}`);
    
    parts.push(isUrdu ? '\n\n**متعلقہ پروگرامز:**\n' : isRomanUrdu ? '\n\n**Mumkinah mutaliqa programs:**\n' : '\n\n**Programs that may be relevant:**\n');
    
    recommendations.forEach((rec, index) => {
      const program = verifiedPrograms.find(p => p.id === rec.programId);
      if (!program) return;
      
      parts.push(`\n**${index + 1}. ${isUrdu ? program.nameUrdu || program.name : program.name}**`);
      parts.push(`_${isUrdu ? 'اہلیت کی حالت' : isRomanUrdu ? 'Eligibility status' : 'Status'}: ${statusText(rec.eligibilityStatus)}_`);
      
      if (rec.reasons.length > 0) {
        if (isUrdu) {
          parts.push('\nیہ پروگرام آپ کی فراہم کردہ معلومات کی بنیاد پر ممکنہ طور پر متعلقہ ہے۔');
        } else if (isRomanUrdu) {
          parts.push('\nYeh program aap ki di hui maloomat ki bunyaad par mumkinah tor par mutaliqa hai.');
        } else {
          parts.push('\nWhy it may be relevant:');
          rec.reasons.slice(0, 2).forEach(reason => parts.push(`• ${reason}`));
        }
      }
      
      if (rec.missingInformation.length > 0) {
        parts.push(`\n_${isUrdu ? 'مطلوبہ معلومات' : isRomanUrdu ? 'Darkar maloomat' : 'Missing information'}: ${rec.missingInformation.join(', ')}_`);
      }
      
      parts.push(`\n[View official source →](${program.source.url})`);
    });
    
    return parts.join('\n');
  };
  
  const generateProgramDetailResponse = (program: VerifiedProgram): string => {
    const parts: string[] = [];
    
    parts.push(`**${program.name}**`);
    if (program.nameUrdu) parts.push(`_${program.nameUrdu}_`);
    parts.push(`\n_Organization: ${program.organization}_`);
    parts.push(`\n\n**What it is:**\n${program.description}`);
    
    parts.push(`\n\n**Who it's for:**`);
    program.targetGroups.forEach(group => {
      parts.push(`• ${group}`);
    });
    
    parts.push(`\n\n**Benefits:**`);
    program.benefits.forEach(benefit => {
      parts.push(`• ${benefit}`);
    });
    
    parts.push(`\n\n**Key eligibility information:**`);
    if (program.eligibility.age) {
      if (program.eligibility.age.note) {
        parts.push(`• Age: ${program.eligibility.age.note}`);
      } else if (program.eligibility.age.min || program.eligibility.age.max) {
        const ageRange = [];
        if (program.eligibility.age.min) ageRange.push(`min ${program.eligibility.age.min}`);
        if (program.eligibility.age.max) ageRange.push(`max ${program.eligibility.age.max}`);
        parts.push(`• Age: ${ageRange.join(', ')} years`);
      }
    }
    if (program.eligibility.familyStatus) {
      program.eligibility.familyStatus.forEach(status => {
        parts.push(`• ${status}`);
      });
    }
    if (program.eligibility.location?.provinces) {
      parts.push(`• Location: ${program.eligibility.location.provinces.join(', ')}`);
    }
    if (program.eligibility.other) {
      program.eligibility.other.forEach(other => {
        parts.push(`• ${other}`);
      });
    }
    
    parts.push(`\n\n**Required documents:**`);
    program.documents.forEach(doc => {
      parts.push(`• ${doc}`);
    });
    
    parts.push(`\n\n**How to apply:**`);
    program.applicationSteps.forEach((step, i) => {
      parts.push(`${i + 1}. ${step}`);
    });
    
    parts.push(`\n\n**Where to apply:**`);
    program.applicationChannels.forEach(channel => {
      parts.push(`• ${channel}`);
    });
    
    parts.push(`\n\n---`);
    parts.push(`\n**Official source:** [${program.source.name}](${program.source.url})`);
    parts.push(`\n_Last verified: ${program.source.verifiedAt}_`);
    parts.push(`\n\n⚠️ _Information may change. Please verify with the official authority._`);
    
    return parts.join('\n');
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  const profileItems = formatProfileForDisplay(userProfile);
  const missingInfo = getMissingInformation(userProfile);
  
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Logo compact />
              <div>
                <h1 className="text-xl font-bold text-navy-900">{t('assistant.brandTitle', language)}</h1>
                <p className="text-xs text-navy-500">{t('assistant.powered', language)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleVoiceMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isVoiceModeOpen ? 'bg-cyan-100 text-cyan-800' : 'bg-linear-to-r from-emerald-700 to-cyan-700 text-white shadow-md shadow-emerald-900/20 hover:from-emerald-600 hover:to-cyan-600'
                }`}
                aria-label={isVoiceModeOpen ? t('assistant.exitVoice', language) : t('assistant.openVoice', language)}
              >
                <Headphones className="w-4 h-4" />
                <span className="hidden sm:inline">{t('assistant.voiceMode', language)}</span>
              </button>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className={`lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showProfile ? 'bg-navy-100 text-navy-800' : 'bg-white border border-navy-200 text-navy-600'
                }`}
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">{t('assistant.profile', language)}</span>
              </button>
            </div>
          </div>
          
          {/* Chat Container */}
          <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
            <div className="h-125 sm:h-150 overflow-y-auto p-4 sm:p-6 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === 'assistant' ? 'bg-navy-100' : 'bg-navy-800'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <Bot className="w-4 h-4 text-navy-700" />
                    ) : (
                      <User className="w-4 h-4 text-white" />
                    )}
                  </div>
                  
                  <div className={`max-w-[85%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'assistant' 
                        ? 'bg-navy-50 text-navy-800 rounded-tl-sm' 
                        : 'bg-navy-800 text-white rounded-tr-sm'
                    }`}>
                      {msg.content.split('\n').map((line, i) => {
                        // Handle markdown-like formatting
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return <p key={i} className="font-bold my-1">{line.slice(2, -2)}</p>;
                        }
                        if (line.startsWith('_') && line.endsWith('_')) {
                          return <p key={i} className="italic text-navy-600 my-1">{line.slice(1, -1)}</p>;
                        }
                        if (line.startsWith('• ') || line.startsWith('- ')) {
                          return <p key={i} className="ml-2 my-0.5">{line}</p>;
                        }
                        if (line.startsWith('---')) {
                          return <hr key={i} className="my-3 border-navy-200" />;
                        }
                        if (line.startsWith('[View official source')) {
                          const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
                          if (match) {
                            return (
                              <a key={i} href={match[2]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-navy-700 hover:text-navy-900 font-medium my-1">
                                {match[1]} <ExternalLink className="w-3 h-3" />
                              </a>
                            );
                          }
                        }
                        if (line.trim() === '') return <br key={i} />;
                        return <p key={i} className="my-0.5">{line}</p>;
                      })}
                    </div>
                    
                    {/* Program Cards */}
                    {msg.programs && msg.programs.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {msg.programs.map(pid => {
                          const program = verifiedPrograms.find(p => p.id === pid);
                          if (!program) return null;
                          return (
                            <Link
                              key={pid}
                              to={`/programs/${pid}`}
                              className="block p-3 bg-white border border-navy-100 rounded-xl hover:border-navy-300 hover:shadow-sm transition-all text-left"
                            >
                              <p className="font-medium text-sm text-navy-900">{program.name}</p>
                              <p className="text-xs text-navy-500">{program.organization}</p>
                              <p className="text-xs text-navy-600 mt-1 line-clamp-1">{program.purpose}</p>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Suggestions */}
                    {msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.suggestions.map((sug, i) => (
                          <button
                            key={i}
                            onClick={() => handleSend(sug)}
                            className="px-3 py-1.5 bg-white border border-navy-200 rounded-lg text-xs font-medium text-navy-600 hover:bg-navy-50 hover:border-navy-300 transition-colors"
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-navy-100 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-navy-700" />
                  </div>
                  <div className="bg-navy-50 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-navy-500 animate-spin" />
                      <span className="text-xs text-navy-500">{loadingMessages[loadingMessageIndex]}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="border-t border-navy-100 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t('assistant.placeholderSituation', language)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 bg-navy-50 border border-navy-200 rounded-xl text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={toggleVoiceInput}
                  disabled={isLoading}
                  aria-label={isListening ? t('assistant.stopVoice', language) : t('assistant.startVoice', language)}
                  title={isListening ? t('assistant.stopVoice', language) : t('assistant.startVoice', language)}
                  className={`min-w-11 min-h-11 px-3 rounded-xl border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    isListening
                      ? 'border-red-300 bg-red-50 text-red-600 animate-pulse'
                      : 'border-navy-200 bg-white text-navy-600 hover:bg-navy-50 hover:border-navy-300'
                  }`}
                >
                  {isListening ? <MicOff className="w-4 h-4 mx-auto" /> : <Mic className="w-4 h-4 mx-auto" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  aria-label={t('assistant.send', language)}
                  title={t('assistant.send', language)}
                  className="px-4 py-2.5 bg-navy-800 text-white rounded-xl hover:bg-navy-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>
              {isListening && (
                <p className="mt-2 text-xs text-red-600" role="status">
                  {t('assistant.listening', language)}
                </p>
              )}
              {voiceError && (
                <p className="mt-2 text-xs text-amber-700" role="alert">
                  {voiceError}
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Profile Panel */}
        <div className={`${showProfile ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-2xl border border-navy-100 shadow-sm p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-navy-900 flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-navy-600" />
                {language === 'ur' ? 'آپ کا پروفائل' : 'Your Profile'}
              </h2>
              <button
                onClick={() => setShowProfile(false)}
                className="lg:hidden p-1 text-navy-400 hover:text-navy-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {profileItems.length > 0 ? (
              <div className="space-y-2">
                {profileItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    <span className="text-navy-700">{item}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-navy-500 italic">{t('assistant.noInformation', language)}</p>
            )}
            
            {missingInfo.length > 0 && (
              <div className="mt-4 pt-4 border-t border-navy-100">
                <p className="text-xs font-medium text-navy-500 mb-2">{t('assistant.missing', language)}</p>
                <div className="flex flex-wrap gap-1">
                  {missingInfo.map((info, i) => (
                    <span key={i} className="px-2 py-0.5 bg-yellow-50 text-yellow-700 text-xs rounded-full border border-yellow-200">
                      {info.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Detected Language */}
            <div className="mt-4 pt-4 border-t border-navy-100">
              <p className="text-xs font-medium text-navy-500 mb-2">{t('assistant.chatLanguage', language)}</p>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs rounded-full border ${
                  detectedLanguage === 'urdu' ? 'bg-green-50 text-green-700 border-green-200' :
                  detectedLanguage === 'roman_urdu' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-gray-50 text-gray-700 border-gray-200'
                }`}>
                  {detectedLanguage === 'urdu' ? 'اردو (Urdu)' :
                   detectedLanguage === 'roman_urdu' ? 'Roman Urdu' :
                   'English'}
                </span>
              </div>
              <p className="text-xs text-navy-400 mt-1">{t('assistant.respondLanguage', language)}</p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-navy-100">
              <p className="text-xs text-navy-500">
                💡 {t('assistant.privacy', language)}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            {t('assistant.disclaimerFull', language)}
          </p>
        </div>
      </div>

      <CopilotVoiceModal
        isOpen={isVoiceModeOpen}
        isListening={isListening}
        isProcessing={isLoading}
        isSpeaking={isSpeaking}
        isPaused={isPaused}
        isMuted={isVoiceMuted}
        userTranscript={voiceUserCaption || input}
        assistantTranscript={voiceAssistantCaption}
        language={voiceLanguage}
        onMuteToggle={() => {
          setIsVoiceMuted(prev => {
            const nextMuted = !prev;
            if (nextMuted) stop();
            return nextMuted;
          });
        }}
        onPauseToggle={isPaused ? resume : pause}
        onStopSpeaking={stop}
        onExit={toggleVoiceMode}
        onHangUp={toggleVoiceMode}
        onSwitchLanguage={switchVoiceLanguage}
        onToggleListening={toggleVoiceInput}
        onSend={() => handleSend()}
      />
    </div>
  );
}
