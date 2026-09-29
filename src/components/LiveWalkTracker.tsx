import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Camera,
  CheckCircle,
  Clock,
  Compass,
  Flame,
  Footprints,
  Info,
  MapPin,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  StopCircle,
} from 'lucide-react';
import { MapView } from './MapView';
import {
  Language,
  Pet,
  PottyType,
  RouteCoordinate,
  WalkEvent,
  WalkPhoto,
  WalkSession,
} from '../types';
import { translations } from '../i18n/translations';

interface LiveWalkTrackerProps {
  walkSession: WalkSession;
  pets: Pet[];
  language: Language;
  onUpdateSession: (updatedSession: WalkSession) => void;
  onCompleteWalk: (completedSession: WalkSession) => void;
  onAddPhoto: (photo: WalkPhoto) => void;
  onSendChatMessage: (content: string, isAutomated?: boolean, photoUrl?: string) => void;
}

export const LiveWalkTracker: React.FC<LiveWalkTrackerProps> = ({
  walkSession,
  pets,
  language,
  onUpdateSession,
  onCompleteWalk,
  onAddPhoto,
  onSendChatMessage,
}) => {
  const t = translations[language];

  const [isPaused, setIsPaused] = useState<boolean>(walkSession.status !== 'in_progress');
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(walkSession.durationMinutes * 60 || 0);
  const [distanceKm, setDistanceKm] = useState<number>(walkSession.distanceKm || 0);
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [showPhotoModal, setShowPhotoModal] = useState<boolean>(false);
  const [photoCaption, setPhotoCaption] = useState<string>('');
  const [selectedPetForPhoto, setSelectedPetForPhoto] = useState<string>(pets[0]?.id || '');
  const [customNote, setCustomNote] = useState<string>(walkSession.notes || '');
  const [gpsSimulating, setGpsSimulating] = useState<boolean>(true);

  const walkingPets = pets.filter((p) => walkSession.petIds.includes(p.id));

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (walkSession.status === 'in_progress' && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [walkSession.status, isPaused]);

  // GPS position simulation / real GPS updates
  useEffect(() => {
    let simInterval: NodeJS.Timeout | null = null;

    if (walkSession.status === 'in_progress' && !isPaused && gpsSimulating) {
      simInterval = setInterval(() => {
        // Generate small realistic GPS waypoint delta around current location
        const coords = walkSession.routeCoordinates;
        const last = coords.length > 0
          ? coords[coords.length - 1]
          : { lat: 37.7712, lng: -122.4645 };

        // Gentle street path delta
        const angle = Math.random() * Math.PI * 2;
        const stepDist = 0.00015 + (Math.random() * 0.0001); // roughly 15-25 meters
        const newLat = last.lat + Math.cos(angle) * stepDist * 0.6;
        const newLng = last.lng + Math.sin(angle) * stepDist;

        const newCoord: RouteCoordinate = {
          lat: Number(newLat.toFixed(6)),
          lng: Number(newLng.toFixed(6)),
          timestamp: new Date().toISOString(),
          speed: 4.2 + (Math.random() * 0.8 - 0.4),
        };

        const updatedCoords = [...coords, newCoord];
        const addedKm = 0.02; // 20m per step
        const newDist = Number((distanceKm + addedKm).toFixed(2));
        setDistanceKm(newDist);

        onUpdateSession({
          ...walkSession,
          routeCoordinates: updatedCoords,
          distanceKm: newDist,
          durationMinutes: Math.floor(elapsedSeconds / 60),
          notes: customNote,
        });
      }, 6000);
    }

    return () => {
      if (simInterval) clearInterval(simInterval);
    };
  }, [walkSession, isPaused, gpsSimulating, distanceKm, elapsedSeconds, customNote]);

  const formatTimer = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const currentDisplayDistance = unit === 'km' ? distanceKm : Number((distanceKm * 0.621371).toFixed(2));
  const currentPace = distanceKm > 0 ? (elapsedSeconds / 60 / distanceKm).toFixed(1) : '12.5';
  const estimatedCalories = Math.round(distanceKm * 65);
  const estimatedSteps = Math.round(distanceKm * 1350);

  // Logging Potty & Events
  const handleLogEvent = (type: PottyType, title: string) => {
    const coords = walkSession.routeCoordinates;
    const lastCoord = coords.length > 0 ? coords[coords.length - 1] : { lat: 37.7712, lng: -122.4645 };

    const newEvent: WalkEvent = {
      id: `ev-${Date.now()}`,
      type,
      title,
      lat: lastCoord.lat,
      lng: lastCoord.lng,
      timestamp: new Date().toISOString(),
    };

    let updatedPee = walkSession.peeCount;
    let updatedPoop = walkSession.poopCount;
    let updatedWater = walkSession.waterGiven;

    if (type === 'pee') updatedPee += 1;
    if (type === 'poop') updatedPoop += 1;
    if (type === 'water') updatedWater = true;

    const updatedEvents = [...walkSession.events, newEvent];

    onUpdateSession({
      ...walkSession,
      events: updatedEvents,
      peeCount: updatedPee,
      poopCount: updatedPoop,
      waterGiven: updatedWater,
      durationMinutes: Math.floor(elapsedSeconds / 60),
      notes: customNote,
    });

    // Send automatic status update to chat
    if (type === 'pee') {
      onSendChatMessage(`🟡 Pee break logged for ${walkingPets.map(p => p.name).join(' & ')}!`, true);
    } else if (type === 'poop') {
      onSendChatMessage(`💩 Poop break logged & responsibly disposed!`, true);
    } else if (type === 'water') {
      onSendChatMessage(`💧 Fresh water break provided! Pups are well hydrated.`, true);
    } else if (type === 'treat') {
      onSendChatMessage(`🦴 Owner-approved treat given for excellent loose leash walking!`, true);
    } else if (type === 'hazard') {
      onSendChatMessage(`⚠️ Noticed an obstacle on the trail, safely rerouted to keep dogs comfortable.`, true);
    }
  };

  // Photo Capture
  const handleCapturePhoto = (photoUrl: string) => {
    const coords = walkSession.routeCoordinates;
    const lastCoord = coords.length > 0 ? coords[coords.length - 1] : { lat: 37.7712, lng: -122.4645 };

    const newPhoto: WalkPhoto = {
      id: `photo-${Date.now()}`,
      walkId: walkSession.id,
      petId: selectedPetForPhoto || walkingPets[0]?.id || 'pet-1',
      url: photoUrl,
      caption: photoCaption.trim() || `${walkingPets[0]?.name || 'Dog'} enjoying the walk!`,
      timestamp: new Date().toISOString(),
      lat: lastCoord.lat,
      lng: lastCoord.lng,
      likes: 1,
      tags: ['LiveWalk', 'HappyDog', 'SunnyTrail'],
    };

    onAddPhoto(newPhoto);

    // Also add photo event on the map
    handleLogEvent('photo', `Photo: ${newPhoto.caption}`);

    // Post to chat
    onSendChatMessage(`📸 New walk photo captured! "${newPhoto.caption}"`, true, photoUrl);

    setShowPhotoModal(false);
    setPhotoCaption('');
  };

  // Complete Walk
  const handleFinishWalk = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const finalSession: WalkSession = {
      ...walkSession,
      status: 'completed',
      endTime: new Date().toISOString(),
      durationMinutes: Math.max(1, Math.floor(elapsedSeconds / 60)),
      distanceKm: distanceKm,
      paceMinPerKm: Number(currentPace),
      notes: customNote,
    };

    onCompleteWalk(finalSession);
    onSendChatMessage(`🏁 Walk finished! Total time: ${formatTimer(elapsedSeconds)}, distance: ${distanceKm} km. Visit report generated!`, true);
  };

  const samplePhotoBank = [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
  ];

  return (
    <div className="space-y-6">
      {/* Top Walk Status Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-emerald-950 text-white rounded-3xl p-6 shadow-xl border border-stone-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex -space-x-3">
                {walkingPets.map((p) => (
                  <img
                    key={p.id}
                    src={p.avatarUrl}
                    alt={p.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-stone-800 shadow-md"
                  />
                ))}
              </div>
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-stone-900 animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
                  {t.walking_with} {walkingPets.map((p) => p.name).join(' & ')}
                </h1>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {t.live_tracking}
                </span>
              </div>
              <p className="text-xs text-stone-300 mt-1 flex items-center gap-3">
                <span>🐕 {walkingPets.map((p) => p.breed).join(', ')}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">📍 Live GPS Path Broadcasting</span>
              </p>
            </div>
          </div>

          {/* Action buttons (Pause/Resume, Finish Walk) */}
          <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition ${
                isPaused
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-950/40'
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
              }`}
            >
              {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? t.resume_walk : t.pause_walk}</span>
            </button>

            <button
              onClick={handleFinishWalk}
              className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl font-extrabold text-sm bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50 flex items-center justify-center gap-2 transition active:scale-95"
            >
              <StopCircle className="w-4 h-4" />
              <span>{t.end_walk}</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-stone-800/80">
          {/* Duration */}
          <div className="bg-stone-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/60 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">{t.duration}</p>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                {formatTimer(elapsedSeconds)}
              </p>
            </div>
          </div>

          {/* Distance */}
          <div className="bg-stone-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">{t.distance}</p>
                <p className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                  {currentDisplayDistance} <span className="text-xs text-stone-400 font-sans">{unit}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setUnit(unit === 'km' ? 'mi' : 'km')}
              className="text-[10px] uppercase font-bold px-2 py-1 rounded-md bg-stone-800 text-stone-300 hover:text-white"
            >
              {unit === 'km' ? 'mi' : 'km'}
            </button>
          </div>

          {/* Pace */}
          <div className="bg-stone-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/60 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400">
              <Footprints className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">{t.current_pace}</p>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                {currentPace} <span className="text-xs text-stone-400 font-sans">m/{unit}</span>
              </p>
            </div>
          </div>

          {/* Steps & Energy */}
          <div className="bg-stone-900/80 backdrop-blur-md p-3.5 rounded-2xl border border-stone-700/60 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Active Burn</p>
              <p className="text-xl sm:text-2xl font-extrabold font-mono text-white tracking-tight">
                {estimatedCalories} <span className="text-xs text-stone-400 font-sans">kcal</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map & Live Potty Action Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-bold text-stone-900 text-base">GPS Route Tracker</h3>
                <span className="text-xs text-stone-500 font-mono">
                  {walkSession.routeCoordinates.length} waypoints recorded
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPhotoModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>{t.take_photo}</span>
                </button>
              </div>
            </div>

            <MapView
              coordinates={walkSession.routeCoordinates}
              events={walkSession.events}
              isLiveTracking={walkSession.status === 'in_progress' && !isPaused}
              height="450px"
            />
          </div>

          {/* Quick Potty & Care Logging Bar */}
          <div className="bg-stone-900 text-white p-5 rounded-3xl shadow-lg border border-stone-800">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-bold text-sm tracking-wide uppercase text-stone-300 flex items-center gap-2">
                <span>{t.potty_events}</span>
                <span className="text-xs font-normal lowercase text-stone-400">
                  (one-tap geotagged client notification)
                </span>
              </h4>
              <div className="flex items-center gap-3 text-xs">
                <span className="text-amber-400 font-bold">🟡 Pee: {walkSession.peeCount}</span>
                <span className="text-stone-300 font-bold">💩 Poop: {walkSession.poopCount}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3">
              <button
                onClick={() => handleLogEvent('pee', `${walkingPets[0]?.name || 'Dog'} Pee Break`)}
                className="p-3 rounded-2xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                <span className="text-2xl">🟡</span>
                <span>{t.log_pee}</span>
              </button>

              <button
                onClick={() => handleLogEvent('poop', `${walkingPets[0]?.name || 'Dog'} Poop (Disposed)`)}
                className="p-3 rounded-2xl bg-stone-800 hover:bg-stone-700 border border-amber-700/50 text-amber-200 font-bold text-xs flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                <span className="text-2xl">💩</span>
                <span>{t.log_poop}</span>
              </button>

              <button
                onClick={() => handleLogEvent('water', 'Hydration Water Break')}
                className="p-3 rounded-2xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-xs flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                <span className="text-2xl">💧</span>
                <span>{t.log_water}</span>
              </button>

              <button
                onClick={() => handleLogEvent('treat', 'Reward Treat Given')}
                className="p-3 rounded-2xl bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/40 text-orange-300 font-bold text-xs flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                <span className="text-2xl">🦴</span>
                <span>{t.log_treat}</span>
              </button>

              <button
                onClick={() => handleLogEvent('hazard', 'Trail Hazard / Distraction Reroute')}
                className="p-3 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold text-xs flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                <span className="text-2xl">⚠️</span>
                <span>{t.log_hazard}</span>
              </button>

              <button
                onClick={() => setShowPhotoModal(true)}
                className="p-3 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex flex-col items-center gap-1.5 transition active:scale-95"
              >
                <span className="text-2xl">📸</span>
                <span>{t.take_photo}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar: Pet Care Instructions & Visit Notes */}
        <div className="space-y-4">
          {/* Walking Dog Cards */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-stone-500 flex items-center justify-between">
              <span>Client & Pet Details</span>
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-xs font-bold">
                Active Client
              </span>
            </h4>

            {walkingPets.map((pet) => (
              <div key={pet.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={pet.avatarUrl}
                    alt={pet.name}
                    className="w-12 h-12 rounded-xl object-cover border border-stone-300"
                  />
                  <div>
                    <h5 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <span>{pet.name}</span>
                      <span className="text-xs text-stone-500 font-normal">({pet.age} yrs, {pet.weight}kg)</span>
                    </h5>
                    <p className="text-xs text-stone-600">{pet.breed}</p>
                  </div>
                </div>

                <div className="text-xs space-y-1.5 pt-2 border-t border-stone-200 text-stone-600">
                  <p><strong className="text-stone-800">Leash/Gear:</strong> {pet.leashLocation}</p>
                  <p><strong className="text-stone-800">Treats:</strong> {pet.favoriteTreats}</p>
                  <p><strong className="text-stone-800">Emergency Vet:</strong> {pet.vetName} ({pet.vetPhone})</p>
                </div>
              </div>
            ))}
          </div>

          {/* Walker Notes & Report Comments */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{t.walker_notes}</span>
            </h4>
            <textarea
              value={customNote}
              onChange={(e) => {
                setCustomNote(e.target.value);
                onUpdateSession({ ...walkSession, notes: e.target.value });
              }}
              placeholder="Add personal notes for the pet parent (e.g., Milo made friends with a gentle poodle, energy levels, behavior)..."
              rows={4}
              className="w-full text-xs text-stone-800 p-3 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>Automatically saved to final report</span>
              <button
                onClick={() => {
                  onSendChatMessage(`📝 Note update: "${customNote}"`, true);
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold"
              >
                Send as Chat Update
              </button>
            </div>
          </div>

          {/* Today's Walk Events Feed */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-stone-900">Live Activity Feed</h4>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {walkSession.events.length === 0 ? (
                <p className="text-xs text-stone-400 italic">No events logged yet. Tap buttons above!</p>
              ) : (
                walkSession.events.slice().reverse().map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span>
                        {ev.type === 'pee' ? '🟡' : ev.type === 'poop' ? '💩' : ev.type === 'water' ? '💧' : ev.type === 'treat' ? '🦴' : ev.type === 'photo' ? '📸' : '⚠️'}
                      </span>
                      <span className="font-medium text-stone-800">{ev.title}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(ev.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo Capture Modal */}
      {showPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-stone-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-emerald-600" />
                <span>Snap Pet Walk Photo</span>
              </h3>
              <button
                onClick={() => setShowPhotoModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Photos are geotagged with current GPS coordinates and instantly shared in the owner’s private photo gallery & live chat.
            </p>

            {/* Select Pet */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Which pet is in this photo?</label>
              <select
                value={selectedPetForPhoto}
                onChange={(e) => setSelectedPetForPhoto(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
              >
                {walkingPets.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.breed})</option>
                ))}
              </select>
            </div>

            {/* Photo Selection / Camera Preview */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-2">Choose or snap camera shot:</label>
              <div className="grid grid-cols-3 gap-2">
                {samplePhotoBank.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt="Sample"
                    onClick={() => handleCapturePhoto(imgUrl)}
                    className="w-full h-24 object-cover rounded-xl border-2 border-transparent hover:border-emerald-500 cursor-pointer transition transform hover:scale-105"
                  />
                ))}
              </div>
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Caption / Note to owner:</label>
              <input
                type="text"
                value={photoCaption}
                onChange={(e) => setPhotoCaption(e.target.value)}
                placeholder="e.g. Having fun at the fountain! 🐾"
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowPhotoModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCapturePhoto(samplePhotoBank[0])}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
              >
                Upload & Share Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
