/**
 * PawRoute - Professional Dog Walker GPS, Scheduling & Pet Care Platform
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LiveWalkTracker } from './components/LiveWalkTracker';
import { ScheduleView } from './components/ScheduleView';
import { MessagingView } from './components/MessagingView';
import { PhotoGalleryView } from './components/PhotoGalleryView';
import { PaymentsView } from './components/PaymentsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ReviewsView } from './components/ReviewsView';
import { PetProfilesView } from './components/PetProfilesView';
import { NotificationsModal } from './components/NotificationsModal';
import { VisitReportModal } from './components/VisitReportModal';
import { SocialShareModal } from './components/SocialShareModal';

import {
  Appointment,
  ChatMessage,
  EncryptedHomeAccess,
  Language,
  PaymentTransaction,
  Pet,
  PushNotification,
  Review,
  Role,
  UserProfile,
  WalkPhoto,
  WalkSession,
} from './types';

import {
  addToOfflineQueue,
  clearOfflineQueue,
  getOfflineQueueCount,
  getStoredData,
  initialAppointments,
  initialChats,
  initialNotifications,
  initialPayments,
  initialPets,
  initialProfiles,
  initialReviews,
  initialWalkPhotos,
  initialWalkSessions,
  setStoredData,
} from './utils/storage';

export default function App() {
  // Global App States
  const [currentRole, setCurrentRole] = useState<Role>('walker');
  const [language, setLanguage] = useState<Language>('en');
  const [activeTab, setActiveTab] = useState<string>('live_walk');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [offlineQueueCount, setOfflineQueueCount] = useState<number>(getOfflineQueueCount());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Core Data States with localStorage persistence
  const [pets, setPets] = useState<Pet[]>(() =>
    getStoredData('pawroute_pets', initialPets)
  );
  const [userProfiles, setUserProfiles] = useState<Record<Role, UserProfile>>(() =>
    getStoredData('pawroute_user_profiles', initialProfiles)
  );
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    getStoredData('pawroute_appointments', initialAppointments)
  );
  const [walkSessions, setWalkSessions] = useState<WalkSession[]>(() =>
    getStoredData('pawroute_walk_sessions', initialWalkSessions)
  );
  const [photos, setPhotos] = useState<WalkPhoto[]>(() =>
    getStoredData('pawroute_photos', initialWalkPhotos)
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getStoredData('pawroute_chats', initialChats)
  );
  const [reviews, setReviews] = useState<Review[]>(() =>
    getStoredData('pawroute_reviews', initialReviews)
  );
  const [payments, setPayments] = useState<PaymentTransaction[]>(() =>
    getStoredData('pawroute_payments', initialPayments)
  );
  const [notifications, setNotifications] = useState<PushNotification[]>(() =>
    getStoredData('pawroute_notifications', initialNotifications)
  );

  // Active walk session (first in_progress or first session)
  const activeWalkSession =
    walkSessions.find((s) => s.status === 'in_progress') || walkSessions[0];

  // Modals
  const [showNotificationsModal, setShowNotificationsModal] = useState<boolean>(false);
  const [reportModalSession, setReportModalSession] = useState<WalkSession | null>(null);
  const [socialSharePhoto, setSocialSharePhoto] = useState<WalkPhoto | undefined>(undefined);
  const [socialShareSession, setSocialShareSession] = useState<WalkSession | undefined>(undefined);
  const [showSocialShareModal, setShowSocialShareModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Real-time network listener
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync state to localStorage whenever modified
  useEffect(() => setStoredData('pawroute_pets', pets), [pets]);
  useEffect(() => setStoredData('pawroute_user_profiles', userProfiles), [userProfiles]);
  useEffect(() => setStoredData('pawroute_appointments', appointments), [appointments]);
  useEffect(() => setStoredData('pawroute_walk_sessions', walkSessions), [walkSessions]);
  useEffect(() => setStoredData('pawroute_photos', photos), [photos]);
  useEffect(() => setStoredData('pawroute_chats', messages), [messages]);
  useEffect(() => setStoredData('pawroute_reviews', reviews), [reviews]);
  useEffect(() => setStoredData('pawroute_payments', payments), [payments]);
  useEffect(() => setStoredData('pawroute_notifications', notifications), [notifications]);

  // Show temporary toast notification
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  // Toggle online/offline mode (for offline testing simulation)
  const handleToggleOnline = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    if (!nextState) {
      triggerToast('Switched to Offline Mode. GPS waypoints & edits stored locally.');
    } else {
      triggerToast('Network restored! You are back online.');
    }
  };

  // Cloud Sync
  const handleSyncCloud = () => {
    setIsSyncing(true);
    setTimeout(() => {
      clearOfflineQueue();
      setOfflineQueueCount(0);
      setIsSyncing(false);
      triggerToast('Cloud Storage synchronized successfully across all devices!');
    }, 1200);
  };

  // Update active walk session
  const handleUpdateWalkSession = (updatedSession: WalkSession) => {
    const updated = walkSessions.map((s) => (s.id === updatedSession.id ? updatedSession : s));
    setWalkSessions(updated);

    if (!isOnline) {
      addToOfflineQueue({
        type: 'WALK_UPDATE',
        payload: updatedSession,
        timestamp: new Date().toISOString(),
      });
      setOfflineQueueCount(getOfflineQueueCount());
    }
  };

  // Complete Walk
  const handleCompleteWalk = (completedSession: WalkSession) => {
    const updated = walkSessions.map((s) => (s.id === completedSession.id ? completedSession : s));
    setWalkSessions(updated);

    // Update appointment status to completed
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === completedSession.appointmentId ? { ...apt, status: 'completed' } : apt
      )
    );

    // Push notification
    const newNotif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'Walk Completed! 🏁',
      message: `Walk with ${pets.filter((p) => completedSession.petIds.includes(p.id)).map((p) => p.name).join(' & ')} completed! Visit report is ready.`,
      timestamp: new Date().toISOString(),
      type: 'visit',
      read: false,
      linkAction: 'live_walk',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // Open Visit Report Modal
    setReportModalSession(completedSession);
    triggerToast('Walk complete! Visit report generated & owner notified.');
  };

  // Add Photo
  const handleAddPhoto = (newPhoto: WalkPhoto) => {
    setPhotos((prev) => [newPhoto, ...prev]);

    // Attach to active walk session photos list
    if (activeWalkSession) {
      const updatedSession = {
        ...activeWalkSession,
        photos: [newPhoto, ...activeWalkSession.photos],
      };
      handleUpdateWalkSession(updatedSession);
    }
    triggerToast('New photo geotagged and added to pet gallery!');
  };

  // Send Chat Message
  const handleSendMessage = (content: string, isAutomated = false, photoUrl?: string) => {
    const currentSender = userProfiles[currentRole];
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentSender.id,
      senderName: currentSender.name,
      senderRole: currentRole,
      content,
      timestamp: new Date().toISOString(),
      photoUrl,
      isAutomated,
      read: true,
    };

    setMessages((prev) => [...prev, newMsg]);

    // If sent as walker, create notification for owner
    if (currentRole === 'walker') {
      const notif: PushNotification = {
        id: `notif-${Date.now()}`,
        title: isAutomated ? 'Walk Activity Update 🐾' : 'New Message from Alex',
        message: content,
        timestamp: new Date().toISOString(),
        type: 'message',
        read: false,
        linkAction: 'messages',
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  // Book Appointment
  const handleBookAppointment = (newAppointment: Appointment) => {
    setAppointments((prev) => [newAppointment, ...prev]);

    if (!isOnline) {
      addToOfflineQueue({
        type: 'NEW_BOOKING',
        payload: newAppointment,
        timestamp: new Date().toISOString(),
      });
      setOfflineQueueCount(getOfflineQueueCount());
      triggerToast('Appointment scheduled in Offline Mode. Cached locally.');
    } else {
      triggerToast('Walk appointment scheduled & added to calendar!');
    }

    const notif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'New Booking Confirmed 📅',
      message: `Appointment for ${newAppointment.date} at ${newAppointment.time} confirmed.`,
      timestamp: new Date().toISOString(),
      type: 'reminder',
      read: false,
      linkAction: 'schedule',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Start Walk from schedule
  const handleStartWalkFromSchedule = (apt: Appointment) => {
    // Set appointment in_progress
    const updatedApts = appointments.map((a) => (a.id === apt.id ? { ...a, status: 'in_progress' as const } : a));
    setAppointments(updatedApts);

    // Create or find walk session
    let session = walkSessions.find((s) => s.appointmentId === apt.id);
    if (!session) {
      session = {
        id: `walk-session-${Date.now()}`,
        appointmentId: apt.id,
        walkerId: apt.walkerId,
        petIds: apt.petIds,
        startTime: new Date().toISOString(),
        durationMinutes: 0,
        distanceKm: 0,
        paceMinPerKm: 12.0,
        routeCoordinates: [
          { lat: 37.7712, lng: -122.4645, timestamp: new Date().toISOString(), speed: 4.2 },
        ],
        events: [],
        photos: [],
        notes: '',
        status: 'in_progress',
        peeCount: 0,
        poopCount: 0,
        waterGiven: false,
        foodGiven: false,
      };
      setWalkSessions([session, ...walkSessions]);
    } else {
      session = { ...session, status: 'in_progress' };
      handleUpdateWalkSession(session);
    }

    setActiveTab('live_walk');
    handleSendMessage(`🚀 Walk started for ${pets.filter((p) => apt.petIds.includes(p.id)).map((p) => p.name).join(' & ')}! Live GPS route tracking active.`, true);
    triggerToast('Live GPS Walk started! Tracking position now.');
  };

  // Process Payment
  const handleProcessPayment = (tx: PaymentTransaction) => {
    setPayments((prev) => [tx, ...prev]);

    // Mark appointment as paid
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === tx.appointmentId ? { ...apt, isPaid: true, paymentId: tx.id } : apt
      )
    );

    // Add notification
    const notif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: `Payment Received: $${tx.totalAmount.toFixed(2)} 💳`,
      message: `Invoice #${tx.receiptNumber} successfully paid including $${tx.tipAmount.toFixed(2)} tip!`,
      timestamp: new Date().toISOString(),
      type: 'payment',
      read: false,
      linkAction: 'payments',
    };
    setNotifications((prev) => [notif, ...prev]);
    triggerToast(`Payment of $${tx.totalAmount.toFixed(2)} processed successfully!`);
  };

  // Like Photo
  const handleLikePhoto = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, likes: p.likes + 1 } : p))
    );
  };

  // Open Social Share
  const handleOpenSocialShare = (photo?: WalkPhoto, session?: WalkSession) => {
    setSocialSharePhoto(photo);
    setSocialShareSession(session);
    setShowSocialShareModal(true);
  };

  // Add Review
  const handleAddReview = (newReview: Review) => {
    setReviews((prev) => [newReview, ...prev]);
    triggerToast('Thank you! Your verified review has been published.');

    const notif: PushNotification = {
      id: `notif-${Date.now()}`,
      title: 'New 5-Star Review Received! ⭐',
      message: `${newReview.ownerName} left a glowing review for ${newReview.petName}'s walks.`,
      timestamp: new Date().toISOString(),
      type: 'performance',
      read: false,
      linkAction: 'reviews',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  // Add Walker Reply to Review
  const handleAddWalkerReply = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              walkerResponse: {
                date: new Date().toISOString().slice(0, 10),
                text: replyText,
              },
            }
          : r
      )
    );
    triggerToast('Reply posted to client review.');
  };

  // Update Encrypted Home Access
  const handleUpdateHomeAccess = (newAccess: EncryptedHomeAccess) => {
    setUserProfiles((prev) => ({
      ...prev,
      owner: {
        ...prev.owner,
        homeAccess: newAccess,
      },
    }));
    triggerToast('Encrypted home access codes updated & encrypted with AES-256.');
  };

  // Add Pet
  const handleAddPet = (newPet: Pet) => {
    setPets((prev) => [...prev, newPet]);
    triggerToast(`Added ${newPet.name} to registered pets!`);
  };

  // Trigger simulated push notification
  const handleTriggerTestPush = (type: 'visit' | 'payment' | 'performance') => {
    let title = 'Live Visit Update 🐾';
    let message = 'Milo just finished a 35-minute park stroll with Alex Rivera!';

    if (type === 'payment') {
      title = 'Payment Processed 💳';
      message = 'Receipt #REC-2026-9921 for $42.00 deposited into walker account.';
    } else if (type === 'performance') {
      title = 'Performance Milestone! 🏆';
      message = 'Congratulations! You achieved a 100% 5-star rating across all walks this week!';
    }

    const testNotif: PushNotification = {
      id: `test-notif-${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      type,
      read: false,
    };

    setNotifications((prev) => [testNotif, ...prev]);
    triggerToast(`[Push Notification] ${title}`);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 flex flex-col font-sans">
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-18 right-4 z-50 bg-stone-900 text-white px-4 py-2.5 rounded-2xl shadow-xl border border-stone-700 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="text-amber-400">🐾</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        language={language}
        onLanguageChange={setLanguage}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        offlineQueueCount={offlineQueueCount}
        onSyncCloud={handleSyncCloud}
        isSyncing={isSyncing}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setShowNotificationsModal(true)}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isWalkActive={activeWalkSession.status === 'in_progress'}
      />

      {/* Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'live_walk' && (
          <LiveWalkTracker
            walkSession={activeWalkSession}
            pets={pets}
            language={language}
            onUpdateSession={handleUpdateWalkSession}
            onCompleteWalk={handleCompleteWalk}
            onAddPhoto={handleAddPhoto}
            onSendChatMessage={handleSendMessage}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView
            appointments={appointments}
            pets={pets}
            role={currentRole}
            language={language}
            isOnline={isOnline}
            onBookAppointment={handleBookAppointment}
            onStartWalkFromSchedule={handleStartWalkFromSchedule}
            onPayAppointment={(apt) => {
              setActiveTab('payments');
            }}
          />
        )}

        {activeTab === 'messages' && (
          <MessagingView
            messages={messages}
            currentRole={currentRole}
            language={language}
            onSendMessage={handleSendMessage}
          />
        )}

        {activeTab === 'photos' && (
          <PhotoGalleryView
            photos={photos}
            pets={pets}
            language={language}
            onLikePhoto={handleLikePhoto}
            onSharePhoto={(photo) => handleOpenSocialShare(photo, undefined)}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsView
            transactions={payments}
            appointments={appointments}
            pets={pets}
            currentRole={currentRole}
            language={language}
            onProcessPayment={handleProcessPayment}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            transactions={payments}
            walkSessions={walkSessions}
            appointments={appointments}
            language={language}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsView
            reviews={reviews}
            currentRole={currentRole}
            language={language}
            onAddReview={handleAddReview}
            onAddWalkerReply={handleAddWalkerReply}
          />
        )}

        {activeTab === 'pets' && (
          <PetProfilesView
            pets={pets}
            userProfiles={userProfiles}
            currentRole={currentRole}
            language={language}
            onUpdateHomeAccess={handleUpdateHomeAccess}
            onAddPet={handleAddPet}
          />
        )}
      </main>

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <NotificationsModal
          notifications={notifications}
          language={language}
          onClose={() => setShowNotificationsModal(false)}
          onMarkAllRead={() => {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          }}
          onSelectAction={(actionKey) => setActiveTab(actionKey)}
          onTriggerTestPush={handleTriggerTestPush}
        />
      )}

      {/* Visit Report Modal */}
      {reportModalSession && (
        <VisitReportModal
          session={reportModalSession}
          pets={pets}
          language={language}
          onClose={() => setReportModalSession(null)}
          onShareReport={() => {
            handleOpenSocialShare(undefined, reportModalSession);
          }}
          onPayNow={
            currentRole === 'owner'
              ? () => {
                  setReportModalSession(null);
                  setActiveTab('payments');
                }
              : undefined
          }
        />
      )}

      {/* Social Share Modal */}
      {showSocialShareModal && (
        <SocialShareModal
          photo={socialSharePhoto}
          session={socialShareSession}
          onClose={() => setShowSocialShareModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 py-6 border-t border-stone-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 text-base">🐾</span>
            <span className="font-extrabold text-white">PawRoute Pro</span>
            <span className="text-stone-500">— GPS Route Tracker & Pet Care Ecosystem</span>
          </div>

          <div className="flex items-center gap-4 text-stone-400">
            <span>🔒 AES-256 Encrypted</span>
            <span>•</span>
            <span>📡 Offline-Ready GPS</span>
            <span>•</span>
            <span>⚡ Instant Payouts</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
