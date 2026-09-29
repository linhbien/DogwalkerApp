import React, { useState } from 'react';
import {
  CheckCircle,
  MessageCircle,
  Plus,
  Send,
  Star,
  ThumbsUp,
  UserCheck,
} from 'lucide-react';
import { Language, Review, Role } from '../types';
import { translations } from '../i18n/translations';

interface ReviewsViewProps {
  reviews: Review[];
  currentRole: Role;
  language: Language;
  onAddReview: (review: Review) => void;
  onAddWalkerReply: (reviewId: string, replyText: string) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  reviews,
  currentRole,
  language,
  onAddReview,
  onAddWalkerReply,
}) => {
  const t = translations[language];

  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Super Punctual', 'Great Photos']);
  const [replyInputMap, setReplyInputMap] = useState<Record<string, string>>({});
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  const availableTags = [
    'Super Punctual',
    'Great Photos',
    'Gentle Lead',
    'Dog Whisperer',
    'Reliable Updates',
    'Careful in Heat',
    'Patient with Puppies',
  ];

  const averageRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(2);

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      ownerId: 'user-owner-1',
      ownerName: 'Sarah Jenkins',
      ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      petName: 'Milo & Luna',
      walkerId: 'user-walker-1',
      rating,
      date: new Date().toISOString().slice(0, 10),
      comment: comment.trim(),
      tags: selectedTags,
    };

    onAddReview(newRev);
    setShowReviewModal(false);
    setComment('');
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyInputMap[reviewId]?.trim();
    if (!text) return;
    onAddWalkerReply(reviewId, text);
    setActiveReplyId(null);
    setReplyInputMap((prev) => ({ ...prev, [reviewId]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header & Rating Breakdown Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="text-center bg-stone-800/80 p-5 rounded-2xl border border-stone-700">
              <span className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight">
                {averageRating}
              </span>
              <div className="flex items-center justify-center gap-1 text-amber-400 mt-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-[10px] text-stone-400 mt-1 font-semibold uppercase tracking-wider">
                {reviews.length} Verified Reviews
              </p>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight font-sans">
                {t.reviews_title}
              </h2>
              <p className="text-xs text-stone-300 mt-1 max-w-md">
                100% verified pet parents after completed GPS walks. Walkers maintain top tier reliability and trust.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 active:scale-95 transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>{t.leave_review}</span>
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={rev.ownerAvatar}
                  alt={rev.ownerName}
                  className="w-12 h-12 rounded-2xl object-cover border border-stone-200"
                />
                <div>
                  <h4 className="font-extrabold text-sm text-stone-900 flex items-center gap-2">
                    <span>{rev.ownerName}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      {t.verified_client}
                    </span>
                  </h4>
                  <p className="text-xs text-stone-500">
                    Pet: <strong className="text-stone-700">{rev.petName}</strong> • {rev.date}
                  </p>
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: rev.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              "{rev.comment}"
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {rev.tags.map((tg, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200/80 font-semibold"
                >
                  ✓ {tg}
                </span>
              ))}
            </div>

            {/* Walker response (if present) */}
            {rev.walkerResponse && (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5 ml-4 sm:ml-8">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 flex items-center gap-1.5">
                    <span>👟</span>
                    <span>{t.walker_reply} (Alex Rivera)</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {rev.walkerResponse.date}
                  </span>
                </div>
                <p className="text-xs text-stone-600 italic">
                  "{rev.walkerResponse.text}"
                </p>
              </div>
            )}

            {/* Walker reply trigger (if none yet and current role is walker) */}
            {!rev.walkerResponse && currentRole === 'walker' && (
              <div className="pt-2">
                {activeReplyId === rev.id ? (
                  <div className="space-y-2">
                    <textarea
                      value={replyInputMap[rev.id] || ''}
                      onChange={(e) =>
                        setReplyInputMap({ ...replyInputMap, [rev.id]: e.target.value })
                      }
                      placeholder="Write your professional thank you or reply..."
                      rows={2}
                      className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setActiveReplyId(null)}
                        className="px-3 py-1.5 text-xs text-stone-500 hover:text-stone-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleSendReply(rev.id)}
                        className="px-4 py-1.5 text-xs font-bold bg-stone-900 text-white rounded-xl hover:bg-stone-800"
                      >
                        Post Public Reply
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveReplyId(rev.id)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Reply to this review</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Review Submission Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-lg text-stone-900 tracking-tight">
                {t.leave_review}
              </h3>
              <button
                onClick={() => setShowReviewModal(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center font-bold text-stone-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              {/* Star selector */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  How was your walk experience?
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setRating(num)}
                      className="p-1 hover:scale-125 transition"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          num <= rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-stone-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="font-extrabold text-stone-700 text-sm ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
              </div>

              {/* Tag badges */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  Select what stood out most:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleToggleTag(tag)}
                      className={`px-2.5 py-1 rounded-xl font-medium transition ${
                        selectedTags.includes(tag)
                          ? 'bg-amber-500 text-stone-950 font-bold'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Your Feedback / Comment:
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about punctuality, route updates, photo quality, and pet happiness..."
                  rows={4}
                  required
                  className="w-full p-3 rounded-2xl border border-stone-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-md"
                >
                  Publish Verified Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
