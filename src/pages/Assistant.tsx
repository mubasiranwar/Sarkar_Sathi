import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { t } from '../data/translations';
import { programs } from '../data/programs';
import { searchPrograms } from '../lib/programs';
import { 
  Send, Bot, User, Sparkles, AlertTriangle, 
  ArrowRight, Search, Info, MessageCircle,
  Loader2
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  programs?: string[];
  suggestions?: string[];
  nextSteps?: string[];
  documents?: string[];
}

interface ApiResponse {
  answer: string;
  intent?: string;
  followUpQuestion?: string | null;
  recommendedPrograms?: string[];
  eligibilityConsiderations?: string[];
  documents?: string[];
  nextSteps?: string[];
  sources?: string[];
}

// Loading messages for progressive UX
const loadingMessages = [
  'Understanding your request...',
  'Finding relevant services...',
  'Preparing your next steps...',
];

// Rule-based fallback assistant
function generateFallbackResponse(query: string): Message {
  const lowerQuery = query.toLowerCase();
  const matchedPrograms = searchPrograms(query);
  
  let responseText = '';
  let suggestions: string[] = [];
  
  if (lowerQuery.includes('financial') || lowerQuery.includes('money') || lowerQuery.includes('cash') || lowerQuery.includes('support') || lowerQuery.includes('madad')) {
    responseText = "I can help you find financial support programs. Based on your query, here are some programs that may be relevant:";
    suggestions = ['Tell me about BISP', 'What about Sehat Card?', 'Show education stipends'];
  } else if (lowerQuery.includes('scholarship') || lowerQuery.includes('education') || lowerQuery.includes('school') || lowerQuery.includes('study') || lowerQuery.includes('taleem')) {
    responseText = "Here are education-related programs that may help you:";
    suggestions = ['What documents do I need?', 'Who is eligible?', 'How to apply?'];
  } else if (lowerQuery.includes('health') || lowerQuery.includes('medical') || lowerQuery.includes('hospital') || lowerQuery.includes('sehat') || lowerQuery.includes('صحت')) {
    responseText = "For health-related support, here are relevant programs:";
    suggestions = ['How to get Sehat Card?', 'What does it cover?', 'Where can I go?'];
  } else if (lowerQuery.includes('business') || lowerQuery.includes('loan') || lowerQuery.includes('startup') || lowerQuery.includes('karobar')) {
    responseText = "Here are business support programs that may interest you:";
    suggestions = ['What is the loan amount?', 'Who can apply?', 'What documents are needed?'];
  } else if (lowerQuery.includes('housing') || lowerQuery.includes('home') || lowerQuery.includes('house') || lowerQuery.includes('ghar')) {
    responseText = "Here are housing-related programs:";
    suggestions = ['Who is eligible?', 'What are the requirements?'];
  } else if (lowerQuery.includes('eligib') || lowerQuery.includes('qualif') || lowerQuery.includes('can i apply')) {
    responseText = "To check your eligibility, I recommend using our Eligibility Checker which will ask you a few questions and match you with relevant programs automatically.";
    suggestions = [];
  } else if (lowerQuery.includes('document') || lowerQuery.includes('cnic') || lowerQuery.includes('paper')) {
    responseText = "Most government programs require these basic documents:\n\n• Valid CNIC (Computerized National Identity Card)\n• Proof of residence\n• Family registration information (B-Form for children)\n• Income proof (if applicable)\n\nSpecific programs may require additional documents. Check each program's details for the complete list.";
    suggestions = ['What is BISP?', 'Show me programs'];
  } else if (lowerQuery.includes('bisp') || lowerQuery.includes('benazir')) {
    responseText = "BISP (Benazir Income Support Programme) is Pakistan's largest social safety net program. The main component is Benazir Kafaalat, which provides quarterly cash transfers to eligible low-income families.\n\nTo check if you qualify, you can send your CNIC number to 8500 or visit your nearest BISP tehsil office.";
    suggestions = ['What documents do I need?', 'How to register?'];
  } else {
    responseText = "I can help you find information about Pakistan's government programs and services. You can ask me about:\n\n• Financial support programs\n• Education and scholarships\n• Health services\n• Business loans\n• Housing programs\n• Required documents\n• Eligibility criteria\n\nWhat would you like to know more about?";
    suggestions = ['Find financial support', 'Scholarships for students', 'Healthcare programs', 'Business support'];
  }
  
  const programIds = matchedPrograms.slice(0, 3).map(p => p.id);
  
  return {
    id: Date.now().toString(),
    role: 'assistant',
    content: responseText,
    programs: programIds.length > 0 ? programIds : undefined,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
}

export default function AssistantPage() {
  const { language } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm Sarkar Sathi, your guide to government services. I can help you find programs, understand eligibility, and know what documents you need.\n\nHow can I help you today?",
      suggestions: ['Find financial support', 'Scholarships for students', 'Healthcare programs', 'Business support'],
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Check if API is available on mount
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setApiAvailable(data.qwenConfigured === true);
      })
      .catch(() => {
        setApiAvailable(false);
      });
  }, []);
  
  // Progressive loading messages
  useEffect(() => {
    if (!isLoading) return;
    
    const interval = setInterval(() => {
      setLoadingMessageIndex(prev => {
        if (prev < loadingMessages.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);
    
    return () => clearInterval(interval);
  }, [isLoading]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  const handleSend = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;
    
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
    
    // Try API first
    if (apiAvailable) {
      try {
        // Build conversation history for context
        const conversationHistory = messages
          .filter(m => m.role !== 'assistant' || m.id !== '1') // Skip initial greeting
          .concat(userMsg)
          .map(m => ({ role: m.role, content: m.content }));
        
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: conversationHistory }),
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data: ApiResponse = await response.json();
        
        const assistantMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer,
          programs: data.recommendedPrograms && data.recommendedPrograms.length > 0 
            ? data.recommendedPrograms 
            : undefined,
          suggestions: data.followUpQuestion ? [data.followUpQuestion] : undefined,
          nextSteps: data.nextSteps,
          documents: data.documents,
        };
        
        setMessages(prev => [...prev, assistantMsg]);
      } catch (error) {
        console.error('[Sarkar Sathi] API error, using fallback:', error);
        // Fall back to rule-based
        const fallbackResponse = generateFallbackResponse(messageText);
        fallbackResponse.id = (Date.now() + 1).toString();
        setMessages(prev => [...prev, fallbackResponse]);
      }
    } else {
      // Use rule-based fallback
      // Small delay for UX consistency
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 500));
      const fallbackResponse = generateFallbackResponse(messageText);
      fallbackResponse.id = (Date.now() + 1).toString();
      setMessages(prev => [...prev, fallbackResponse]);
    }
    
    setIsLoading(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 mx-auto mb-3 bg-navy-800 rounded-2xl flex items-center justify-center">
          <Sparkles className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-navy-900">{t('assistant.title', language)}</h1>
        <p className="text-navy-500 text-sm mt-1">{t('assistant.subtitle', language)}</p>
        {apiAvailable === false && (
          <p className="text-xs text-amber-600 mt-2 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Using offline mode — AI assistant unavailable
          </p>
        )}
      </div>
      
      {/* Chat Area */}
      <div className="bg-white rounded-2xl border border-navy-100 shadow-sm overflow-hidden">
        <div className="h-[400px] sm:h-[500px] overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'assistant' ? 'bg-navy-100' : 'bg-navy-800'
              }`}>
                {msg.role === 'assistant' ? (
                  <Bot className="w-4 h-4 text-navy-700" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              
              {/* Message */}
              <div className={`max-w-[80%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block p-3 sm:p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'assistant' 
                    ? 'bg-navy-50 text-navy-800 rounded-tl-sm' 
                    : 'bg-navy-800 text-white rounded-tr-sm'
                }`}>
                  {msg.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      {i < msg.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
                
                {/* Program Cards */}
                {msg.programs && msg.programs.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {msg.programs.map(pid => {
                      const program = programs.find(p => p.id === pid);
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
                
                {/* Next Steps */}
                {msg.nextSteps && msg.nextSteps.length > 0 && (
                  <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-xs font-semibold text-green-700 mb-1">Next Steps:</p>
                    <ul className="space-y-1">
                      {msg.nextSteps.map((step, i) => (
                        <li key={i} className="text-xs text-green-700 flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-green-500 mt-1.5 shrink-0"></span>
                          {step}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {/* Documents */}
                {msg.documents && msg.documents.length > 0 && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-xl">
                    <p className="text-xs font-semibold text-blue-700 mb-1">Documents you may need:</p>
                    <ul className="space-y-1">
                      {msg.documents.map((doc, i) => (
                        <li key={i} className="text-xs text-blue-700 flex items-start gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                          {doc}
                        </li>
                      ))}
                    </ul>
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
          
          {/* Loading indicator */}
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
              placeholder={t('assistant.placeholder', language)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-navy-50 border border-navy-200 rounded-xl text-sm text-navy-900 placeholder-navy-400 focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-navy-800 text-white rounded-xl hover:bg-navy-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Disclaimer */}
      <div className="mt-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-700">
            {t('assistant.disclaimer', language)}
          </p>
        </div>
      </div>
      
      {/* Quick Links */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          to="/eligibility"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-navy-100 hover:border-navy-300 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center">
            <Search className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <p className="font-medium text-sm text-navy-900">Check Eligibility</p>
            <p className="text-xs text-navy-500">Find programs matched to you</p>
          </div>
        </Link>
        <Link
          to="/programs"
          className="flex items-center gap-3 p-4 bg-white rounded-xl border border-navy-100 hover:border-navy-300 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-navy-50 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-5 h-5 text-navy-600" />
          </div>
          <div>
            <p className="font-medium text-sm text-navy-900">Browse Programs</p>
            <p className="text-xs text-navy-500">Explore all available services</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
