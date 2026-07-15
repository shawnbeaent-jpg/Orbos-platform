import React, { useEffect, useMemo, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Command, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { NAV_ITEMS } from '../nav';
import { ROLE_NAV_ACCESS, useApp } from '../state/AppContext';
import { ROLE_LABELS } from '../types';
import CommandPalette from './CommandPalette';

const SECTION_ORDER: NavItemSection[] = ['Command', 'Growth', 'Operations', 'Business', 'System'];
type NavItemSection = 'Command' | 'Growth' | 'Operations' | 'Business' | 'System';

const Layout: React.FC = () => {
  const { currentUser, logout, artists, activeArtistId, setActiveArtistId } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [flashBanner, setFlashBanner] = useState(false);

  const allowedIds = useMemo(() => {
    if (!currentUser) return [];
    const access = ROLE_NAV_ACCESS[currentUser.role];
    return access.includes('*') ? NAV_ITEMS.map((n) => n.id) : access;
  }, [currentUser]);

  const visibleNav = useMemo(() => NAV_ITEMS.filter((item) => allowedIds.includes(item.id)), [allowedIds]);
  const canSwitchArtist = currentUser?.role === 'MANAGER' || currentUser?.role === 'ADMIN';

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role !== 'MANAGER' && currentUser.role !== 'ADMIN') {
      setFlashBanner(true);
      const t = setTimeout(() => setFlashBanner(false), 2600);
      return () => clearTimeout(t);
    }
  }, [location.pathname, currentUser]);

  if (!currentUser) return null;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-midnight-950 bg-radial-glow text-charcoal-500">
      <aside className="flex w-72 shrink-0 flex-col border-r border-white/5 bg-midnight-900/70 backdrop-blur-2xl">
        <div className="flex items-center gap-3 border-b border-white/5 px-6 py-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-gold-500/40 bg-gradient-to-br from-gold-400/20 to-transparent">
            <span className="font-serif text-lg text-gold-300">B</span>
          </div>
          <div>
            <p className="font-serif text-lg leading-none text-gold-100">BEA ENT.</p>
            <p className="label-mono mt-1">Command Hub</p>
          </div>
        </div>

        <nav className="scrollbar-gold flex-1 space-y-6 overflow-y-auto px-4 py-6">
          {SECTION_ORDER.map((section) => {
            const items = visibleNav.filter((i) => i.section === section);
            if (items.length === 0) return null;
            return (
              <div key={section}>
                <p className="label-mono mb-2 px-2">{section}</p>
                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.id}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                            isActive
                              ? 'border border-gold-500/30 bg-gold-500/10 text-gold-200 shadow-gold'
                              : 'border border-transparent text-charcoal-500 hover:border-white/10 hover:bg-white/[0.03] hover:text-gold-200'
                          }`
                        }
                      >
                        <Icon size={16} strokeWidth={1.75} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="border-t border-white/5 px-4 py-4">
          <div className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20 font-mono text-xs text-gold-200">
              {currentUser.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-charcoal-500">{currentUser.name}</p>
              <p className="label-mono truncate">{ROLE_LABELS[currentUser.role]}</p>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="text-charcoal-600 transition hover:text-gold-300"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-white/5 bg-midnight-950/80 px-8 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            <ShieldCheck size={16} className="text-gold-500" />
            <span className="label-mono">clearance level {currentUser.clearanceLevel} / 5</span>
          </div>

          <div className="flex items-center gap-3">
            {canSwitchArtist && (
              <div className="relative">
                <select
                  value={activeArtistId}
                  onChange={(e) => setActiveArtistId(e.target.value)}
                  className="input-dark appearance-none py-1.5 pr-8 text-xs font-medium"
                >
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      Active Artist: {a.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gold-500/60" />
              </div>
            )}
            <button onClick={() => setPaletteOpen(true)} className="btn-ghost text-xs">
              <Command size={14} />
              <span>Universal Command</span>
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>
          </div>
        </header>

        {flashBanner && (
          <div className="animate-pulse-gold flex items-center gap-2 border-b border-gold-500/30 bg-gold-500/10 px-8 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-gold-300">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
            Encrypted data node active — session monitored under clearance level {currentUser.clearanceLevel}
          </div>
        )}

        <main className="scrollbar-gold flex-1 overflow-y-auto px-8 py-8">
          <Outlet />
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} allowedIds={allowedIds} />
    </div>
  );
};

export default Layout;
