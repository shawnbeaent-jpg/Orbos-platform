// BEA ENT. Command Hub — shared domain types

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  INDIE = 'INDIE',
  PRODUCER = 'PRODUCER',
  ARTIST = 'ARTIST',
  PR = 'PR',
  BOOKING_AGENT = 'BOOKING_AGENT',
  ASSISTANT = 'ASSISTANT',
  EDITOR = 'EDITOR',
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'BEA Master Control',
  [UserRole.MANAGER]: 'Manager',
  [UserRole.INDIE]: 'Indie Artist',
  [UserRole.PRODUCER]: 'Music Producer',
  [UserRole.ARTIST]: 'Artist',
  [UserRole.PR]: 'PR / Publicist',
  [UserRole.BOOKING_AGENT]: 'Booking Agent',
  [UserRole.ASSISTANT]: 'Assistant',
  [UserRole.EDITOR]: 'Editor',
};

export interface SessionUser {
  id: string;
  name: string;
  role: UserRole;
  avatarInitials: string;
  clearanceLevel: 1 | 2 | 3 | 4 | 5;
  email: string;
}

export type TaskStatus = 'Pending' | 'In Progress' | 'Completed' | 'Blocked';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Task {
  id: string;
  artistId: string;
  dayNumber: number;
  role: UserRole;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  date: string;
  notes?: string;
  aiTikTokCaption?: string;
  aiScript?: string;
}

export type BeatStatus = 'Pending' | 'Under Review' | 'Artist Hold' | 'Placed' | 'Passed';
export type ContractStatus = 'Draft' | 'Sent' | 'Signed' | 'Countersigned' | 'N/A';

export interface BeatSubmission {
  id: string;
  producerId: string;
  producerName: string;
  title: string;
  bpm: number;
  key: string;
  genre: string;
  visionArtists: string[];
  status: BeatStatus;
  submissionFeePaid: boolean;
  acceptedBy?: string;
  contractStatus: ContractStatus;
  releaseStatus: 'Unreleased' | 'Scheduled' | 'Released';
  submittedDate: string;
}

export type OutreachCategory = 'Playlist Curator' | 'Blog' | 'Radio Host' | 'Magazine' | 'DJ' | 'Promoter';
export type OutreachStatus = 'Identified' | 'Contacted' | 'Follow-up' | 'Secured' | 'Declined';

export interface OutreachContact {
  id: string;
  name: string;
  category: OutreachCategory;
  region: string;
  state: string;
  city: string;
  status: OutreachStatus;
  email: string;
  phone: string;
  notes?: string;
  lastContactDate?: string;
}

export type BookingType = 'Live Show' | 'Festival' | 'Private Event' | 'Radio Appearance' | 'TV/Press';
export type BookingStatus = 'Inquiry' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface Booking {
  id: string;
  artistId: string;
  type: BookingType;
  title: string;
  date: string;
  location: string;
  venueCapacity?: number;
  performanceFeeCents?: number;
  status: BookingStatus;
  contractStatus: ContractStatus;
  notes?: string;
}

export interface FlightLeg {
  id: string;
  artistId: string;
  flightCode: string;
  airline: string;
  departureGate: string;
  departure: string;
  arrival: string;
  confirmationCode: string;
  status: 'Scheduled' | 'Checked-in' | 'Boarding' | 'Departed' | 'Delayed';
}

export interface HotelStay {
  id: string;
  artistId: string;
  hotelName: string;
  city: string;
  checkIn: string;
  checkOut: string;
  confirmationCode: string;
  roomType: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

export interface GearItem {
  id: string;
  name: string;
  category: 'Instrument' | 'Audio' | 'Merch' | 'Wardrobe' | 'Tech';
  weightLbs: number;
  transportCategory: 'Checked' | 'Carry-on' | 'Freight' | 'Local Van';
  packed: boolean;
}

export type AssetCategory = 'Master' | 'Stem' | 'Artwork' | 'BTS Footage' | 'Promo Clip';

export interface MediaAsset {
  id: string;
  artistId: string;
  name: string;
  category: AssetCategory;
  fileType: string;
  sizeMb: number;
  uploadedDate: string;
  scheduledPlatform?: string;
  scheduledDate?: string;
  expiresAt?: string;
}

export interface RoyaltySplit {
  id: string;
  trackTitle: string;
  artistPct: number;
  producerPct: number;
  managerPct: number;
  labelPct: number;
}

export interface Invoice {
  id: string;
  client: string;
  amountCents: number;
  status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
  issuedDate: string;
  dueDate: string;
}

export interface Contract {
  id: string;
  templateType: 'Split Sheet' | 'Performance Agreement' | 'NDA' | 'Producer Beat License';
  title: string;
  status: ContractStatus;
  createdDate: string;
  variables: Record<string, string>;
}

export interface MarketCity {
  id: string;
  city: string;
  state: string;
  streamingDensity: number; // 0-100
  tourDemand: number; // 0-100
  weather: string;
  temperatureF: number;
  priority: 'High' | 'Medium' | 'Low';
}

export interface ChatChannel {
  id: string;
  name: string;
  category: 'Logistics' | 'Legal' | 'Creative' | 'General';
}

export interface ChatMessage {
  id: string;
  channelId: string;
  authorName: string;
  authorRole: UserRole;
  body: string;
  timestamp: string;
  mentions?: string[];
  fileShare?: string;
}

export interface Artist {
  id: string;
  name: string;
  genre: string;
  subscriptionTier: 'Hustler' | 'Mogul';
  managerId?: string;
  monthlyListeners: number;
  followerGrowthPct: number;
  bio: string;
  socials: { platform: string; handle: string; followers: number }[];
}

export interface NetworkingContact {
  id: string;
  name: string;
  org: string;
  category: 'Label' | 'Legal' | 'Promoter' | 'Photographer' | 'Videographer' | 'Distributor';
  region: string;
  state: string;
  city: string;
  status: 'Active' | 'Cold' | 'New';
  email: string;
  phone: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  result: 'ALLOWED' | 'BLOCKED';
  node: string;
}

export interface SystemLogLine {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  service: string;
}

export type RolloutGoal = 'Single' | 'EP' | 'Album' | 'Tour';
export type RolloutStrategy = 'Executive Infiltration' | 'Neural Viral Blitz' | 'Slow Burn Legacy' | 'Grassroots Ascension';

export interface CampaignBlueprint {
  id: string;
  artistId: string;
  title: string;
  goal: RolloutGoal;
  strategy: RolloutStrategy;
  phase: 'Awareness' | 'Engagement' | 'Conversion';
  progressPct: number;
  milestones: { id: string; label: string; done: boolean; dueDate: string }[];
}

export interface LyricalDNAResult {
  sentiment: 'Euphoric' | 'Melancholic' | 'Defiant' | 'Romantic' | 'Introspective' | 'Aggressive';
  narratives: string[];
  targetDemographic: string;
  keywordSuggestions: string[];
}

export interface IndieMilestone {
  id: string;
  stage: 'Pre-Release' | 'Release Week' | 'Post-Release' | 'Long-Tail Sync';
  label: string;
  done: boolean;
  description: string;
}
