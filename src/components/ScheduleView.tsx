import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  Filter,
  Plus,
  Repeat,
  Sparkles,
  Users,
  WifiOff,
} from 'lucide-react';
import { Appointment, Language, Pet, Role, ServiceType } from '../types';
import { translations } from '../i18n/translations';

interface ScheduleViewProps {
  appointments: Appointment[];
  pets: Pet[];
  role: Role;
  language: Language;
  isOnline: boolean;
  onBookAppointment: (appointment: Appointment) => void;
  onStartWalkFromSchedule: (appointment: Appointment) => void;
  onPayAppointment: (appointment: Appointment) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({
  appointments,
  pets,
  role,
  language,
  isOnline,
  onBookAppointment,
  onStartWalkFromSchedule,
  onPayAppointment,
}) => {
  const t = translations[language];

  const [activeFilter, setActiveFilter] = useState<'all' | 'upcoming' | 'recurring' | 'completed'>('upcoming');
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);

  // Form State
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([pets[0]?.id || '']);
  const [serviceType, setServiceType] = useState<ServiceType>('standard_walk');
  const [date, setDate] = useState<string>('2026-09-30');
  const [time, setTime] = useState<string>('11:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(30);
  const [isRecurring, setIsRecurring] = useState<boolean>(true);
  const [recurrenceFrequency, setRecurrenceFrequency] = useState<'daily' | 'weekdays' | 'weekly' | 'biweekly'>('weekdays');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const serviceOptions: Array<{ type: ServiceType; label: string; basePrice: number; defaultDuration: number; icon: string }> = [
    { type: 'quick_relief', label: 'Quick Potty Relief (15 min)', basePrice: 22, defaultDuration: 15, icon: '⚡' },
    { type: 'standard_walk', label: 'Standard Neighborhood Walk (30 min)', basePrice: 32, defaultDuration: 30, icon: '🐕' },
    { type: 'adventure_walk', label: 'Nature Park Adventure (60 min)', basePrice: 50, defaultDuration: 60, icon: '🌲' },
    { type: 'pack_social', label: 'Pack Social Walk (45 min)', basePrice: 42, defaultDuration: 45, icon: '🐾' },
    { type: 'house_visit', label: 'Home Check-in & Feeding (30 min)', basePrice: 28, defaultDuration: 30, icon: '🏡' },
  ];

  const currentService = serviceOptions.find((s) => s.type === serviceType) || serviceOptions[1];
  const calculatedPrice = currentService.basePrice + (selectedPetIds.length > 1 ? (selectedPetIds.length - 1) * 14 : 0);

  const handleTogglePet = (petId: string) => {
    if (selectedPetIds.includes(petId)) {
      if (selectedPetIds.length > 1) {
        setSelectedPetIds(selectedPetIds.filter((id) => id !== petId));
      }
    } else {
      setSelectedPetIds([...selectedPetIds, petId]);
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      petIds: selectedPetIds,
      walkerId: 'user-walker-1',
      ownerId: 'user-owner-1',
      serviceType,
      date,
      time,
      durationMinutes,
      isRecurring,
      recurrenceFrequency: isRecurring ? recurrenceFrequency : undefined,
      status: 'scheduled',
      price: calculatedPrice,
      isPaid: false,
      specialRequests: specialRequests.trim() || undefined,
    };

    onBookAppointment(newAppointment);
    setShowBookingModal(false);
  };

  // Filter Appointments
  const filteredAppointments = appointments.filter((apt) => {
    if (activeFilter === 'upcoming') {
      return apt.status === 'scheduled' || apt.status === 'in_progress';
    }
    if (activeFilter === 'recurring') {
      return apt.isRecurring;
    }
    if (activeFilter === 'completed') {
      return apt.status === 'completed';
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-sans">
              {t.schedule_title}
            </h2>
            {!isOnline && (
              <span className="flex items-center gap-1 text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-300">
                <WifiOff className="w-3 h-3" />
                Offline Scheduling Active
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage recurring dog walking schedules, calendar bookings, and automated reminders.
          </p>
        </div>

        <button
          onClick={() => setShowBookingModal(true)}
          className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t.book_new_walk}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveFilter('upcoming')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeFilter === 'upcoming'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{t.upcoming_walks}</span>
        </button>

        <button
          onClick={() => setActiveFilter('recurring')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeFilter === 'recurring'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <Repeat className="w-3.5 h-3.5" />
          <span>{t.recurring} Plans</span>
        </button>

        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            activeFilter === 'completed'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5" />
          <span>{t.past_walks}</span>
        </button>

        <button
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeFilter === 'all'
              ? 'bg-stone-900 text-white shadow-md'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          All ({appointments.length})
        </button>
      </div>

      {/* Appointments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAppointments.map((apt) => {
          const aptPets = pets.filter((p) => apt.petIds.includes(p.id));
          const isCurrentActive = apt.status === 'in_progress';

          return (
            <div
              key={apt.id}
              className={`p-5 rounded-3xl bg-white border transition shadow-sm space-y-4 ${
                isCurrentActive
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-emerald-50'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {aptPets.map((p) => (
                      <img
                        key={p.id}
                        src={p.avatarUrl}
                        alt={p.name}
                        className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-sm"
                      />
                    ))}
                  </div>

                  <div>
                    <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
                      <span>{aptPets.map((p) => p.name).join(' & ')}</span>
                      {apt.isRecurring && (
                        <span className="p-1 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold" title={`Repeats ${apt.recurrenceFrequency}`}>
                          🔄 {apt.recurrenceFrequency}
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-stone-500 capitalize">
                      {apt.serviceType.replace('_', ' ')} • {apt.durationMinutes} min
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <span
                  className={`text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                    apt.status === 'in_progress'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse'
                      : apt.status === 'completed'
                      ? 'bg-stone-100 text-stone-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {apt.status === 'in_progress' ? '🟢 Live' : apt.status}
                </span>
              </div>

              {/* Date & Time metadata */}
              <div className="flex items-center justify-between text-xs py-2 border-y border-stone-100 text-stone-600">
                <span className="flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  {apt.date} at {apt.time}
                </span>

                <span className="flex items-center gap-1.5 font-mono font-bold text-stone-800">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  ${apt.price.toFixed(2)}
                  <span className={`text-[10px] font-normal ${apt.isPaid ? 'text-emerald-600 font-bold' : 'text-amber-600'}`}>
                    ({apt.isPaid ? 'Paid' : 'Unpaid'})
                  </span>
                </span>
              </div>

              {apt.specialRequests && (
                <div className="bg-stone-50 p-2.5 rounded-xl text-xs text-stone-600 italic">
                  "{apt.specialRequests}"
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-2 pt-1">
                {role === 'walker' ? (
                  apt.status === 'scheduled' ? (
                    <button
                      onClick={() => onStartWalkFromSchedule(apt)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <span>🐾 {t.start_walk}</span>
                    </button>
                  ) : apt.status === 'in_progress' ? (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                      Walk is currently in progress
                    </span>
                  ) : (
                    <span className="text-xs text-stone-500 font-medium">Walk Completed</span>
                  )
                ) : (
                  // Owner actions
                  !apt.isPaid ? (
                    <button
                      onClick={() => onPayAppointment(apt)}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>{t.pay_walk_bill} (${apt.price.toFixed(2)})</span>
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      Payment Processed
                    </span>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl text-stone-900 tracking-tight">
                {t.book_new_walk}
              </h3>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitBooking} className="space-y-4 text-xs">
              {/* Pet selection */}
              <div>
                <label className="block font-bold text-stone-700 mb-2">
                  {t.select_pet} (Multi-select)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {pets.map((pet) => {
                    const isSelected = selectedPetIds.includes(pet.id);
                    return (
                      <div
                        key={pet.id}
                        onClick={() => handleTogglePet(pet.id)}
                        className={`p-2.5 rounded-2xl border cursor-pointer flex items-center gap-2.5 transition ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50 text-stone-900 font-bold'
                            : 'border-stone-200 bg-stone-50 text-stone-600'
                        }`}
                      >
                        <img
                          src={pet.avatarUrl}
                          alt={pet.name}
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold leading-none">{pet.name}</p>
                          <p className="text-[10px] text-stone-500">{pet.breed}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  {t.select_service}
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => {
                    const type = e.target.value as ServiceType;
                    setServiceType(type);
                    const opt = serviceOptions.find((s) => s.type === type);
                    if (opt) setDurationMinutes(opt.defaultDuration);
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-medium"
                >
                  {serviceOptions.map((opt) => (
                    <option key={opt.type} value={opt.type}>
                      {opt.icon} {opt.label} — from ${opt.basePrice}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              {/* Recurring Switch */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-stone-900 flex items-center gap-1.5 cursor-pointer">
                    <Repeat className="w-4 h-4 text-amber-600" />
                    <span>Make this a recurring walk</span>
                  </label>
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4 h-4 accent-amber-600 cursor-pointer"
                  />
                </div>

                {isRecurring && (
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      {t.recurrence_freq}
                    </label>
                    <select
                      value={recurrenceFrequency}
                      onChange={(e) => setRecurrenceFrequency(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-amber-300 bg-white text-xs"
                    >
                      <option value="daily">{t.daily}</option>
                      <option value="weekdays">{t.weekdays}</option>
                      <option value="weekly">{t.weekly}</option>
                      <option value="biweekly">{t.biweekly}</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Special Requests */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Special Instructions / Trail Requests
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g., Practice stay at crosswalks, give fresh water afterward"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              {/* Price summary */}
              <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-stone-500">Estimated Total</p>
                  <p className="text-base font-extrabold text-stone-900 font-mono">
                    ${calculatedPrice.toFixed(2)}
                  </p>
                </div>
                <span className="text-[11px] text-stone-500 font-medium">
                  {selectedPetIds.length} dog{selectedPetIds.length > 1 ? 's' : ''} • {durationMinutes} min
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-md transition"
                >
                  {t.book_appointment_btn}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
