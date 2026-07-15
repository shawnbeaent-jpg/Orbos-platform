import {
  Artist,
  AuditLogEntry,
  Booking,
  CampaignBlueprint,
  ChatChannel,
  ChatMessage,
  Contract,
  FlightLeg,
  GearItem,
  HotelStay,
  IndieMilestone,
  Invoice,
  MarketCity,
  MediaAsset,
  NetworkingContact,
  OutreachContact,
  RoyaltySplit,
  SessionUser,
  SystemLogLine,
  Task,
  UserRole,
  BeatSubmission,
} from '../types';

export const MOCK_USERS: SessionUser[] = [
  { id: 'u-admin', name: 'Jordan Vale', role: UserRole.ADMIN, avatarInitials: 'JV', clearanceLevel: 5, email: 'jordan.vale@beaent.io' },
  { id: 'u-manager', name: 'Jason Oliver', role: UserRole.MANAGER, avatarInitials: 'JO', clearanceLevel: 4, email: 'jason.oliver@beaent.io' },
  { id: 'u-indie', name: 'Nova Sinclair', role: UserRole.INDIE, avatarInitials: 'NS', clearanceLevel: 2, email: 'nova@beaent.io' },
  { id: 'u-producer', name: 'Marcus "Kilowatt" Reed', role: UserRole.PRODUCER, avatarInitials: 'MR', clearanceLevel: 2, email: 'kilowatt@beaent.io' },
  { id: 'u-artist', name: 'Ari Monroe', role: UserRole.ARTIST, avatarInitials: 'AM', clearanceLevel: 1, email: 'ari.monroe@beaent.io' },
  { id: 'u-pr', name: 'Simone Duke', role: UserRole.PR, avatarInitials: 'SD', clearanceLevel: 3, email: 'simone.duke@beaent.io' },
  { id: 'u-booking', name: 'Trey Holloway', role: UserRole.BOOKING_AGENT, avatarInitials: 'TH', clearanceLevel: 3, email: 'trey@beaent.io' },
  { id: 'u-assistant', name: 'Casey Lin', role: UserRole.ASSISTANT, avatarInitials: 'CL', clearanceLevel: 1, email: 'casey.lin@beaent.io' },
  { id: 'u-editor', name: 'Priya Nandan', role: UserRole.EDITOR, avatarInitials: 'PN', clearanceLevel: 1, email: 'priya@beaent.io' },
];

export const MOCK_ARTISTS: Artist[] = [
  {
    id: 'artist-ari-monroe',
    name: 'Ari Monroe',
    genre: 'Alt R&B',
    subscriptionTier: 'Mogul',
    managerId: 'u-manager',
    monthlyListeners: 184_320,
    followerGrowthPct: 12.4,
    bio: 'Atlanta-born alt R&B vocalist blending analog synths with confessional songwriting.',
    socials: [
      { platform: 'Instagram', handle: '@arimonroe', followers: 96_400 },
      { platform: 'TikTok', handle: '@ari.monroe', followers: 211_000 },
      { platform: 'Spotify', handle: 'Ari Monroe', followers: 71_200 },
    ],
  },
  {
    id: 'artist-nova-sinclair',
    name: 'Nova Sinclair',
    genre: 'Indie Pop',
    subscriptionTier: 'Hustler',
    monthlyListeners: 42_150,
    followerGrowthPct: 22.8,
    bio: 'DIY bedroom-pop artist self-releasing every project since 2022.',
    socials: [
      { platform: 'Instagram', handle: '@novasinclairmusic', followers: 18_900 },
      { platform: 'TikTok', handle: '@novasings', followers: 54_300 },
    ],
  },
  {
    id: 'artist-dex-larue',
    name: 'Dex LaRue',
    genre: 'Trap / Hip-Hop',
    subscriptionTier: 'Mogul',
    managerId: 'u-manager',
    monthlyListeners: 310_900,
    followerGrowthPct: 8.1,
    bio: 'Southern trap artist with three regional hits and a growing sync licensing catalog.',
    socials: [
      { platform: 'Instagram', handle: '@dexlarue', followers: 142_000 },
      { platform: 'YouTube', handle: 'Dex LaRue', followers: 88_600 },
    ],
  },
];

