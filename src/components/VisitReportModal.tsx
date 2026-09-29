import React from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  Compass,
  Download,
  Flame,
  Footprints,
  Heart,
  Share2,
  Sparkles,
  X,
} from 'lucide-react';
import { MapView } from './MapView';
import { Language, Pet, WalkSession } from '../types';
import { translations } from '../i18n/translations';

interface VisitReportModalProps {
  session: WalkSession;
  pets: Pet[];
  language: Language;
  onClose: () => void;
  onShareReport: () => void;
  onPayNow?: () => void;
}

export const VisitReportModal: React.FC<VisitReportModalProps> = ({
  session,
  pets,
  language,
  onClose,
  onShareReport,
  onPayNow,
}) => {
  const t = translations[language];

  const walkingPets = pets.filter((p) => session.petIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 text-white flex items-center justify-center text-2xl shadow-md">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-xl tracking-tight">
                  {t.visit_report_title}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                  Verified Walk
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Paws: {walkingPets.map((p) => p.name).join(' & ')} • Completed on {new Date(session.startTime).toLocaleDateString()}
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

        {/* GPS Map Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-700 flex items-center gap-1.5">
              <span>🗺️ GPS Route Trail</span>
            </span>
            <span className="font-mono text-stone-500">
              {session.routeCoordinates.length} waypoints plotted
            </span>
          </div>

          <MapView
            coordinates={session.routeCoordinates}
            events={session.events}
            isLiveTracking={false}
            height="260px"
          />
        </div>

        {/* Metric Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t.distance}</p>
            <p className="text-xl font-black font-mono text-stone-900 mt-0.5">
              {session.distanceKm} <span className="text-xs font-sans font-normal text-stone-500">km</span>
            </p>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{t.duration}</p>
            <p className="text-xl font-black font-mono text-stone-900 mt-0.5">
              {session.durationMinutes} <span className="text-xs font-sans font-normal text-stone-500">min</span>
            </p>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Potty Activity</p>
            <p className="text-lg font-black font-mono text-stone-900 mt-0.5 flex items-center justify-center gap-2">
              <span>🟡 {session.peeCount}</span>
              <span>💩 {session.poopCount}</span>
            </p>
          </div>

          <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200 text-center">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Hydration</p>
            <p className="text-base font-bold text-emerald-700 mt-1 flex items-center justify-center gap-1">
              <span>💧 Given</span>
            </p>
          </div>
        </div>

        {/* Photos Carousel */}
        {session.photos && session.photos.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-extrabold text-xs text-stone-800 uppercase tracking-wider">
              Walk Snapshot Memories ({session.photos.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {session.photos.map((ph) => (
                <div key={ph.id} className="relative rounded-2xl overflow-hidden aspect-video border border-stone-200 shadow-xs">
                  <img src={ph.url} alt={ph.caption} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2 text-white text-[11px] font-semibold">
                    <p className="truncate">{ph.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Walker Notes */}
        {session.notes && (
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200/80 space-y-1">
            <h4 className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>{t.walker_notes}</span>
            </h4>
            <p className="text-xs text-stone-700 leading-relaxed italic">
              "{session.notes}"
            </p>
          </div>
        )}

        {/* Action bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center gap-1.5 transition w-full sm:w-auto justify-center"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.download_receipt}</span>
            </button>

            <button
              onClick={onShareReport}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md transition w-full sm:w-auto justify-center"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.share_report}</span>
            </button>
          </div>

          {onPayNow && (
            <button
              onClick={onPayNow}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs shadow-md transition"
            >
              {t.pay_now}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
