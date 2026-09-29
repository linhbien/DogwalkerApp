import {
  Appointment,
  ChatMessage,
  EncryptedHomeAccess,
  PaymentTransaction,
  Pet,
  PushNotification,
  Review,
  Role,
  UserProfile,
  WalkPhoto,
  WalkSession,
} from '../types';

const STORAGE_KEYS = {
  PETS: 'pawroute_pets',
  APPOINTMENTS: 'pawroute_appointments',
  WALK_SESSIONS: 'pawroute_walk_sessions',
  PHOTOS: 'pawroute_photos',
  CHATS: 'pawroute_chats',
  REVIEWS: 'pawroute_reviews',
  PAYMENTS: 'pawroute_payments',
  NOTIFICATIONS: 'pawroute_notifications',
  USER_PROFILES: 'pawroute_user_profiles',
  ACTIVE_WALK_ID: 'pawroute_active_walk_id',
  OFFLINE_QUEUE: 'pawroute_offline_queue',
};

// Seed Pets
export const initialPets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Milo',
    breed: 'Golden Retriever',
    age: 3,
    weight: 31,
    avatarUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    gender: 'male',
    ownerId: 'user-owner-1',
    notes: 'Very gentle and energetic. Loves fetching sticks in the park. Gets excited when seeing other dogs.',
    leashLocation: 'Front hallway peg next to the door. Use blue harness.',
    favoriteTreats: 'Peanut butter crunchy biscuits and salmon nibbles.',
    medicationInfo: 'None currently. Joint supplement daily with dinner.',
    vetName: 'Central City Animal Hospital (Dr. Chen)',
    vetPhone: '+1 (555) 234-8899',
    vaccinated: true,
    friendlyWithDogs: true,
    friendlyWithCats: true,
  },
  {
    id: 'pet-2',
    name: 'Luna',
    breed: 'Border Collie',
    age: 2,
    weight: 19,
    avatarUrl: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=600&q=80',
    gender: 'female',
    ownerId: 'user-owner-1',
    notes: 'Extremely smart and fast. Needs plenty of mental stimulation and scent games. Slight poultry sensitivity.',
    leashLocation: 'Hanging by the laundry room entrance. Pink reflective collar.',
    favoriteTreats: 'Freeze-dried beef liver only.',
    medicationInfo: 'Sensitive stomach: only owner-approved treats.',
    vetName: 'Central City Animal Hospital (Dr. Chen)',
    vetPhone: '+1 (555) 234-8899',
    vaccinated: true,
    friendlyWithDogs: true,
    friendlyWithCats: false,
  },
  {
    id: 'pet-3',
    name: 'Barnaby',
    breed: 'French Bulldog',
    age: 4,
    weight: 13,
    avatarUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    gender: 'male',
    ownerId: 'user-owner-2',
    notes: 'Sweet couch potato! Provide fresh water every 10-15 mins. Use cooling vest if temperature exceeds 23°C.',
    leashLocation: 'Basket in the foyer. Step-in harness.',
    favoriteTreats: 'Sweet potato chewy sticks.',
    vetName: 'Metro Paws Veterinary Clinic',
    vetPhone: '+1 (555) 876-1212',
    vaccinated: true,
    friendlyWithDogs: true,
    friendlyWithCats: true,
  },
  {
    id: 'pet-4',
    name: 'Bella',
    breed: 'Chocolate Labrador',
    age: 5,
    weight: 29,
    avatarUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80',
    gender: 'female',
    ownerId: 'user-owner-3',
    notes: 'Loves water puddles and park grass. Reliable recall.',
    leashLocation: 'Back door hook.',
    favoriteTreats: 'Carrot slices & apple cubes.',
    vetName: 'Greenwood Vet Care',
    vetPhone: '+1 (555) 901-4455',
    vaccinated: true,
    friendlyWithDogs: true,
    friendlyWithCats: true,
  },
];

// Encrypted Home Access info
export const initialHomeAccess: EncryptedHomeAccess = {
  lockboxCode: '7492',
  alarmCode: '3819#',
  gateCode: '9021',
  specialInstructions: 'Lockbox is under the flower pot on the left porch. Please wipe Milo paws if rainy!',
  isEncrypted: true,
  encryptionHash: 'AES256-GCM-SHA256-9938a9fe84',
  lastUpdated: '2026-09-25T14:30:00Z',
};