export const MOCK_TASKS: Task[] = [
  { id: 't-1', artistId: 'artist-ari-monroe', dayNumber: 3, role: UserRole.PR, description: 'Send press kit to Atlanta blog network', status: 'Completed', priority: 'High', date: '2026-07-01', notes: 'Confirmed receipt from 4/6 outlets.' },
  { id: 't-2', artistId: 'artist-ari-monroe', dayNumber: 5, role: UserRole.MANAGER, description: 'Finalize single artwork approval', status: 'In Progress', priority: 'Critical', date: '2026-07-10' },
  { id: 't-3', artistId: 'artist-dex-larue', dayNumber: 1, role: UserRole.BOOKING_AGENT, description: 'Lock venue for Sept regional run', status: 'Pending', priority: 'Medium', date: '2026-07-14' },
  { id: 't-4', artistId: 'artist-nova-sinclair', dayNumber: 7, role: UserRole.INDIE, description: 'Submit to 12 curated playlists', status: 'Pending', priority: 'High', date: '2026-07-16', aiTikTokCaption: 'pov: you wrote this at 2am and it might be the one 🎹✨' },
  { id: 't-5', artistId: 'artist-dex-larue', dayNumber: 2, role: UserRole.EDITOR, description: 'Cut 3 vertical teaser clips from studio session', status: 'Blocked', priority: 'Medium', date: '2026-07-12', notes: 'Waiting on raw footage upload.' },
  { id: 't-6', artistId: 'artist-ari-monroe', dayNumber: 10, role: UserRole.ASSISTANT, description: 'Coordinate wardrobe fitting before shoot', status: 'Pending', priority: 'Low', date: '2026-07-20' },
];

export const MOCK_BEATS: BeatSubmission[] = [
  { id: 'b-1', producerId: 'u-producer', producerName: 'Marcus "Kilowatt" Reed', title: 'Midnight Ledger', bpm: 142, key: 'F# Minor', genre: 'Trap', visionArtists: ['Dex LaRue', 'Ari Monroe'], status: 'Under Review', submissionFeePaid: true, contractStatus: 'Draft', releaseStatus: 'Unreleased', submittedDate: '2026-06-20' },
  { id: 'b-2', producerId: 'u-producer', producerName: 'Marcus "Kilowatt" Reed', title: 'Glass Ceiling', bpm: 96, key: 'C Minor', genre: 'Alt R&B', visionArtists: ['Ari Monroe'], status: 'Placed', submissionFeePaid: true, acceptedBy: 'Ari Monroe', contractStatus: 'Countersigned', releaseStatus: 'Scheduled', submittedDate: '2026-05-02' },
  { id: 'b-3', producerId: 'u-producer', producerName: 'Marcus "Kilowatt" Reed', title: 'Static Bloom', bpm: 128, key: 'A Major', genre: 'Pop', visionArtists: ['Nova Sinclair'], status: 'Pending', submissionFeePaid: false, contractStatus: 'N/A', releaseStatus: 'Unreleased', submittedDate: '2026-07-05' },
  { id: 'b-4', producerId: 'u-producer', producerName: 'Marcus "Kilowatt" Reed', title: 'Concrete Halo', bpm: 150, key: 'D Minor', genre: 'Drill', visionArtists: ['Dex LaRue'], status: 'Artist Hold', submissionFeePaid: true, contractStatus: 'Sent', releaseStatus: 'Unreleased', submittedDate: '2026-06-28' },
];

