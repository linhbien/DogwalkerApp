import React, { useState } from 'react';
import {
  Camera,
  Check,
  CheckCheck,
  Mic,
  Paperclip,
  Phone,
  Send,
  Sparkles,
  Video,
} from 'lucide-react';
import { ChatMessage, Language, Role } from '../types';
import { translations } from '../i18n/translations';

interface MessagingViewProps {
  messages: ChatMessage[];
  currentRole: Role;
  language: Language;
  onSendMessage: (content: string, isAutomated?: boolean, photoUrl?: string) => void;
}

export const MessagingView: React.FC<MessagingViewProps> = ({
  messages,
  currentRole,
  language,
  onSendMessage,
}) => {
  const t = translations[language];

  const [inputVal, setInputVal] = useState<string>('');
  const [isSimulatingAudio, setIsSimulatingAudio] = useState<boolean>(false);

  const quickChips = [
    t.update_arrived,
    t.update_started,
    t.update_potty,
    t.update_heading_back,
    t.update_safe_sound,
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onSendMessage(inputVal.trim());
    setInputVal('');
  };

  const handleChipClick = (chip: string) => {
    onSendMessage(chip, true);
  };

  const handleSendVoiceNote = () => {
    setIsSimulatingAudio(true);
    setTimeout(() => {
      onSendMessage('🎙️ Voice Note (0:14) — "Milo is walking right beside me, doing fantastic on leash today!"', false);
      setIsSimulatingAudio(false);
    }, 1200);
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
      {/* Top chat header */}
      <div className="p-4 sm:p-5 bg-stone-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={
                currentRole === 'walker'
                  ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
              }
              alt="Avatar"
              className="w-12 h-12 rounded-2xl object-cover border-2 border-stone-700"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-stone-900" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base text-white">
                {currentRole === 'walker' ? 'Sarah Jenkins (Milo & Luna\'s Mom)' : 'Alex Rivera (Walker Pro)'}
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE CHAT
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {currentRole === 'walker' ? 'Home: 782 Willow Oak Blvd' : 'Verified Walker Pro • ★ 4.98'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-stone-400">
          <button
            onClick={() => alert('Simulated high-priority phone call initiated.')}
            className="p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition"
            title="Call Client"
          >
            <Phone className="w-4 h-4" />
          </button>
          <button
            onClick={() => alert('Simulated video check-in stream started.')}
            className="p-2.5 rounded-xl hover:bg-stone-800 text-stone-300 hover:text-white transition"
            title="Live Video Check"
          >
            <Video className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick update chips for walker */}
      {currentRole === 'walker' && (
        <div className="bg-stone-100 p-2.5 border-b border-stone-200 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider pl-1 whitespace-nowrap">
            {t.quick_updates}:
          </span>
          {quickChips.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleChipClick(chip)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white hover:bg-amber-100 text-stone-700 hover:text-stone-900 border border-stone-200 shadow-xs whitespace-nowrap transition active:scale-95"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Messages area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-stone-50/60">
        {messages.map((msg) => {
          const isMe = msg.senderRole === currentRole;

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-bold text-stone-500">
                  {msg.senderName}
                </span>
                <span className="text-[10px] text-stone-400 font-mono">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div
                className={`max-w-md p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed space-y-2 ${
                  isMe
                    ? 'bg-amber-500 text-stone-950 font-medium rounded-tr-none'
                    : msg.isAutomated
                    ? 'bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-tl-none font-semibold'
                    : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none font-normal'
                }`}
              >
                {msg.isAutomated && (
                  <div className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-700 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Live Walk Update</span>
                  </div>
                )}

                <p>{msg.content}</p>

                {msg.photoUrl && (
                  <img
                    src={msg.photoUrl}
                    alt="Chat Attachment"
                    className="rounded-xl w-full max-h-56 object-cover shadow-sm mt-2 border border-stone-200"
                  />
                )}
              </div>

              <div className="flex items-center gap-1 mt-0.5 px-1 text-[10px] text-stone-400 font-mono">
                {isMe && <CheckCheck className="w-3.5 h-3.5 text-amber-600" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="p-3 bg-white border-t border-stone-200 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSendVoiceNote}
          disabled={isSimulatingAudio}
          className={`p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-amber-600 hover:bg-amber-50 transition ${
            isSimulatingAudio ? 'animate-pulse bg-rose-50 text-rose-600' : ''
          }`}
          title="Send Quick Voice Note"
        >
          <Mic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            const sample = 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80';
            onSendMessage('Here is another live action snapshot from our walk! 🐾', false, sample);
          }}
          className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:text-emerald-600 hover:bg-emerald-50 transition"
          title="Attach Pet Photo"
        >
          <Camera className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={t.type_message_placeholder}
          className="flex-1 text-xs py-2.5 px-4 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-stone-800"
        />

        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="p-2.5 rounded-xl bg-stone-900 hover:bg-amber-500 hover:text-stone-950 text-white font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
