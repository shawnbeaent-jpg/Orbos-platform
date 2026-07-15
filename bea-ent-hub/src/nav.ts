import {
  LayoutDashboard,
  Sparkles,
  Map,
  Disc3,
  Mail,
  Users,
  CalendarClock,
  Plane,
  Archive,
  Wallet,
  Scale,
  Globe2,
  MessageSquare,
  UserCircle,
  Settings,
  Crown,
  ShieldAlert,
  Terminal,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  section: 'Command' | 'Growth' | 'Operations' | 'Business' | 'System';
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Command Hub', path: '/app/dashboard', icon: LayoutDashboard, section: 'Command' },
  { id: 'campaign-architect', label: 'Campaign Architect', path: '/app/campaign-architect', icon: Sparkles, section: 'Growth' },
  { id: 'indie-roadmap', label: 'Indie Roadmap', path: '/app/indie-roadmap', icon: Map, section: 'Growth' },
  { id: 'producer-console', label: 'Producer Console', path: '/app/producer-console', icon: Disc3, section: 'Growth' },
  { id: 'outreach-crm', label: 'Outreach CRM', path: '/app/outreach-crm', icon: Mail, section: 'Growth' },
  { id: 'networking', label: 'Industry Rolodex', path: '/app/networking', icon: Users, section: 'Growth' },
  { id: 'bookings', label: 'Bookings & Gigs', path: '/app/bookings', icon: CalendarClock, section: 'Operations' },
  { id: 'logistics', label: 'Tour Logistics', path: '/app/logistics', icon: Plane, section: 'Operations' },
  { id: 'artist-vault', label: 'Artist Vault', path: '/app/artist-vault', icon: Archive, section: 'Operations' },
  { id: 'financials', label: 'Financials', path: '/app/financials', icon: Wallet, section: 'Business' },
  { id: 'legal', label: 'Legal Foundation', path: '/app/legal', icon: Scale, section: 'Business' },
  { id: 'markets', label: 'Market Intel', path: '/app/markets', icon: Globe2, section: 'Business' },
  { id: 'chat', label: 'Secure Comms', path: '/app/chat', icon: MessageSquare, section: 'Business' },
  { id: 'profile', label: 'Identity Card', path: '/app/profile', icon: UserCircle, section: 'System' },
  { id: 'manager-settings', label: 'Manager Settings', path: '/app/manager-settings', icon: Settings, section: 'System' },
  { id: 'subscription-vault', label: 'Subscription Vault', path: '/app/subscription-vault', icon: Crown, section: 'System' },
  { id: 'admin-backend', label: 'Master Security Ledger', path: '/app/admin-backend', icon: ShieldAlert, section: 'System' },
  { id: 'system-debugger', label: 'System Debugger', path: '/app/system-debugger', icon: Terminal, section: 'System' },
];