export const MOCK_OUTREACH: OutreachContact[] = [
  { id: 'o-1', name: 'Late Night Frequencies', category: 'Playlist Curator', region: 'Southeast', state: 'GA', city: 'Atlanta', status: 'Secured', email: 'submit@latenightfreq.com', phone: '404-555-0110', lastContactDate: '2026-06-15' },
  { id: 'o-2', name: 'Underground Current Blog', category: 'Blog', region: 'Southeast', state: 'GA', city: 'Atlanta', status: 'Follow-up', email: 'editors@undergroundcurrent.com', phone: '404-555-0133', lastContactDate: '2026-07-02' },
  { id: 'o-3', name: 'DJ Reeves — Hot 107.9', category: 'Radio Host', region: 'Southeast', state: 'GA', city: 'Atlanta', status: 'Contacted', email: 'reeves@hot1079.fm', phone: '404-555-0166', lastContactDate: '2026-06-29' },
  { id: 'o-4', name: 'Wax & Wire Magazine', category: 'Magazine', region: 'Northeast', state: 'NY', city: 'Brooklyn', status: 'Identified', email: 'pitches@waxandwire.com', phone: '718-555-0144' },
  { id: 'o-5', name: 'Selecta Nova', category: 'DJ', region: 'West', state: 'CA', city: 'Los Angeles', status: 'Secured', email: 'bookings@selectanova.com', phone: '213-555-0177', lastContactDate: '2026-06-10' },
];

export const MOCK_NETWORKING: NetworkingContact[] = [
  { id: 'n-1', name: 'Dana Whitfield', org: 'Whitfield Legal Group', category: 'Legal', region: 'Southeast', state: 'GA', city: 'Atlanta', status: 'Active', email: 'dana@whitfieldlegal.com', phone: '404-555-0201' },
  { id: 'n-2', name: 'Corridor Sound Label', org: 'Corridor Sound', category: 'Label', region: 'Southeast', state: 'GA', city: 'Atlanta', status: 'Active', email: 'ar@corridorsound.com', phone: '404-555-0212' },
  { id: 'n-3', name: 'Marisol Cade', org: 'Cade Visuals', category: 'Photographer', region: 'Southeast', state: 'GA', city: 'Decatur', status: 'New', email: 'marisol@cadevisuals.com', phone: '678-555-0233' },
  { id: 'n-4', name: 'Big Room Promotions', org: 'Big Room Promotions', category: 'Promoter', region: 'Southeast', state: 'FL', city: 'Miami', status: 'Active', email: 'book@bigroompromo.com', phone: '305-555-0244' },
  { id: 'n-5', name: 'Reel Motion Studio', org: 'Reel Motion', category: 'Videographer', region: 'Southeast', state: 'GA', city: 'Atlanta', status: 'Cold', email: 'hello@reelmotion.studio', phone: '404-555-0255' },
];

export const MOCK_BOOKINGS: Booking[] = [
  { id: 'bk-1', artistId: 'artist-dex-larue', type: 'Live Show', title: 'Trap House Live — Regional Run', date: '2026-09-12', location: 'The Masquerade, Atlanta GA', venueCapacity: 1000, performanceFeeCents: 850_000, status: 'Confirmed', contractStatus: 'Countersigned' },
  { id: 'bk-2', artistId: 'artist-ari-monroe', type: 'Festival', title: 'Peach Sound Festival', date: '2026-08-22', location: 'Piedmont Park, Atlanta GA', venueCapacity: 8000, performanceFeeCents: 2_200_000, status: 'Confirmed', contractStatus: 'Signed' },
  { id: 'bk-3', artistId: 'artist-nova-sinclair', type: 'Private Event', title: 'Corporate Launch Set', date: '2026-07-30', location: 'Ponce City Market, Atlanta GA', performanceFeeCents: 150_000, status: 'Inquiry', contractStatus: 'Sent' },
  { id: 'bk-4', artistId: 'artist-dex-larue', type: 'TV/Press', title: 'Local Rise Interview Segment', date: '2026-07-18', location: 'WSB Studios, Atlanta GA', status: 'Confirmed', contractStatus: 'Signed' },
];

