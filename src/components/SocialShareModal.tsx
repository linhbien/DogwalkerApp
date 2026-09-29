import React, { useState } from 'react';
import {
  Check,
  Copy,
  ExternalLink,
  Instagram,
  MessageCircle,
  Share2,
  Sparkles,
  Twitter,
  X,
} from 'lucide-react';
import { WalkPhoto, WalkSession } from '../types';

interface SocialShareModalProps {
  photo?: WalkPhoto;
  session?: WalkSession;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  photo,
  session,
  onClose,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const shareText = photo
    ? `Check out this happy dog moment on PawRoute: "${photo.caption}" 🐾☀️ #PawRoute #HappyDog #DogWalking`
    : `Finished a fantastic ${session?.distanceKm || 2.8} km walk with our furry friends on PawRoute! Live GPS route & visit report verified. 🐾`;

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PawRoute Pet Adventure',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share dismissed', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
    window.open(url, '_blank');
  };

  const handleTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5 text-stone-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg">Share Pet Adventure</h3>
              <p className="text-xs text-stone-500">Inspire pet parents on social media</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600"
          >
            ✕
          </button>
        </div>

        {/* Social Card Preview */}
        <div className="bg-gradient-to-br from-stone-900 to-amber-950 p-4 rounded-3xl text-white space-y-3 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 flex items-center gap-1">
              <span>🐾 PawRoute Stories</span>
            </span>
            <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
              Live Verified
            </span>
          </div>

          {photo && (
            <img
              src={photo.url}
              alt="Pet"
              className="w-full h-44 object-cover rounded-2xl border border-white/10"
            />
          )}

          <p className="text-xs leading-relaxed font-medium text-stone-200">
            "{shareText}"
          </p>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2 text-xs font-bold">
          <button
            onClick={handleWhatsApp}
            className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center gap-2 transition"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp</span>
          </button>

          <button
            onClick={handleTwitter}
            className="p-3 rounded-2xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 flex items-center justify-center gap-2 transition"
          >
            <Twitter className="w-4 h-4 text-sky-600" />
            <span>X (Twitter)</span>
          </button>

          <button
            onClick={handleCopy}
            className="p-3 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-200 flex items-center justify-center gap-2 transition col-span-2"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-stone-600" />}
            <span>{copied ? 'Copied Link to Clipboard!' : 'Copy Direct Share Link'}</span>
          </button>
        </div>

        {/* Native share button if available */}
        {'share' in navigator && (
          <button
            onClick={handleNativeShare}
            className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition"
          >
            Open Device Share Sheet
          </button>
        )}
      </div>
    </div>
  );
};
