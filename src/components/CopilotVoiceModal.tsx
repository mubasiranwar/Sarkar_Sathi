import { Headphones, Languages, Mic, MicOff, Pause, PhoneOff, Play, Sparkles, Square, Volume2, VolumeX, X } from 'lucide-react';
import { t } from '../data/translations';

interface CopilotVoiceModalProps {
  isOpen: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  isPaused: boolean;
  isMuted: boolean;
  userTranscript: string;
  assistantTranscript: string;
  language: 'en' | 'ur';
  onMuteToggle: () => void;
  onPauseToggle: () => void;
  onStopSpeaking: () => void;
  onExit: () => void;
  onHangUp: () => void;
  onSwitchLanguage: () => void;
  onToggleListening: () => void;
  onSend: () => void;
}

export default function CopilotVoiceModal({
  isOpen, isListening, isProcessing, isSpeaking, isPaused, isMuted,
  userTranscript, assistantTranscript, language, onMuteToggle, onPauseToggle,
  onStopSpeaking, onExit, onHangUp, onSwitchLanguage, onToggleListening, onSend,
}: CopilotVoiceModalProps) {
  if (!isOpen) return null;

  const dictionaryLanguage = language === 'ur' ? 'ur' : 'en';
  const stateLabel = isProcessing ? t('voice.thinking', dictionaryLanguage) : isSpeaking ? t('voice.speaking', dictionaryLanguage) : isListening ? t('voice.listening', dictionaryLanguage) : t('voice.ready', dictionaryLanguage);
  const orbState = isProcessing ? 'voice-orb-processing' : isSpeaking ? 'voice-orb-speaking' : 'voice-orb-listening';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label={t('voice.title', dictionaryLanguage)}>
      <div className="relative flex min-h-[min(720px,calc(100vh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-4xl border border-emerald-200/20 bg-[radial-gradient(circle_at_50%_20%,#123b3a_0%,#0f172a_52%,#07111b_100%)] text-white shadow-2xl shadow-emerald-950/50">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-200"><Headphones className="h-5 w-5" /></div>
            <div><h2 className="font-semibold">{t('voice.title', dictionaryLanguage)}</h2><p className="text-xs text-white/55">{stateLabel}</p></div>
          </div>
          <button onClick={onExit} className="rounded-full p-2 text-white/65 hover:bg-white/10 hover:text-white" aria-label={t('voice.exit', dictionaryLanguage)} title={t('voice.exit', dictionaryLanguage)}><X className="h-5 w-5" /></button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
          <div className={`voice-orb ${orbState}`} aria-hidden="true">
            <div className="voice-orb-ring voice-orb-ring-one" /><div className="voice-orb-ring voice-orb-ring-two" />
            <div className="voice-orb-core"><Sparkles className="h-8 w-8" /></div>
          </div>
          <p className="mt-8 text-sm font-medium text-emerald-100">{stateLabel}</p>
          <div className="mt-7 w-full space-y-3 text-left">
            {userTranscript && <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/80"><span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-emerald-200/70">{t('voice.you', dictionaryLanguage)}</span>{userTranscript}</div>}
            {assistantTranscript && <div className="rounded-2xl border border-emerald-200/10 bg-emerald-300/10 px-4 py-3 text-sm text-emerald-50"><span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-emerald-200/70">Sarkar Sathi</span>{assistantTranscript}</div>}
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-3 flex flex-wrap justify-center gap-2 text-xs">
            <button onClick={onSwitchLanguage} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-white/75 hover:bg-white/10" title="Switch language"><Languages className="h-3.5 w-3.5" />{language === 'ur' ? 'اردو' : 'English'}</button>
            <button onClick={onMuteToggle} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-white/75 hover:bg-white/10" title={isMuted ? t('voice.unmute', dictionaryLanguage) : t('voice.mute', dictionaryLanguage)}>{isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}{isMuted ? t('voice.unmute', dictionaryLanguage) : t('voice.mute', dictionaryLanguage)}</button>
            {isSpeaking && <button onClick={onPauseToggle} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-white/75 hover:bg-white/10">{isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}{isPaused ? t('voice.resume', dictionaryLanguage) : t('voice.pause', dictionaryLanguage)}</button>}
            {isSpeaking && <button onClick={onStopSpeaking} className="inline-flex items-center gap-2 rounded-full border border-red-300/20 px-3 py-2 text-red-200 hover:bg-red-400/10"><Square className="h-3.5 w-3.5" />{t('voice.stop', dictionaryLanguage)}</button>}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onToggleListening} className={`flex h-14 w-14 items-center justify-center rounded-full transition ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-emerald-300 text-slate-950 hover:bg-emerald-200'}`} aria-label={isListening ? t('voice.stopListening', dictionaryLanguage) : t('voice.startListening', dictionaryLanguage)}>{isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}</button>
            <button onClick={onSend} disabled={!userTranscript || isProcessing} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40">{t('voice.send', dictionaryLanguage)}</button>
            <button onClick={onHangUp} className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/25 transition hover:bg-red-400" aria-label={t('voice.hangup', dictionaryLanguage)} title={t('voice.hangup', dictionaryLanguage)}><PhoneOff className="h-5 w-5" /></button>
          </div>
          <p className="mt-3 text-center text-[11px] text-white/45">{t('voice.speakHint', dictionaryLanguage)}</p>
        </div>
      </div>
    </div>
  );
}