export const MOCK_FLIGHTS: FlightLeg[] = [
  { id: 'fl-1', artistId: 'artist-dex-larue', flightCode: 'DL 1147', airline: 'Delta', departureGate: 'B14', departure: '2026-09-11T14:20:00', arrival: '2026-09-11T15:55:00', confirmationCode: 'BEAX99', status: 'Scheduled' },
  { id: 'fl-2', artistId: 'artist-ari-monroe', flightCode: 'AA 622', airline: 'American', departureGate: 'C22', departure: '2026-08-21T09:10:00', arrival: '2026-08-21T10:40:00', confirmationCode: 'MOGUL77', status: 'Checked-in' },
];

export const MOCK_HOTELS: HotelStay[] = [
  { id: 'h-1', artistId: 'artist-dex-larue', hotelName: 'The Candler Hotel', city: 'Atlanta', checkIn: '2026-09-11', checkOut: '2026-09-13', confirmationCode: 'CNDLR-4482', roomType: 'Executive Suite', status: 'Confirmed' },
  { id: 'h-2', artistId: 'artist-ari-monroe', hotelName: 'Kimpton Overland', city: 'Atlanta', checkIn: '2026-08-21', checkOut: '2026-08-23', confirmationCode: 'KMPT-9012', roomType: 'King Deluxe', status: 'Confirmed' },
];

export const MOCK_GEAR: GearItem[] = [
  { id: 'g-1', name: 'Shure Wireless Mic Set', category: 'Audio', weightLbs: 12, transportCategory: 'Carry-on', packed: true },
  { id: 'g-2', name: 'Stage Wardrobe Rack (3 looks)', category: 'Wardrobe', weightLbs: 34, transportCategory: 'Checked', packed: false },
  { id: 'g-3', name: 'Merch Box — Tour Tees', category: 'Merch', weightLbs: 58, transportCategory: 'Freight', packed: true },
  { id: 'g-4', name: 'MacBook + Ableton Rig', category: 'Tech', weightLbs: 9, transportCategory: 'Carry-on', packed: true },
];

export const MOCK_ASSETS: MediaAsset[] = [
  { id: 'a-1', artistId: 'artist-ari-monroe', name: 'Glass Ceiling — Master v3', category: 'Master', fileType: 'WAV', sizeMb: 84, uploadedDate: '2026-06-01' },
  { id: 'a-2', artistId: 'artist-ari-monroe', name: 'Glass Ceiling — Cover Art Final', category: 'Artwork', fileType: 'PNG', sizeMb: 12, uploadedDate: '2026-06-05', scheduledPlatform: 'Spotify Canvas', scheduledDate: '2026-08-01' },
  { id: 'a-3', artistId: 'artist-dex-larue', name: 'Concrete Halo — Stems Pack', category: 'Stem', fileType: 'ZIP', sizeMb: 640, uploadedDate: '2026-06-28' },
  { id: 'a-4', artistId: 'artist-dex-larue', name: 'Studio Session BTS Reel', category: 'BTS Footage', fileType: 'MP4', sizeMb: 420, uploadedDate: '2026-06-30', expiresAt: '2026-12-30' },
];

export const MOCK_SPLITS: RoyaltySplit[] = [
  { id: 's-1', trackTitle: 'Glass Ceiling', artistPct: 50, producerPct: 30, managerPct: 15, labelPct: 5 },
  { id: 's-2', trackTitle: 'Concrete Halo', artistPct: 55, producerPct: 25, managerPct: 15, labelPct: 5 },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'inv-1', client: 'Peach Sound Festival LLC', amountCents: 2_200_000, status: 'Sent', issuedDate: '2026-07-01', dueDate: '2026-08-15' },
  { id: 'inv-2', client: 'The Masquerade', amountCents: 850_000, status: 'Paid', issuedDate: '2026-06-01', dueDate: '2026-06-30' },
  { id: 'inv-3', client: 'Ponce City Market Events', amountCents: 150_000, status: 'Draft', issuedDate: '2026-07-14', dueDate: '2026-08-01' },
];