// Seed User Profiles
export const initialProfiles: Record<Role, UserProfile> = {
  walker: {
    id: 'user-walker-1',
    name: 'Alex Rivera',
    email: 'alex.rivera@pawroute.pro',
    phone: '+1 (555) 392-8172',
    role: 'walker',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    address: '142 Maplewood Ave, San Francisco, CA',
    bio: 'Certified pet first-aid trained dog walker with 6+ years professional experience. Dedicated to happy, safe, and enriching adventures for your best friends!',
    rating: 4.98,
    totalWalks: 348,
    hourlyRate: 35,
  },
  owner: {
    id: 'user-owner-1',
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 762-1984',
    role: 'owner',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    address: '782 Willow Oak Blvd, San Francisco, CA',
    homeAccess: initialHomeAccess,
  },
};

// Pre-seeded GPS route (San Francisco park circuit)
export const initialSampleCoordinates = [
  { lat: 37.7694, lng: -122.4662, timestamp: '2026-09-29T10:00:00Z', speed: 4.2 },
  { lat: 37.7698, lng: -122.4658, timestamp: '2026-09-29T10:03:00Z', speed: 4.5 },
  { lat: 37.7705, lng: -122.4651, timestamp: '2026-09-29T10:07:00Z', speed: 4.1 },
  { lat: 37.7712, lng: -122.4645, timestamp: '2026-09-29T10:11:00Z', speed: 3.8 },
  { lat: 37.7719, lng: -122.4638, timestamp: '2026-09-29T10:15:00Z', speed: 4.6 },
  { lat: 37.7725, lng: -122.4647, timestamp: '2026-09-29T10:20:00Z', speed: 4.0 },
  { lat: 37.7722, lng: -122.4660, timestamp: '2026-09-29T10:24:00Z', speed: 3.9 },
  { lat: 37.7715, lng: -122.4672, timestamp: '2026-09-29T10:28:00Z', speed: 4.3 },
  { lat: 37.7706, lng: -122.4679, timestamp: '2026-09-29T10:32:00Z', speed: 4.4 },
  { lat: 37.7697, lng: -122.4671, timestamp: '2026-09-29T10:35:00Z', speed: 3.7 },
  { lat: 37.7694, lng: -122.4662, timestamp: '2026-09-29T10:38:00Z', speed: 3.5 },
];

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-1',
    petIds: ['pet-1', 'pet-2'],
    walkerId: 'user-walker-1',
    ownerId: 'user-owner-1',
    serviceType: 'adventure_walk',
    date: '2026-09-29',
    time: '10:00',
    durationMinutes: 45,
    isRecurring: true,
    recurrenceFrequency: 'weekdays',
    status: 'in_progress',
    price: 45.0,
    isPaid: false,
    specialRequests: 'Work on heel command when passing other dogs on the trail.',
    walkSessionId: 'walk-session-1',
  },
  {
    id: 'apt-2',
    petIds: ['pet-3'],
    walkerId: 'user-walker-1',
    ownerId: 'user-owner-2',
    serviceType: 'standard_walk',
    date: '2026-09-29',
    time: '14:30',
    durationMinutes: 30,
    isRecurring: true,
    recurrenceFrequency: 'daily',
    status: 'scheduled',
    price: 32.0,
    isPaid: true,
    paymentId: 'pay-2',
    specialRequests: 'Stay in the shady park section. Give water half-way.',
  },
  {
    id: 'apt-3',
    petIds: ['pet-4'],
    walkerId: 'user-walker-1',
    ownerId: 'user-owner-3',
    serviceType: 'standard_walk',
    date: '2026-09-30',
    time: '11:00',
    durationMinutes: 30,
    isRecurring: true,
    recurrenceFrequency: 'weekly',
    status: 'scheduled',
    price: 35.0,
    isPaid: false,
  },
  {
    id: 'apt-4',
    petIds: ['pet-1'],
    walkerId: 'user-walker-1',
    ownerId: 'user-owner-1',
    serviceType: 'quick_relief',
    date: '2026-09-28',
    time: '16:00',
    durationMinutes: 20,
    isRecurring: false,
    status: 'completed',
    price: 25.0,
    isPaid: true,
    paymentId: 'pay-1',
    walkSessionId: 'walk-session-prev-1',
  },
];

