import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, CornerDownLeft } from 'lucide-react';
import { NAV_ITEMS } from '../nav';

interface Props {
  open: boolean;
  onClose: () => void;
  allowedIds: string[];
}

const CommandPalette: React.FC<Props> = ({ open, onClose, allowedIds }) => {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = useMemo(() => {
    const items = NAV_ITEMS.filter((n) => allowedIds.includes('*') ? true : allowedIds.includes(n.id));
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((n) => n.label.toLowerCase().includes(q) || n.section.toLowerCase().includes(q));
  }, [query, allowedIds]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  if (!open) return null;

  const commit = (path: string) => {
    navigate(path);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && results[activeIndex]) {
      commit(results[activeIndex].path);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div
        className="glass-panel w-full max-w-xl overflow-hidden shadow-gold-lg"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
          <Search size={16} className="text-gold-500" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a command node..."
            className="flex-1 bg-transparent text-sm text-charcoal-500 outline-none placeholder-charcoal-600"
          />
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-charcoal-600">ESC</kbd>
        </div>
        <div className="scrollbar-gold max-h-80 overflow-y-auto p-2">
          {results.length === 0 && <p className="px-3 py-6 text-center text-sm text-charcoal-600">No matching nodes.</p>}
          {results.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => commit(item.path)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
                  idx === activeIndex ? 'bg-gold-500/10 text-gold-200' : 'text-charcoal-500'
                }`}
              >
                <Icon size={15} strokeWidth={1.75} />
                <span className="flex-1">{item.label}</span>
                <span className="label-mono">{item.section}</span>
                {idx === activeIndex && <CornerDownLeft size={13} className="text-gold-500" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
