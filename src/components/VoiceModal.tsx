import { Headphones, Languages, Mic, MicOff, Pause, Play, Sparkles, Square, Volume2, VolumeX, X } from 'lucide-react';

interface VoiceModalProps {
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
  onSwitchLanguage: () => void;
  onToggleListening: () => void;
  onSend: () => void;
}

export default function VoiceModal({
  isOpen,
  isListening,
  isProcessing,
  isSpeaking,
  isPaused,
  isMuted,
  userTranscript,
  assistantTranscript,
  language,
  onMuteToggle,
  onPauseToggle,
  onStopSpeaking,
  onExit,
  onSwitchLanguage,
  onToggleListening,
  onSend,
}: VoiceModalProps) {
  if (!isOpen) return null;

  const stateLabel = isProcessing ? 'Thinking...' : isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready when you are';
  const orbState = isProcessing ? 'voice-orb-processing' : isSpeaking ? 'voice-orb-speaking' : 'voice-orb-listening';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Voice conversation mode">
      <div className="relative flex min-h-[min(720px,calc(100vh-2rem))] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-navy-900 text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/15 text-cyan-200"><Headphones className="h-5 w-5" /></div>
            <div>
              <h2 className="font-semibold">Voice Conversation</h2>
              <p className="text-xs text-white/55">{stateLabel}</p>
            </div>
          </div>
          <button onClick={onExit} className="rounded-full p-2 text-white/65 hover:bg-white/10 hover:text-white" aria-label="Exit Voice Mode" title="Exit Voice Mode"><X className="h-5 w-5" /></button>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center px-6 py-8 text-center">
          <div className={`voice-orb ${orbState}`} aria-hidden="true">
            <div className="voice-orb-ring voice-orb-ring-one" />
            <div className="voice-orb-ring voice-orb-ring-two" />
            <div className="voice-orb-core"><Sparkles className="h-8 w-8" /></div>
          </div>
          <p className="mt-8 text-sm font-medium text-cyan-100">{stateLabel}</p>

          <div className="mt-7 w-full space-y-3 text-left">
            {userTranscript && <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/80"><span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">You</span>{userTranscript}</div>}
            {assistantTranscript && <div className="rounded-2xl bg-cyan-300/10 px-4 py-3 text-sm text-cyan-50"><span className="mb-1 block text-[10px] uppercase tracking-[0.18em] text-cyan-200/70">Sarkar Sathi</span>{assistantTranscript}</div>}
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-4">
          <div className="mb-3 flex flex-wrap justify-center gap-2 text-xs">
            <button onClick={onSwitchLanguage} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-white/75 hover:bg-white/10" title="Switch language"><Languages className="h-3.5 w-3.5" />{language === 'ur' ? 'اردو' : 'English'}</button>
            <button onClick={onMuteToggle} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-white/75 hover:bg-white/10" title={isMuted ? 'Unmute voice' : 'Mute voice'}>{isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}{isMuted ? 'Unmute' : 'Mute'}</button>
            {isSpeaking && <button onClick={onPauseToggle} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-white/75 hover:bg-white/10">{isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}{isPaused ? 'Resume' : 'Pause'}</button>}
            {isSpeaking && <button onClick={onStopSpeaking} className="inline-flex items-center gap-2 rounded-full border border-red-300/20 px-3 py-2 text-red-200 hover:bg-red-400/10"><Square className="h-3.5 w-3.5" />Stop</button>}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button onClick={onToggleListening} className={`flex h-14 w-14 items-center justify-center rounded-full transition ${isListening ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-cyan-300 text-navy-950 hover:bg-cyan-200'}`} aria-label={isListening ? 'Stop listening' : 'Start listening'}>{isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}</button>
            <button onClick={onSend} disabled={!userTranscript || isProcessing} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy-900 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:opacity-40">Send to assistant</button>
          </div>
          <p className="mt-3 text-center text-[11px] text-white/45">Review the transcript, then send it when you are ready.</p>
        </div>
      </div>
    </div>
  );
}