export const initialWalkPhotos: WalkPhoto[] = [
  {
    id: 'photo-1',
    walkId: 'walk-session-1',
    petId: 'pet-1',
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    caption: 'Milo having a blast on the sunny lawn! ☀️🐾',
    timestamp: '2026-09-29T10:14:00Z',
    lat: 37.7712,
    lng: -122.4645,
    likes: 12,
    tags: ['SunnyDay', 'HappyPup', 'ParkFun'],
  },
  {
    id: 'photo-2',
    walkId: 'walk-session-1',
    petId: 'pet-2',
    url: 'https://images.unsplash.com/photo-1503256207526-0d5d80fa2f47?auto=format&fit=crop&w=800&q=80',
    caption: 'Luna focused and ready for the trail! 🐕💨',
    timestamp: '2026-09-29T10:22:00Z',
    lat: 37.7725,
    lng: -122.4647,
    likes: 9,
    tags: ['Agility', 'TrailTime', 'BestFriends'],
  },
  {
    id: 'photo-3',
    walkId: 'walk-session-prev-1',
    petId: 'pet-1',
    url: 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=800&q=80',
    caption: 'Post-walk cozy stretch and belly rubs. 💤',
    timestamp: '2026-09-28T16:25:00Z',
    lat: 37.7694,
    lng: -122.4662,
    likes: 18,
    tags: ['NapTime', 'GoodBoy'],
  },
  {
    id: 'photo-4',
    walkId: 'walk-session-prev-2',
    petId: 'pet-3',
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    caption: 'Barnaby rocking his handsome harness on the boulevard stroll.',
    timestamp: '2026-09-27T15:10:00Z',
    lat: 37.7730,
    lng: -122.4610,
    likes: 14,
    tags: ['FrenchieLife', 'HandsomePup'],
  },
];

export const initialWalkSessions: WalkSession[] = [
  {
    id: 'walk-session-1',
    appointmentId: 'apt-1',
    walkerId: 'user-walker-1',
    petIds: ['pet-1', 'pet-2'],
    startTime: '2026-09-29T10:00:00Z',
    durationMinutes: 38,
    distanceKm: 2.84,
    paceMinPerKm: 13.4,
    routeCoordinates: initialSampleCoordinates,
    events: [
      {
        id: 'ev-1',
        type: 'pee',
        title: 'Milo Pee Break',
        lat: 37.7698,
        lng: -122.4658,
        timestamp: '2026-09-29T10:04:00Z',
      },
      {
        id: 'ev-2',
        type: 'poop',
        title: 'Milo Poop (Disposed in park bin)',
        lat: 37.7712,
        lng: -122.4645,
        timestamp: '2026-09-29T10:12:00Z',
      },
      {
        id: 'ev-3',
        type: 'water',
        title: 'Hydration Break (Both dogs drank ~200ml)',
        lat: 37.7725,
        lng: -122.4647,
        timestamp: '2026-09-29T10:21:00Z',
      },
      {
        id: 'ev-4',
        type: 'pee',
        title: 'Luna Pee Break',
        lat: 37.7715,
        lng: -122.4672,
        timestamp: '2026-09-29T10:29:00Z',
      },
    ],
    photos: [initialWalkPhotos[0], initialWalkPhotos[1]],
    notes: 'Wonderful energy today! Both Milo and Luna walked nicely on loose leash. Stopped for water near the fountain. Lots of tail wags!',
    status: 'in_progress',
    peeCount: 2,
    poopCount: 1,
    waterGiven: true,
    foodGiven: false,
  },
  {
    id: 'walk-session-prev-1',
    appointmentId: 'apt-4',
    walkerId: 'user-walker-1',
    petIds: ['pet-1'],
    startTime: '2026-09-28T16:00:00Z',
    endTime: '2026-09-28T16:22:00Z',
    durationMinutes: 22,
    distanceKm: 1.45,
    paceMinPerKm: 15.1,
    routeCoordinates: initialSampleCoordinates.slice(0, 6),
    events: [
      {
        id: 'ev-p1',
        type: 'pee',
        title: 'Pee near garden corner',
        lat: 37.7698,
        lng: -122.4658,
        timestamp: '2026-09-28T16:05:00Z',
      },
      {
        id: 'ev-p2',
        type: 'poop',
        title: 'Poop bagged & discarded',
        lat: 37.7712,
        lng: -122.4645,
        timestamp: '2026-09-28T16:15:00Z',
      },
    ],
    photos: [initialWalkPhotos[2]],
    notes: 'Quick relief walk completed. Refilled Milo water bowl and gave him one carrot crunch treat as instructed.',
    status: 'completed',
    peeCount: 1,
    poopCount: 1,
    waterGiven: true,
    foodGiven: true,
    rating: 5,
    feedback: 'Alex is always so thorough and sends the best photos! Milo adores him.',
  },
];