export const MOCK_CONTRACTS: Contract[] = [
  { id: 'c-1', templateType: 'Split Sheet', title: 'Glass Ceiling Split Sheet', status: 'Countersigned', createdDate: '2026-06-01', variables: { artist: 'Ari Monroe', producer: 'Marcus Reed', track: 'Glass Ceiling' } },
  { id: 'c-2', templateType: 'Performance Agreement', title: 'Peach Sound Festival Agreement', status: 'Signed', createdDate: '2026-06-20', variables: { artist: 'Ari Monroe', fee: '$22,000', date: '2026-08-22' } },
  { id: 'c-3', templateType: 'NDA', title: 'Studio Session NDA — Reel Motion', status: 'Sent', createdDate: '2026-07-02', variables: { party: 'Reel Motion Studio', date: '2026-07-10' } },
];

export const MOCK_MARKETS: MarketCity[] = [
  { id: 'm-1', city: 'Atlanta', state: 'GA', streamingDensity: 88, tourDemand: 92, weather: 'Clear', temperatureF: 89, priority: 'High' },
  { id: 'm-2', city: 'Miami', state: 'FL', streamingDensity: 74, tourDemand: 80, weather: 'Humid', temperatureF: 91, priority: 'High' },
  { id: 'm-3', city: 'Charlotte', state: 'NC', streamingDensity: 61, tourDemand: 58, weather: 'Partly Cloudy', temperatureF: 84, priority: 'Medium' },
  { id: 'm-4', city: 'Nashville', state: 'TN', streamingDensity: 69, tourDemand: 71, weather: 'Clear', temperatureF: 86, priority: 'Medium' },
  { id: 'm-5', city: 'Birmingham', state: 'AL', streamingDensity: 42, tourDemand: 39, weather: 'Storms', temperatureF: 88, priority: 'Low' },
];

export const MOCK_CHANNELS: ChatChannel[] = [
  { id: 'ch-1', name: 'logistics-hq', category: 'Logistics' },
  { id: 'ch-2', name: 'legal-desk', category: 'Legal' },
  { id: 'ch-3', name: 'creative-lab', category: 'Creative' },
  { id: 'ch-4', name: 'general', category: 'General' },
];

export const MOCK_MESSAGES: ChatMessage[] = [
  { id: 'msg-1', channelId: 'ch-1', authorName: 'Trey Holloway', authorRole: UserRole.BOOKING_AGENT, body: 'Venue confirmed for Sept run — sending routing map now.', timestamp: '2026-07-14T09:12:00', fileShare: 'routing_map_sept.pdf' },
  { id: 'msg-2', channelId: 'ch-1', authorName: 'Jason Oliver', authorRole: UserRole.MANAGER, body: '@Casey Lin can you confirm gear manifest against the freight quote?', timestamp: '2026-07-14T09:20:00', mentions: ['Casey Lin'] },
  { id: 'msg-3', channelId: 'ch-3', authorName: 'Priya Nandan', authorRole: UserRole.EDITOR, body: 'First cut of the BTS reel is up in the vault, notes welcome.', timestamp: '2026-07-13T18:44:00' },
  { id: 'msg-4', channelId: 'ch-2', authorName: 'Simone Duke', authorRole: UserRole.PR, body: 'NDA for Reel Motion is out for signature.', timestamp: '2026-07-10T11:02:00' },
];

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  { id: 'al-1', timestamp: '2026-07-15T08:02:11', actor: 'Casey Lin', role: UserRole.ASSISTANT, action: 'Attempted access: Financials > Royalty Ledger', result: 'BLOCKED', node: 'financials.royalty_ledger' },
  { id: 'al-2', timestamp: '2026-07-15T07:55:03', actor: 'Jason Oliver', role: UserRole.MANAGER, action: 'Updated commission default to 18%', result: 'ALLOWED', node: 'settings.commission_default' },
  { id: 'al-3', timestamp: '2026-07-14T22:41:52', actor: 'Marcus Reed', role: UserRole.PRODUCER, action: 'Attempted access: Admin > Subscription Ledger', result: 'BLOCKED', node: 'admin.subscription_ledger' },
  { id: 'al-4', timestamp: '2026-07-14T19:10:00', actor: 'Jordan Vale', role: UserRole.ADMIN, action: 'Overrode clearance for Priya Nandan (Editor, L1)', result: 'ALLOWED', node: 'admin.clearance_override' },
];

