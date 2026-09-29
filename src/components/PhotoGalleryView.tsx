import React, { useState } from 'react';
import {
  Download,
  Filter,
  Heart,
  Image,
  MapPin,
  Share2,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { Language, Pet, WalkPhoto } from '../types';
import { translations } from '../i18n/translations';

interface PhotoGalleryViewProps {
  photos: WalkPhoto[];
  pets: Pet[];
  language: Language;
  onLikePhoto: (photoId: string) => void;
  onSharePhoto: (photo: WalkPhoto) => void;
}

export const PhotoGalleryView: React.FC<PhotoGalleryViewProps> = ({
  photos,
  pets,
  language,
  onLikePhoto,
  onSharePhoto,
}) => {
  const t = translations[language];

  const [selectedPetId, setSelectedPetId] = useState<string>('all');
  const [activePhoto, setActivePhoto] = useState<WalkPhoto | null>(null);

  const filteredPhotos = photos.filter((photo) => {
    if (selectedPetId === 'all') return true;
    return photo.petId === selectedPetId;
  });

  return (
    <div className="space-y-6">
      {/* Gallery Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-sans">
            {t.gallery_title}
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            High-resolution walk snapshots geotagged and automatically archived for owners.
          </p>
        </div>

        {/* Pet Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
          <button
            onClick={() => setSelectedPetId('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              selectedPetId === 'all'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t.all_pets} ({photos.length})
          </button>

          {pets.map((pet) => (
            <button
              key={pet.id}
              onClick={() => setSelectedPetId(pet.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                selectedPetId === pet.id
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <img src={pet.avatarUrl} alt={pet.name} className="w-4 h-4 rounded-full object-cover" />
              <span>{pet.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Photos */}
      {filteredPhotos.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-stone-200 space-y-3">
          <div className="w-16 h-16 rounded-full bg-stone-100 mx-auto flex items-center justify-center text-3xl">
            📷
          </div>
          <p className="font-bold text-stone-700 text-sm">No photos found for this filter</p>
          <p className="text-xs text-stone-400">Photos taken during live walks will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPhotos.map((photo) => {
            const pet = pets.find((p) => p.id === photo.petId);

            return (
              <div
                key={photo.id}
                className="group relative bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Image */}
                <div
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  onClick={() => setActivePhoto(photo)}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                    <div className="flex justify-end">
                      <span className="p-2 rounded-xl bg-black/40 backdrop-blur-md text-xs font-medium">
                        🔍 View HD
                      </span>
                    </div>
                    <div className="text-xs">
                      <p className="font-bold truncate">{photo.caption}</p>
                      <p className="text-[10px] text-stone-300 font-mono mt-0.5">
                        {new Date(photo.timestamp).toLocaleDateString()} at{' '}
                        {new Date(photo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card footer */}
                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                        {pet && <img src={pet.avatarUrl} alt={pet.name} className="w-4 h-4 rounded-full object-cover" />}
                        <span>{pet?.name || 'Pet'}</span>
                      </span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {new Date(photo.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {photo.caption}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {photo.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions (Like & Social Share) */}
                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <button
                      onClick={() => onLikePhoto(photo.id)}
                      className="flex items-center gap-1.5 font-bold text-rose-600 hover:text-rose-700 transition"
                    >
                      <Heart className="w-4 h-4 fill-rose-500" />
                      <span>{photo.likes}</span>
                    </button>

                    <button
                      onClick={() => onSharePhoto(photo)}
                      className="flex items-center gap-1 font-bold text-stone-700 hover:text-amber-600 transition"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>{t.share_photo}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-Screen Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full bg-stone-900 text-white rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/60 hover:bg-black text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3">
              <div className="md:col-span-2 bg-black flex items-center justify-center min-h-[400px]">
                <img
                  src={activePhoto.url}
                  alt={activePhoto.caption}
                  className="max-h-[70vh] w-auto object-contain"
                />
              </div>

              <div className="p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">
                      Live Walk Snapshot
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white">
                    {activePhoto.caption}
                  </h3>

                  <div className="text-xs text-stone-400 space-y-1">
                    <p>📅 {new Date(activePhoto.timestamp).toLocaleString()}</p>
                    {activePhoto.lat && (
                      <p className="font-mono text-[11px] text-stone-500">
                        📍 GPS: {activePhoto.lat.toFixed(4)}, {activePhoto.lng?.toFixed(4)}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {activePhoto.tags.map((t, idx) => (
                      <span key={idx} className="text-xs bg-stone-800 text-stone-300 px-2.5 py-1 rounded-lg">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-stone-800">
                  <div className="flex items-center justify-between text-sm">
                    <button
                      onClick={() => onLikePhoto(activePhoto.id)}
                      className="flex items-center gap-2 font-bold text-rose-400 hover:text-rose-300"
                    >
                      <Heart className="w-5 h-5 fill-rose-500" />
                      <span>{activePhoto.likes} Likes</span>
                    </button>

                    <button
                      onClick={() => onSharePhoto(activePhoto)}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Card</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