export const initialChats: ChatMessage[] = [
  {
    id: 'chat-1',
    senderId: 'user-walker-1',
    senderName: 'Alex Rivera',
    senderRole: 'walker',
    content: 'Good morning Sarah! Heading over to your place now for Milo and Luna’s morning adventure.',
    timestamp: '2026-09-29T09:45:00Z',
    read: true,
  },
  {
    id: 'chat-2',
    senderId: 'user-owner-1',
    senderName: 'Sarah Jenkins',
    senderRole: 'owner',
    content: 'Morning Alex! Sounds great. The front lockbox code is the same. Extra treats are in the blue jar on the counter!',
    timestamp: '2026-09-29T09:48:00Z',
    read: true,
  },
  {
    id: 'chat-3',
    senderId: 'user-walker-1',
    senderName: 'Alex Rivera',
    senderRole: 'walker',
    content: '🐾 Arrived at the house and got the pups geared up in their harnesses!',
    timestamp: '2026-09-29T09:58:00Z',
    isAutomated: true,
    read: true,
  },
  {
    id: 'chat-4',
    senderId: 'user-walker-1',
    senderName: 'Alex Rivera',
    senderRole: 'walker',
    content: '🚀 Live GPS Walk has officially started! Tracking route now.',
    timestamp: '2026-09-29T10:00:00Z',
    isAutomated: true,
    read: true,
  },
  {
    id: 'chat-5',
    senderId: 'user-walker-1',
    senderName: 'Alex Rivera',
    senderRole: 'walker',
    content: 'Just snapped a quick photo of Milo in the meadow! He was greeting a butterfly.',
    timestamp: '2026-09-29T10:14:00Z',
    photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    read: true,
  },
  {
    id: 'chat-6',
    senderId: 'user-owner-1',
    senderName: 'Sarah Jenkins',
    senderRole: 'owner',
    content: 'Awww look at that face! ❤️ Thank you Alex!',
    timestamp: '2026-09-29T10:16:00Z',
    read: true,
  },
];

export const initialReviews: Review[] = [
  {
    id: 'rev-1',
    ownerId: 'user-owner-1',
    ownerName: 'Sarah Jenkins',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    petName: 'Milo & Luna',
    walkerId: 'user-walker-1',
    rating: 5,
    date: '2026-09-28',
    comment: 'Alex is the absolute best walker we have ever had! The live GPS tracking gives so much peace of mind, and the visit reports with potty logs and high-res photos are unmatched. 10/10 recommend!',
    tags: ['Super Punctual', 'Great Photos', 'Gentle Lead', 'Dog Whisperer'],
    walkerResponse: {
      date: '2026-09-28',
      text: 'Thank you Sarah! Milo and Luna are such joyous companions, always looking forward to our walks!',
    },
  },
  {
    id: 'rev-2',
    ownerId: 'user-owner-2',
    ownerName: 'Marcus Vance',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    petName: 'Barnaby',
    walkerId: 'user-walker-1',
    rating: 5,
    date: '2026-09-26',
    comment: 'Barnaby can be stubborn and overheats quickly, but Alex knows exactly how to pace the walk, keep him hydrated in the shade, and make it fun. Very professional.',
    tags: ['Careful with Heat', 'Reliable Updates', 'Patient'],
    walkerResponse: {
      date: '2026-09-26',
      text: 'Barnaby is a little rockstar! Always happy to tailor the pace for his comfort.',
    },
  },
  {
    id: 'rev-3',
    ownerId: 'user-owner-3',
    ownerName: 'Elena Rostova',
    ownerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    petName: 'Bella',
    walkerId: 'user-walker-1',
    rating: 5,
    date: '2026-09-24',
    comment: 'Seamless booking and recurring walk feature! Automated text updates before arrival are super helpful.',
    tags: ['Flawless Scheduling', 'Great Communication'],
  },
];

