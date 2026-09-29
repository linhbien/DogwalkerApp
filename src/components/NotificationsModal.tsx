import React, { useState } from 'react';
import {
  Bell,
  Check,
  CheckCheck,
  DollarSign,
  Mail,
  MessageSquare,
  MessageSquareShare,
  Send,
  Smartphone,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { Language, PushNotification } from '../types';
import { translations } from '../i18n/translations';

interface NotificationsModalProps {
  notifications: PushNotification[];
  language: Language;
  onClose: () => void;
  onMarkAllRead: () => void;
  onSelectAction: (actionKey: string) => void;
  onTriggerTestPush: (type: 'visit' | 'payment' | 'performance') => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  notifications,
  language,
  onClose,
  onMarkAllRead,
  onSelectAction,
  onTriggerTestPush,
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'notifications' | 'reminders_preview'>('notifications');
  const [smsEnabled, setSmsEnabled] = useState<boolean>(true);
  const [emailEnabled, setEmailEnabled] = useState<boolean>(true);

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-5 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-stone-900 tracking-tight">
                {t.notifications_title}
              </h3>
              <p className="text-xs text-stone-500">
                Live push alerts, performance milestones & automated client reminders.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'notifications'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Activity ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab('reminders_preview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
              activeTab === 'reminders_preview'
                ? 'bg-amber-500 text-stone-950 shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>SMS & Email Automation</span>
          </button>
        </div>

        {activeTab === 'notifications' ? (
          <div className="space-y-4 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={onMarkAllRead}
                className="text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{t.mark_all_read}</span>
              </button>

              {/* Simulation test triggers */}
              <div className="flex items-center gap-1.5">
                <span className="text-stone-400 text-[11px]">Test Alert:</span>
                <button
                  onClick={() => onTriggerTestPush('visit')}
                  className="px-2 py-0.5 rounded-md bg-stone-100 hover:bg-stone-200 text-[10px] font-bold text-stone-700"
                >
                  Visit
                </button>
                <button
                  onClick={() => onTriggerTestPush('performance')}
                  className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-[10px] font-bold text-amber-900"
                >
                  Milestone
                </button>
                <button
                  onClick={() => onTriggerTestPush('payment')}
                  className="px-2 py-0.5 rounded-md bg-emerald-100 hover:bg-emerald-200 text-[10px] font-bold text-emerald-900"
                >
                  Payment
                </button>
              </div>
            </div>

            {notifications.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-8">{t.no_notifications}</p>
            ) : (
              notifications.map((notif) => {
                let badgeColor = 'bg-stone-100 text-stone-700';
                let icon = <Bell className="w-4 h-4" />;

                if (notif.type === 'visit') {
                  badgeColor = 'bg-emerald-100 text-emerald-800';
                  icon = <Sparkles className="w-4 h-4 text-emerald-600" />;
                } else if (notif.type === 'performance') {
                  badgeColor = 'bg-amber-100 text-amber-800';
                  icon = <Trophy className="w-4 h-4 text-amber-600" />;
                } else if (notif.type === 'payment') {
                  badgeColor = 'bg-sky-100 text-sky-800';
                  icon = <DollarSign className="w-4 h-4 text-sky-600" />;
                }

                return (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (notif.linkAction) {
                        onSelectAction(notif.linkAction);
                        onClose();
                      }
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer flex items-start gap-3 ${
                      notif.read
                        ? 'bg-white border-stone-200 opacity-80 hover:opacity-100'
                        : 'bg-amber-50/50 border-amber-200/80 shadow-xs'
                    }`}
                  >
                    <div className="p-2.5 rounded-xl bg-white border border-stone-200 shadow-xs">
                      {icon}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-extrabold text-xs text-stone-900 flex items-center gap-1.5">
                          <span>{notif.title}</span>
                          {!notif.read && (
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          )}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-stone-600 leading-snug">{notif.message}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          /* Automated SMS and Email Preview */
          <div className="space-y-4 flex-1 overflow-y-auto pr-1 text-xs">
            <p className="text-stone-600">
              PawRoute automatically dispatches multi-channel appointment reminders 2 hours before every scheduled walk.
            </p>

            {/* Toggle controls */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-800">SMS Reminders</p>
                  <p className="text-[10px] text-stone-500">Twilio / Webhook gateway</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="font-bold text-stone-800">Email Dossiers</p>
                  <p className="text-[10px] text-stone-500">SendGrid / Resend HTML</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Simulated Phone SMS bubble */}
            <div className="space-y-2">
              <span className="font-bold text-stone-700 block">Client SMS Preview:</span>
              <div className="bg-stone-900 text-white p-4 rounded-3xl space-y-2">
                <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                  <span>Messages • PawRoute Automated</span>
                  <span>Now</span>
                </div>
                <div className="bg-emerald-600 text-white p-3 rounded-2xl rounded-tl-none text-xs leading-relaxed max-w-xs shadow-md">
                  🐾 <strong>PawRoute Reminder:</strong> Hi Sarah, Alex is scheduled to arrive at 2:30 PM for Milo's walk. Live GPS tracking will begin upon departure: <span className="underline font-mono">https://pawroute.pro/track/milo-sf</span>
                </div>
              </div>
            </div>

            {/* Email HTML preview */}
            <div className="space-y-2">
              <span className="font-bold text-stone-700 block">Client HTML Email Preview:</span>
              <div className="bg-white border border-stone-300 p-4 rounded-2xl space-y-2 shadow-xs">
                <div className="flex items-center gap-2 border-b pb-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-[10px]">
                    🐾
                  </div>
                  <span className="font-bold text-stone-800">PawRoute Walk Confirmation & ETA</span>
                </div>
                <p className="text-stone-600 leading-snug">
                  Hello Sarah, your professional walker <strong>Alex Rivera</strong> has confirmed today's appointment. Lockbox instructions are encrypted and verified.
                </p>
                <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200 text-[11px] font-mono">
                  Walk Service: Adventure Walk (45 min) • Pups: Milo & Luna
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-3 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
