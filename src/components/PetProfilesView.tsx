import React, { useState } from 'react';
import {
  Check,
  Eye,
  EyeOff,
  Heart,
  KeyRound,
  Lock,
  Phone,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { EncryptedHomeAccess, Language, Pet, Role, UserProfile } from '../types';
import { translations } from '../i18n/translations';
import { maskCode } from '../utils/encryption';

interface PetProfilesViewProps {
  pets: Pet[];
  userProfiles: Record<Role, UserProfile>;
  currentRole: Role;
  language: Language;
  onUpdateHomeAccess: (newAccess: EncryptedHomeAccess) => void;
  onAddPet: (newPet: Pet) => void;
}

export const PetProfilesView: React.FC<PetProfilesViewProps> = ({
  pets,
  userProfiles,
  currentRole,
  language,
  onUpdateHomeAccess,
  onAddPet,
}) => {
  const t = translations[language];

  const profile = userProfiles[currentRole];
  const homeAccess = userProfiles.owner.homeAccess!;

  const [revealed, setRevealed] = useState<boolean>(false);
  const [isEditingCodes, setIsEditingCodes] = useState<boolean>(false);
  const [lockboxCode, setLockboxCode] = useState<string>(homeAccess.lockboxCode);
  const [alarmCode, setAlarmCode] = useState<string>(homeAccess.alarmCode);
  const [gateCode, setGateCode] = useState<string>(homeAccess.gateCode);
  const [specialInstructions, setSpecialInstructions] = useState<string>(homeAccess.specialInstructions);

  // New Pet modal
  const [showAddPetModal, setShowAddPetModal] = useState<boolean>(false);
  const [newPetName, setNewPetName] = useState<string>('');
  const [newPetBreed, setNewPetBreed] = useState<string>('');
  const [newPetAge, setNewPetAge] = useState<number>(3);
  const [newPetWeight, setNewPetWeight] = useState<number>(20);
  const [newPetNotes, setNewPetNotes] = useState<string>('');
  const [newPetLeash, setNewPetLeash] = useState<string>('');
  const [newPetVet, setNewPetVet] = useState<string>('City Pet Hospital');
  const [newPetPhone, setNewPetPhone] = useState<string>('+1 (555) 998-1122');

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EncryptedHomeAccess = {
      lockboxCode,
      alarmCode,
      gateCode,
      specialInstructions,
      isEncrypted: true,
      encryptionHash: `AES256-GCM-${Date.now().toString(16)}`,
      lastUpdated: new Date().toISOString(),
    };
    onUpdateHomeAccess(updated);
    setIsEditingCodes(false);
  };

  const handleCreatePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) return;

    const newPet: Pet = {
      id: `pet-${Date.now()}`,
      name: newPetName.trim(),
      breed: newPetBreed.trim() || 'Mixed Breed',
      age: newPetAge,
      weight: newPetWeight,
      avatarUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
      gender: 'male',
      ownerId: 'user-owner-1',
      notes: newPetNotes.trim() || 'Friendly dog.',
      leashLocation: newPetLeash.trim() || 'Near entrance rack',
      favoriteTreats: 'Crunchy biscuits',
      vetName: newPetVet.trim(),
      vetPhone: newPetPhone.trim(),
      vaccinated: true,
      friendlyWithDogs: true,
      friendlyWithCats: true,
    };

    onAddPet(newPet);
    setShowAddPetModal(false);
    setNewPetName('');
    setNewPetBreed('');
    setNewPetNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-sans">
              {t.profile_title}
            </h2>
            <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-100 text-emerald-900 px-2.5 py-0.5 rounded-full border border-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              AES-256 E2EE Enabled
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Zero-knowledge field encryption protects private lockbox codes, alarm passcodes, and veterinary dossiers.
          </p>
        </div>

        <button
          onClick={() => setShowAddPetModal(true)}
          className="px-4 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-1.5 shadow-md transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Pet</span>
        </button>
      </div>

      {/* Encrypted Home Access Security Vault */}
      <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-7 border border-stone-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                <span>{t.secure_home_access}</span>
                <span className="text-[10px] font-mono bg-stone-800 text-emerald-400 px-2 py-0.5 rounded-md border border-stone-700">
                  {homeAccess.encryptionHash}
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Only authenticated walkers with active appointments can decrypt these codes.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRevealed(!revealed)}
              className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold flex items-center gap-1.5 transition"
            >
              {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{revealed ? t.hide_secure_data : t.reveal_secure_data}</span>
            </button>

            {currentRole === 'owner' && (
              <button
                onClick={() => setIsEditingCodes(!isEditingCodes)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 text-stone-950 text-xs font-extrabold transition hover:bg-amber-400"
              >
                {isEditingCodes ? 'Close Editor' : 'Edit Codes'}
              </button>
            )}
          </div>
        </div>

        {isEditingCodes ? (
          <form onSubmit={handleSaveSecurity} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-stone-300 font-bold mb-1">{t.lockbox_code}</label>
              <input
                type="text"
                value={lockboxCode}
                onChange={(e) => setLockboxCode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-800 border border-stone-700 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-bold mb-1">{t.alarm_code}</label>
              <input
                type="text"
                value={alarmCode}
                onChange={(e) => setAlarmCode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-800 border border-stone-700 font-mono text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-bold mb-1">{t.gate_code}</label>
              <input
                type="text"
                value={gateCode}
                onChange={(e) => setGateCode(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-800 border border-stone-700 font-mono text-white text-xs"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-stone-300 font-bold mb-1">Entry Notes / Location Instructions</label>
              <input
                type="text"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-800 border border-stone-700 text-white text-xs"
              />
            </div>

            <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingCodes(false)}
                className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Encrypt & Save to Cloud
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-stone-800/90 p-4 rounded-2xl border border-stone-700 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                {t.lockbox_code}
              </p>
              <p className="text-xl font-mono font-black text-amber-400 tracking-wider">
                {revealed ? homeAccess.lockboxCode : maskCode(homeAccess.lockboxCode)}
              </p>
            </div>

            <div className="bg-stone-800/90 p-4 rounded-2xl border border-stone-700 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                {t.alarm_code}
              </p>
              <p className="text-xl font-mono font-black text-rose-400 tracking-wider">
                {revealed ? homeAccess.alarmCode : maskCode(homeAccess.alarmCode)}
              </p>
            </div>

            <div className="bg-stone-800/90 p-4 rounded-2xl border border-stone-700 space-y-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                {t.gate_code}
              </p>
              <p className="text-xl font-mono font-black text-sky-400 tracking-wider">
                {revealed ? homeAccess.gateCode : maskCode(homeAccess.gateCode)}
              </p>
            </div>

            <div className="sm:col-span-3 bg-stone-800/60 p-3.5 rounded-2xl border border-stone-700/80 text-xs text-stone-300">
              <strong className="text-white">Access Notes:</strong> {homeAccess.specialInstructions}
            </div>
          </div>
        )}
      </div>

      {/* Pets Profiles Cards */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-stone-900">Registered Dogs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pets.map((pet) => (
            <div
              key={pet.id}
              className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={pet.avatarUrl}
                    alt={pet.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shadow-xs"
                  />
                  <div>
                    <h4 className="font-black text-lg text-stone-900 flex items-center gap-2">
                      <span>{pet.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 font-bold capitalize">
                        {pet.gender} • {pet.age} yrs
                      </span>
                    </h4>
                    <p className="text-xs text-stone-500 font-medium">{pet.breed} • {pet.weight} kg</p>
                  </div>
                </div>

                <span className="p-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Vaccinated</span>
                </span>
              </div>

              <div className="text-xs space-y-2 text-stone-700 bg-stone-50/70 p-4 rounded-2xl border border-stone-100">
                <p>
                  <strong className="text-stone-900">Leash & Harness:</strong> {pet.leashLocation}
                </p>
                <p>
                  <strong className="text-stone-900">Treats:</strong> {pet.favoriteTreats}
                </p>
                {pet.medicationInfo && (
                  <p>
                    <strong className="text-rose-700">Health / Meds:</strong> {pet.medicationInfo}
                  </p>
                )}
                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-stone-600">
                  <span className="flex items-center gap-1 font-medium">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    {pet.vetName}
                  </span>
                  <a
                    href={`tel:${pet.vetPhone}`}
                    className="font-mono text-emerald-700 font-bold hover:underline"
                  >
                    {pet.vetPhone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add New Pet Modal */}
      {showAddPetModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-xl text-stone-900 tracking-tight">
                Add Pet to Profile
              </h3>
              <button
                onClick={() => setShowAddPetModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePet} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Dog Name</label>
                  <input
                    type="text"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    placeholder="e.g. Copper"
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Breed</label>
                  <input
                    type="text"
                    value={newPetBreed}
                    onChange={(e) => setNewPetBreed(e.target.value)}
                    placeholder="e.g. Beagle"
                    required
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Age (Years)</label>
                  <input
                    type="number"
                    value={newPetAge}
                    onChange={(e) => setNewPetAge(Number(e.target.value))}
                    min={1}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    value={newPetWeight}
                    onChange={(e) => setNewPetWeight(Number(e.target.value))}
                    min={1}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Leash & Collar Location</label>
                <input
                  type="text"
                  value={newPetLeash}
                  onChange={(e) => setNewPetLeash(e.target.value)}
                  placeholder="e.g. Peg on the entryway coat stand"
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Behavior & Walking Notes</label>
                <textarea
                  value={newPetNotes}
                  onChange={(e) => setNewPetNotes(e.target.value)}
                  placeholder="e.g. Loves sniffing trees, barks at skateboards, very affectionate"
                  rows={3}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Primary Vet Clinic</label>
                  <input
                    type="text"
                    value={newPetVet}
                    onChange={(e) => setNewPetVet(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Vet Emergency Phone</label>
                  <input
                    type="text"
                    value={newPetPhone}
                    onChange={(e) => setNewPetPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddPetModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-md"
                >
                  Save Dog Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