export const initialPayments: PaymentTransaction[] = [
  {
    id: 'pay-1',
    appointmentId: 'apt-4',
    walkSessionId: 'walk-session-prev-1',
    ownerId: 'user-owner-1',
    walkerId: 'user-walker-1',
    amount: 25.0,
    tipAmount: 6.0,
    totalAmount: 31.0,
    serviceFee: 1.25,
    netPayout: 29.75,
    status: 'paid',
    paymentMethod: 'card',
    date: '2026-09-28T16:40:00Z',
    receiptNumber: 'REC-2026-0928-881',
    cardLast4: '4242',
  },
  {
    id: 'pay-2',
    appointmentId: 'apt-2',
    ownerId: 'user-owner-2',
    walkerId: 'user-walker-1',
    amount: 32.0,
    tipAmount: 8.0,
    totalAmount: 40.0,
    serviceFee: 1.6,
    netPayout: 38.4,
    status: 'paid',
    paymentMethod: 'apple_pay',
    date: '2026-09-27T17:15:00Z',
    receiptNumber: 'REC-2026-0927-410',
  },
  {
    id: 'pay-3',
    appointmentId: 'apt-prev-3',
    ownerId: 'user-owner-3',
    walkerId: 'user-walker-1',
    amount: 35.0,
    tipAmount: 7.0,
    totalAmount: 42.0,
    serviceFee: 1.75,
    netPayout: 40.25,
    status: 'paid',
    paymentMethod: 'card',
    date: '2026-09-26T12:00:00Z',
    receiptNumber: 'REC-2026-0926-291',
    cardLast4: '1098',
  },
];

export const initialNotifications: PushNotification[] = [
  {
    id: 'notif-1',
    title: 'Live Walk in Progress 🐕',
    message: 'Alex is currently walking Milo & Luna (2.8 km traversed, 2 potty breaks logged).',
    timestamp: '2026-09-29T10:15:00Z',
    type: 'visit',
    read: false,
    linkAction: 'live_walk',
  },
  {
    id: 'notif-2',
    title: 'Milestone Unlocked! 🏆',
    message: 'Performance Alert: You completed 50 miles this month with a 100% on-time record!',
    timestamp: '2026-09-29T08:30:00Z',
    type: 'performance',
    read: false,
    linkAction: 'analytics',
  },
  {
    id: 'notif-3',
    title: 'Payment Received: $31.00 💳',
    message: 'Sarah Jenkins paid for Milo’s walk including a $6.00 tip.',
    timestamp: '2026-09-28T16:41:00Z',
    type: 'payment',
    read: true,
    linkAction: 'payments',
  },
  {
    id: 'notif-4',
    title: 'Automated Visit Reminder ⏰',
    message: 'Upcoming walk with Barnaby today at 2:30 PM. Weather is sunny (21°C).',
    timestamp: '2026-09-29T07:00:00Z',
    type: 'reminder',
    read: true,
    linkAction: 'schedule',
  },
];

// Helper functions for persistent state with fallback
export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from storage:`, err);
    return fallback;
  }
}

export function setStoredData<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to storage:`, err);
  }
}

// Local cache / offline queue management
export function addToOfflineQueue(item: { type: string; payload: unknown; timestamp: string }): void {
  const queue = getStoredData<Array<{ type: string; payload: unknown; timestamp: string }>>(
    STORAGE_KEYS.OFFLINE_QUEUE,
    []
  );
  queue.push(item);
  setStoredData(STORAGE_KEYS.OFFLINE_QUEUE, queue);
}

export function clearOfflineQueue(): void {
  setStoredData(STORAGE_KEYS.OFFLINE_QUEUE, []);
}

export function getOfflineQueueCount(): number {
  const queue = getStoredData<unknown[]>(STORAGE_KEYS.OFFLINE_QUEUE, []);
  return queue.length;
}