export const MOCK_SYSTEM_LOGS: SystemLogLine[] = [
  { id: 'sl-1', timestamp: '2026-07-15T09:00:00', level: 'INFO', service: 'auth-gateway', message: 'Session token refreshed for u-manager' },
  { id: 'sl-2', timestamp: '2026-07-15T08:58:12', level: 'WARN', service: 'asset-vault', message: 'Upload queue depth exceeded 40 items' },
  { id: 'sl-3', timestamp: '2026-07-15T08:40:00', level: 'ERROR', service: 'outreach-crm', message: 'Mail dispatch retry #3 for template pitch_v2' },
  { id: 'sl-4', timestamp: '2026-07-15T08:12:44', level: 'DEBUG', service: 'command-palette', message: 'Indexed 214 navigable nodes' },
  { id: 'sl-5', timestamp: '2026-07-15T07:30:00', level: 'INFO', service: 'financials', message: 'Nightly royalty projection batch completed' },
];

export const MOCK_CAMPAIGNS: CampaignBlueprint[] = [
  {
    id: 'camp-1',
    artistId: 'artist-ari-monroe',
    title: 'Glass Ceiling — Single Rollout',
    goal: 'Single',
    strategy: 'Executive Infiltration',
    phase: 'Engagement',
    progressPct: 62,
    milestones: [
      { id: 'ms-1', label: 'Press kit distributed', done: true, dueDate: '2026-07-01' },
      { id: 'ms-2', label: 'Playlist pitch batch sent', done: true, dueDate: '2026-07-08' },
      { id: 'ms-3', label: 'Radio add campaign', done: false, dueDate: '2026-07-25' },
      { id: 'ms-4', label: 'Release week content calendar locked', done: false, dueDate: '2026-07-30' },
    ],
  },
  {
    id: 'camp-2',
    artistId: 'artist-dex-larue',
    title: 'Concrete Halo — EP Rollout',
    goal: 'EP',
    strategy: 'Neural Viral Blitz',
    phase: 'Awareness',
    progressPct: 28,
    milestones: [
      { id: 'ms-5', label: 'Teaser clips cut', done: false, dueDate: '2026-07-20' },
      { id: 'ms-6', label: 'Influencer seeding wave 1', done: false, dueDate: '2026-07-28' },
    ],
  },
];

export const MOCK_INDIE_MILESTONES: IndieMilestone[] = [
  { id: 'im-1', stage: 'Pre-Release', label: 'Set up DistroKid / TuneCore account', done: true, description: 'Distribution pipeline ready for release day.' },
  { id: 'im-2', stage: 'Pre-Release', label: 'Register with a PRO (ASCAP/BMI)', done: true, description: 'Ensures royalty collection on airplay and streams.' },
  { id: 'im-3', stage: 'Release Week', label: 'Submit to Spotify for Artists playlist pitch', done: false, description: 'Pitch at least 7 days before release date.' },
  { id: 'im-4', stage: 'Release Week', label: 'Post release-day content across all platforms', done: false, description: 'Coordinated push across IG, TikTok, and YouTube Shorts.' },
  { id: 'im-5', stage: 'Post-Release', label: 'Pitch to independent playlist curators', done: false, description: 'Target 15-20 curators in your genre lane.' },
  { id: 'im-6', stage: 'Long-Tail Sync', label: 'Submit catalog to sync licensing libraries', done: false, description: 'Opens passive revenue from TV, film, and ads.' },
];
