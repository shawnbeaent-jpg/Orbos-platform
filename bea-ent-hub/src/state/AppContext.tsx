import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  Artist,
  AuditLogEntry,
  BankChecklistItem,
  BeatStatus,
  BeatSubmission,
  Booking,
  BookingStatus,
  CampaignBlueprint,
  ChatMessage,
  Contract,
  ContractSignature,
  FlightLeg,
  GearItem,
  HotelStay,
  IndieMilestone,
  Invoice,
  LegalEntityProfile,
  MarketCity,
  MediaAsset,
  NaicsCode,
  NetworkingContact,
  OutreachContact,
  OutreachStatus,
  RoyaltyOrg,
  RoyaltyRegStatus,
  RoyaltySplit,
  SessionUser,
  SubscriptionTierId,
  SystemLogLine,
  Task,
  TaskStatus,
  ThemeMode,
  UserRole,
} from '../types';
import {
  MOCK_ARTISTS,
  MOCK_ASSETS,
  MOCK_AUDIT_LOG,
  MOCK_BEATS,
  MOCK_BOOKINGS,
  MOCK_CAMPAIGNS,
  MOCK_CHANNELS,
  MOCK_CONTRACTS,
  MOCK_FLIGHTS,
  MOCK_GEAR,
  MOCK_HOTELS,
  MOCK_INDIE_MILESTONES,
  MOCK_INVOICES,
  MOCK_LEGAL_ENTITIES,
  MOCK_MARKETS,
  MOCK_MESSAGES,
  MOCK_NETWORKING,
  MOCK_OUTREACH,
  MOCK_SPLITS,
  MOCK_SYSTEM_LOGS,
  MOCK_TASKS,
  MOCK_USERS,
} from '../data/mockData';
import { ROYALTY_ORG_LINKS } from '../data/legalData';

interface AppState {
  currentUser: SessionUser | null;
  activeArtistId: string;
  artists: Artist[];
  tasks: Task[];
  beats: BeatSubmission[];
  outreach: OutreachContact[];
  networking: NetworkingContact[];
  bookings: Booking[];
  flights: FlightLeg[];
  hotels: HotelStay[];
  gear: GearItem[];
  assets: MediaAsset[];
  splits: RoyaltySplit[];
  invoices: Invoice[];
  contracts: Contract[];
  markets: MarketCity[];
  messages: ChatMessage[];
  auditLog: AuditLogEntry[];
  systemLogs: SystemLogLine[];
  indieMilestones: IndieMilestone[];
  campaigns: CampaignBlueprint[];
  commissionDefaultPct: number;
  theme: ThemeMode;
  users: SessionUser[];
  legalEntities: LegalEntityProfile[];
  signatures: ContractSignature[];
}

