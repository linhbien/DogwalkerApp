import React from 'react';
import {
  Bell,
  CheckCircle2,
  Cloud,
  CloudOff,
  Globe,
  MapPin,
  RefreshCw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Language, Role } from '../types';
import { translations } from '../i18n/translations';

interface NavbarProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOnline: boolean;
  onToggleOnline: () => void;
  offlineQueueCount: number;
  onSyncCloud: () => void;
  isSyncing: boolean;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  isWalkActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageChange,
  isOnline,
  onToggleOnline,
  offlineQueueCount,
  onSyncCloud,
  isSyncing,
  unreadNotificationsCount,
  onOpenNotifications,
  activeTab,
  onSelectTab,
  isWalkActive,
}) => {
  const t = translations[language];

  const languageLabels: Record<Language, { label: string; flag: string }> = {
    en: { label: 'EN', flag: '🇺🇸' },
    es: { label: 'ES', flag: '🇪🇸' },
    fr: { label: 'FR', flag: '🇫🇷' },
    de: { label: 'DE', flag: '🇩🇪' },
    ja: { label: 'JA', flag: '🇯🇵' },
  };

  const navItems = [
    { id: 'live_walk', label: t.nav_live_walk, icon: '🐾', badge: isWalkActive ? 'LIVE' : null },
    { id: 'schedule', label: t.nav_schedule, icon: '📅' },
    { id: 'messages', label: t.nav_messages, icon: '💬' },
    { id: 'photos', label: t.nav_photos, icon: '📸' },
    { id: 'payments', label: t.nav_payments, icon: '💳' },
    { id: 'analytics', label: t.nav_analytics, icon: '📊' },
    { id: 'reviews', label: t.nav_reviews, icon: '⭐' },
    { id: 'pets', label: t.nav_pets, icon: '🐕' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      {/* Top utility row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('live_walk')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-amber-500 flex items-center justify-center shadow-lg shadow-emerald-950/40 text-xl font-bold">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                  Paw<span className="text-amber-400">Route</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PRO
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block truncate max-w-xs">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Role switcher & quick actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Role switch toggle */}
            <div className="bg-stone-800 p-1 rounded-xl border border-stone-700/80 flex items-center text-xs">
              <button
                onClick={() => onRoleChange('walker')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition ${
                  currentRole === 'walker'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Switch to Walker view"
              >
                <span>👟</span>
                <span className="hidden md:inline">{t.role_walker}</span>
              </button>
              <button
                onClick={() => onRoleChange('owner')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition ${
                  currentRole === 'owner'
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
                title="Switch to Pet Parent view"
              >
                <span>🐶</span>
                <span className="hidden md:inline">{t.role_owner}</span>
              </button>
            </div>

            {/* Offline/Online toggle for real & simulated offline testing */}
            <button
              onClick={onToggleOnline}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition ${
                isOnline
                  ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/80 hover:bg-emerald-900/60'
                  : 'bg-rose-950/70 text-rose-300 border-rose-800 animate-pulse'
              }`}
              title="Click to toggle Online/Offline simulation"
            >
              {isOnline ? (
                <>
                  <Cloud className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden lg:inline">{t.online}</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-rose-400" />
                  <span>{t.offline}</span>
                  {offlineQueueCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                      {offlineQueueCount}
                    </span>
                  )}
                </>
              )}
            </button>

            {/* Sync Cloud Button */}
            {isOnline && (
              <button
                onClick={onSyncCloud}
                disabled={isSyncing}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 transition disabled:opacity-50"
                title="Sync local data to cloud storage"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                <span className="hidden xl:inline">{isSyncing ? 'Syncing...' : t.sync_now}</span>
              </button>
            )}

            {/* Language Switcher */}
            <div className="relative group">
              <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 border border-stone-700 text-xs text-stone-200">
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold">{languageLabels[language].flag}</span>
                <span className="hidden sm:inline font-mono">{languageLabels[language].label}</span>
              </button>
              <div className="absolute right-0 mt-1 w-32 bg-stone-800 border border-stone-700 rounded-xl shadow-xl py-1 hidden group-hover:block z-50">
                {(Object.keys(languageLabels) as Language[]).map((langKey) => (
                  <button
                    key={langKey}
                    onClick={() => onLanguageChange(langKey)}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-stone-700 transition ${
                      language === langKey ? 'text-amber-400 font-bold bg-stone-700/50' : 'text-stone-300'
                    }`}
                  >
                    <span>{languageLabels[langKey].flag} {languageLabels[langKey].label}</span>
                    {language === langKey && <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 transition"
              title="Push Notifications & Reminders"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold flex items-center justify-center animate-bounce">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation tabs bar */}
      <nav className="border-t border-stone-800/80 bg-stone-950/70 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 py-1.5 min-w-max">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-2 whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-stone-950 text-amber-400' : 'bg-rose-500 text-white animate-pulse'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Offline banner notification if offline */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-amber-950 px-4 py-1.5 text-xs font-semibold text-center flex items-center justify-center gap-2">
          <span>⚠️</span>
          <span>{t.offline_notice}</span>
          <button
            onClick={onToggleOnline}
            className="underline ml-2 hover:text-black font-bold"
          >
            Reconnect Now
          </button>
        </div>
      )}
    </header>
  );
};
