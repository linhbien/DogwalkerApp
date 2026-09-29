export type Role = 'walker' | 'owner';

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja';

export type WalkStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';

export type ServiceType = 
  | 'quick_relief' // 15 min
  | 'standard_walk' // 30 min
  | 'adventure_walk' // 60 min
  | 'pack_social' // 45 min
  | 'house_visit'; // 30 min

export type PottyType = 'pee' | 'poop' | 'both' | 'water' | 'treat' | 'hazard' | 'photo';

export interface RouteCoordinate {
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number; // km/h
}

export interface WalkEvent {
  id: string;
  type: PottyType;
  title: string;
  lat: number;
  lng: number;
  timestamp: string;
  notes?: string;
  photoUrl?: string;
}

export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number; // kg or lbs
  avatarUrl: string;
  gender: 'male' | 'female';
  ownerId: string;
  notes: string;
  leashLocation: string;
  favoriteTreats: string;
  medicationInfo?: string;
  vetName: string;
  vetPhone: string;
  vaccinated: boolean;
  friendlyWithDogs: boolean;
  friendlyWithCats: boolean;
}

export interface EncryptedHomeAccess {
  lockboxCode: string;
  alarmCode: string;
  gateCode: string;
  specialInstructions: string;
  isEncrypted: boolean;
  encryptionHash: string;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl: string;
  address: string;
  homeAccess?: EncryptedHomeAccess;
  bio?: string;
  rating?: number;
  totalWalks?: number;
  hourlyRate?: number;
}

export interface WalkPhoto {
  id: string;
  walkId: string;
  petId: string;
  url: string;
  caption: string;
  timestamp: string;
  lat?: number;
  lng?: number;
  likes: number;
  tags: string[];
}

export interface WalkSession {
  id: string;
  appointmentId: string;
  walkerId: string;
  petIds: string[];
  startTime: string;
  endTime?: string;
  durationMinutes: number; // live or finalized
  distanceKm: number; // in kilometers
  paceMinPerKm: number;
  routeCoordinates: RouteCoordinate[];
  events: WalkEvent[];
  photos: WalkPhoto[];
  notes: string;
  status: WalkStatus;
  peeCount: number;
  poopCount: number;
  waterGiven: boolean;
  foodGiven: boolean;
  rating?: number;
  feedback?: string;
}

export interface Appointment {
  id: string;
  petIds: string[];
  walkerId: string;
  ownerId: string;
  serviceType: ServiceType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  durationMinutes: number;
  isRecurring: boolean;
  recurrenceFrequency?: 'daily' | 'weekdays' | 'weekly' | 'biweekly';
  status: WalkStatus;
  price: number;
  isPaid: boolean;
  paymentId?: string;
  specialRequests?: string;
  walkSessionId?: string;
}

export interface PaymentTransaction {
  id: string;
  appointmentId: string;
  walkSessionId?: string;
  ownerId: string;
  walkerId: string;
  amount: number;
  tipAmount: number;
  totalAmount: number;
  serviceFee: number;
  netPayout: number;
  status: 'paid' | 'pending' | 'refunded';
  paymentMethod: 'card' | 'apple_pay' | 'google_pay' | 'bank_transfer';
  date: string;
  receiptNumber: string;
  cardLast4?: string;
}

export interface ChatMessage {
  id: string;
  appointmentId?: string;
  senderId: string;
  senderName: string;
  senderRole: Role;
  content: string;
  timestamp: string;
  photoUrl?: string;
  isAutomated?: boolean;
  read: boolean;
}

export interface Review {
  id: string;
  ownerId: string;
  ownerName: string;
  ownerAvatar: string;
  petName: string;
  walkerId: string;
  rating: number;
  date: string;
  comment: string;
  tags: string[];
  walkerResponse?: {
    date: string;
    text: string;
  };
}

export interface PushNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'visit' | 'payment' | 'message' | 'performance' | 'reminder';
  read: boolean;
  linkAction?: string;
}

export interface ReminderSettings {
  emailReminders: boolean;
  smsReminders: boolean;
  pushNotifications: boolean;
  reminderHoursBefore: number;
}