interface AppContextValue extends AppState {
  channels: typeof MOCK_CHANNELS;
  login: (userId: string) => void;
  logout: () => void;
  setActiveArtistId: (id: string) => void;
  toggleTheme: () => void;
  registerIndieUser: (input: {
    name: string;
    email: string;
    role: UserRole.INDIE | UserRole.PRODUCER;
    plan: SubscriptionTierId;
  }) => SessionUser;
  addSignature: (signature: ContractSignature) => void;
  ensureLegalEntity: (artistId: string, entityNameSeed: string) => void;
  updateLegalEntity: (artistId: string, patch: Partial<LegalEntityProfile>) => void;
  setNaicsCodes: (artistId: string, codes: NaicsCode[]) => void;
  generateOperatingAgreement: (artistId: string, text: string) => void;
  toggleBankChecklistItem: (artistId: string, itemId: string) => void;
  updateRoyaltyStatus: (artistId: string, org: RoyaltyOrg, status: RoyaltyRegStatus) => void;
  updateBeatAdminFeedback: (id: string, feedback: string) => void;
  placeBeatWithArtist: (id: string, artistName: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  addTask: (task: Task) => void;
  addBeatSubmission: (beat: BeatSubmission) => void;
  updateBeatStatus: (id: string, status: BeatStatus) => void;
  updateOutreachStatus: (id: string, status: OutreachStatus) => void;
  addOutreachContact: (contact: OutreachContact) => void;
  updateBookingStatus: (id: string, status: BookingStatus) => void;
  addBooking: (booking: Booking) => void;
  toggleGearPacked: (id: string) => void;
  addAsset: (asset: MediaAsset) => void;
  updateSplit: (id: string, split: Partial<RoyaltySplit>) => void;
  addInvoice: (invoice: Invoice) => void;
  addContract: (contract: Contract) => void;
  sendMessage: (message: ChatMessage) => void;
  logAudit: (entry: AuditLogEntry) => void;
  pushSystemLog: (line: SystemLogLine) => void;
  setCommissionDefaultPct: (pct: number) => void;
  addCampaign: (campaign: CampaignBlueprint) => void;
  toggleMilestone: (campaignId: string, milestoneId: string) => void;
  toggleIndieMilestone: (id: string) => void;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function buildDefaultLegalEntity(artistId: string, entityNameSeed: string): LegalEntityProfile {
  return {
    artistId,
    jurisdictionAbbr: null,
    entityName: `${entityNameSeed} LLC`,
    entityType: 'LLC',
    ein: '',
    articlesFiled: false,
    businessAddress: '',
    mailboxProvider: null,
    naicsCodes: [],
    operatingAgreementGenerated: false,
    operatingAgreementText: null,
    bankChecklist: [
      { id: uid('bank'), label: 'Approved Articles of Organization', done: false },
      { id: uid('bank'), label: 'EIN confirmation letter (CP 575)', done: false },
      { id: uid('bank'), label: 'Signed Operating Agreement', done: false },
      { id: uid('bank'), label: 'Government-issued photo ID', done: false },
      { id: uid('bank'), label: 'Initial deposit funds', done: false },
    ],
    royaltyRegistrations: (Object.keys(ROYALTY_ORG_LINKS) as RoyaltyOrg[]).map((org) => ({
      org,
      status: 'Not Started' as const,
      url: ROYALTY_ORG_LINKS[org].url,
      note: ROYALTY_ORG_LINKS[org].note,
    })),
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<SessionUser | null>(null);
  const [activeArtistId, setActiveArtistId] = useState<string>(MOCK_ARTISTS[0].id);
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [beats, setBeats] = useState<BeatSubmission[]>(MOCK_BEATS);
  const [outreach, setOutreach] = useState<OutreachContact[]>(MOCK_OUTREACH);
  const [networking] = useState<NetworkingContact[]>(MOCK_NETWORKING);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [flights] = useState<FlightLeg[]>(MOCK_FLIGHTS);
  const [hotels] = useState<HotelStay[]>(MOCK_HOTELS);
  const [gear, setGear] = useState<GearItem[]>(MOCK_GEAR);
  const [assets, setAssets] = useState<MediaAsset[]>(MOCK_ASSETS);
  const [splits, setSplits] = useState<RoyaltySplit[]>(MOCK_SPLITS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);
  const [contracts, setContracts] = useState<Contract[]>(MOCK_CONTRACTS);
  const [markets] = useState<MarketCity[]>(MOCK_MARKETS);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(MOCK_AUDIT_LOG);
  const [systemLogs, setSystemLogs] = useState<SystemLogLine[]>(MOCK_SYSTEM_LOGS);
  const [indieMilestones, setIndieMilestones] = useState<IndieMilestone[]>(MOCK_INDIE_MILESTONES);
  const [campaigns, setCampaigns] = useState<CampaignBlueprint[]>(MOCK_CAMPAIGNS);
  const [commissionDefaultPct, setCommissionDefaultPct] = useState(18);
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [users, setUsers] = useState<SessionUser[]>(MOCK_USERS);
  const [legalEntities, setLegalEntities] = useState<LegalEntityProfile[]>(MOCK_LEGAL_ENTITIES);
  const [signatures, setSignatures] = useState<ContractSignature[]>([]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const login = useCallback((userId: string) => {
    const user = users.find((u) => u.id === userId) ?? null;
    setCurrentUser(user);
    if (user) {
      setAuditLog((prev) => [
        { id: uid('al'), timestamp: new Date().toISOString(), actor: user.name, role: user.role, action: 'Session authenticated', result: 'ALLOWED', node: 'auth.session' },
        ...prev,
      ]);
    }
  }, [users]);

  const logout = useCallback(() => setCurrentUser(null), []);

  const registerIndieUser = useCallback(
    (input: { name: string; email: string; role: UserRole.INDIE | UserRole.PRODUCER; plan: SubscriptionTierId }) => {
      const newUser: SessionUser = {
        id: uid('u'),
        name: input.name,
        role: input.role,
        avatarInitials: input.name
          .split(' ')
          .map((p) => p[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        clearanceLevel: input.role === UserRole.INDIE ? 2 : 2,
        email: input.email,
        subscriptionTier: input.plan,
      };
      setUsers((prev) => [...prev, newUser]);

      if (input.role === UserRole.INDIE) {
        const newArtist: Artist = {
          id: uid('artist'),
          name: input.name,
          genre: 'Unspecified',
          subscriptionTier: input.plan,
          monthlyListeners: 0,
          followerGrowthPct: 0,
          bio: `${input.name} — newly registered independent artist.`,
          socials: [],
        };
        setArtists((prev) => [...prev, newArtist]);
        setLegalEntities((prev) => [...prev, buildDefaultLegalEntity(newArtist.id, input.name)]);
        setActiveArtistId(newArtist.id);
      }

      setAuditLog((prev) => [
        {
          id: uid('al'),
          timestamp: new Date().toISOString(),
          actor: newUser.name,
          role: newUser.role,
          action: `Independent Mode registration completed — ${input.plan} plan`,
          result: 'ALLOWED',
          node: 'auth.registration',
        },
        ...prev,
      ]);
      setCurrentUser(newUser);
      return newUser;
    },
    [],
  );

  const addSignature = useCallback((signature: ContractSignature) => setSignatures((prev) => [signature, ...prev]), []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
  }, []);

  const addTask = useCallback((task: Task) => setTasks((prev) => [task, ...prev]), []);

  const addBeatSubmission = useCallback((beat: BeatSubmission) => setBeats((prev) => [beat, ...prev]), []);

  const updateBeatStatus = useCallback((id: string, status: BeatStatus) => {
    setBeats((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }, []);

  const updateBeatAdminFeedback = useCallback((id: string, feedback: string) => {
    setBeats((prev) => prev.map((b) => (b.id === id ? { ...b, adminFeedback: feedback } : b)));
  }, []);

  const placeBeatWithArtist = useCallback((id: string, artistName: string) => {
    setBeats((prev) => {
      const beat = prev.find((b) => b.id === id);
      if (beat) {
        setContracts((prevContracts) => [
          {
            id: uid('c'),
            templateType: 'Producer Beat License',
            title: `${beat.title} — Beat License (${artistName})`,
            status: 'Draft',
            createdDate: new Date().toISOString().slice(0, 10),
            variables: { producer: beat.producerName, artist: artistName, track: beat.title },
          },
          ...prevContracts,
        ]);
      }
      return prev.map((b) => (b.id === id ? { ...b, status: 'Placed', acceptedBy: artistName, contractStatus: 'Draft' } : b));
    });
  }, []);

  const ensureLegalEntity = useCallback((artistId: string, entityNameSeed: string) => {
    setLegalEntities((prev) => (prev.some((e) => e.artistId === artistId) ? prev : [...prev, buildDefaultLegalEntity(artistId, entityNameSeed)]));
  }, []);

  const updateLegalEntity = useCallback((artistId: string, patch: Partial<LegalEntityProfile>) => {
    setLegalEntities((prev) => prev.map((e) => (e.artistId === artistId ? { ...e, ...patch } : e)));
  }, []);

  const setNaicsCodes = useCallback((artistId: string, codes: NaicsCode[]) => {
    setLegalEntities((prev) => prev.map((e) => (e.artistId === artistId ? { ...e, naicsCodes: codes } : e)));
  }, []);

  const generateOperatingAgreement = useCallback((artistId: string, text: string) => {
    setLegalEntities((prev) =>
      prev.map((e) => (e.artistId === artistId ? { ...e, operatingAgreementGenerated: true, operatingAgreementText: text } : e)),
    );
  }, []);

  const toggleBankChecklistItem = useCallback((artistId: string, itemId: string) => {
    setLegalEntities((prev) =>
      prev.map((e) =>
        e.artistId === artistId
          ? { ...e, bankChecklist: e.bankChecklist.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) }
          : e,
      ),
    );
  }, []);

  const updateRoyaltyStatus = useCallback((artistId: string, org: RoyaltyOrg, status: RoyaltyRegStatus) => {
    setLegalEntities((prev) =>
      prev.map((e) =>
        e.artistId === artistId
          ? { ...e, royaltyRegistrations: e.royaltyRegistrations.map((r) => (r.org === org ? { ...r, status } : r)) }
          : e,
      ),
    );
  }, []);

  const updateOutreachStatus = useCallback((id: string, status: OutreachStatus) => {
    setOutreach((prev) => prev.map((o) => (o.id === id ? { ...o, status, lastContactDate: new Date().toISOString().slice(0, 10) } : o)));
  }, []);

  const addOutreachContact = useCallback((contact: OutreachContact) => setOutreach((prev) => [contact, ...prev]), []);

  const updateBookingStatus = useCallback((id: string, status: BookingStatus) => {
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  }, []);

  const addBooking = useCallback((booking: Booking) => setBookings((prev) => [booking, ...prev]), []);

  const toggleGearPacked = useCallback((id: string) => {
    setGear((prev) => prev.map((g) => (g.id === id ? { ...g, packed: !g.packed } : g)));
  }, []);

  const addAsset = useCallback((asset: MediaAsset) => setAssets((prev) => [asset, ...prev]), []);

  const updateSplit = useCallback((id: string, split: Partial<RoyaltySplit>) => {
    setSplits((prev) => prev.map((s) => (s.id === id ? { ...s, ...split } : s)));
  }, []);

  const addInvoice = useCallback((invoice: Invoice) => setInvoices((prev) => [invoice, ...prev]), []);

  const addContract = useCallback((contract: Contract) => setContracts((prev) => [contract, ...prev]), []);

  const sendMessage = useCallback((message: ChatMessage) => setMessages((prev) => [...prev, message]), []);

  const logAudit = useCallback((entry: AuditLogEntry) => setAuditLog((prev) => [entry, ...prev]), []);

  const pushSystemLog = useCallback((line: SystemLogLine) => setSystemLogs((prev) => [line, ...prev].slice(0, 200)), []);

  const addCampaign = useCallback((campaign: CampaignBlueprint) => setCampaigns((prev) => [campaign, ...prev]), []);

  const toggleMilestone = useCallback((campaignId: string, milestoneId: string) => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              milestones: c.milestones.map((m) => (m.id === milestoneId ? { ...m, done: !m.done } : m)),
            }
          : c,
      ),
    );
  }, []);

  const toggleIndieMilestone = useCallback((id: string) => {
    setIndieMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, done: !m.done } : m)));
  }, []);

  const value = useMemo<AppContextValue>(
    () => ({
      currentUser,
      activeArtistId,
      artists,
      tasks,
      beats,
      outreach,
      networking,
      bookings,
      flights,
      hotels,
      gear,
      assets,
      splits,
      invoices,
      contracts,
      markets,
      messages,
      auditLog,
      systemLogs,
      indieMilestones,
      campaigns,
      commissionDefaultPct,
      theme,
      users,
      legalEntities,
      signatures,
      channels: MOCK_CHANNELS,
      login,
      logout,
      setActiveArtistId,
      toggleTheme,
      registerIndieUser,
      addSignature,
      ensureLegalEntity,
      updateLegalEntity,
      setNaicsCodes,
      generateOperatingAgreement,
      toggleBankChecklistItem,
      updateRoyaltyStatus,
      updateBeatAdminFeedback,
      placeBeatWithArtist,
      updateTaskStatus,
      addTask,
      addBeatSubmission,
      updateBeatStatus,
      updateOutreachStatus,
      addOutreachContact,
      updateBookingStatus,
      addBooking,
      toggleGearPacked,
      addAsset,
      updateSplit,
      addInvoice,
      addContract,
      sendMessage,
      logAudit,
      pushSystemLog,
      setCommissionDefaultPct,
      addCampaign,
      toggleMilestone,
      toggleIndieMilestone,
    }),
    [
      currentUser,
      activeArtistId,
      artists,
      tasks,
      beats,
      outreach,
      networking,
      bookings,
      flights,
      hotels,
      gear,
      assets,
      splits,
      invoices,
      contracts,
      markets,
      messages,
      auditLog,
      systemLogs,
      indieMilestones,
      campaigns,
      commissionDefaultPct,
      theme,
      users,
      legalEntities,
      signatures,
      login,
      logout,
      toggleTheme,
      registerIndieUser,
      addSignature,
      ensureLegalEntity,
      updateLegalEntity,
      setNaicsCodes,
      generateOperatingAgreement,
      toggleBankChecklistItem,
      updateRoyaltyStatus,
      updateBeatAdminFeedback,
      placeBeatWithArtist,
      updateTaskStatus,
      addTask,
      addBeatSubmission,
      updateBeatStatus,
      updateOutreachStatus,
      addOutreachContact,
      updateBookingStatus,
      addBooking,
      toggleGearPacked,
      addAsset,
      updateSplit,
      addInvoice,
      addContract,
      sendMessage,
      logAudit,
      pushSystemLog,
      addCampaign,
      toggleMilestone,
      toggleIndieMilestone,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export function useCurrentArtist(): Artist | undefined {
  const { artists, activeArtistId } = useApp();
  return artists.find((a) => a.id === activeArtistId);
}

export const ALL_USERS = MOCK_USERS;
export const ROLE_NAV_ACCESS: Record<UserRole, string[]> = {
  [UserRole.ADMIN]: ['*'],
  [UserRole.MANAGER]: ['*'],
  [UserRole.INDIE]: ['dashboard', 'indie-roadmap', 'campaign-architect', 'artist-vault', 'financials', 'legal', 'markets', 'chat', 'profile'],
  [UserRole.PRODUCER]: ['dashboard', 'producer-console', 'financials', 'legal', 'chat', 'profile'],
  [UserRole.ARTIST]: ['dashboard', 'campaign-architect', 'artist-vault', 'logistics', 'bookings', 'financials', 'chat', 'profile'],
  [UserRole.PR]: ['dashboard', 'outreach-crm', 'networking', 'campaign-architect', 'chat', 'profile'],
  [UserRole.BOOKING_AGENT]: ['dashboard', 'bookings', 'logistics', 'legal', 'chat', 'profile'],
  [UserRole.ASSISTANT]: ['dashboard', 'artist-vault', 'logistics', 'chat', 'profile'],
  [UserRole.EDITOR]: ['dashboard', 'artist-vault', 'chat', 'profile'],
};
