import React, { useState } from 'react';
import { Hash, Send, Paperclip } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { PageHeader } from '../components/ui';

const ChatView: React.FC = () => {
  const { channels, messages, sendMessage, currentUser } = useApp();
  const [activeChannel, setActiveChannel] = useState(channels[0].id);
  const [draft, setDraft] = useState('');

  const channelMessages = messages.filter((m) => m.channelId === activeChannel);

  const handleSend = () => {
    if (!draft.trim() || !currentUser) return;
    const mentions = Array.from(draft.matchAll(/@(\w+(?:\s\w+)?)/g)).map((m) => m[1]);
    sendMessage({
      id: `msg-${Date.now()}`,
      channelId: activeChannel,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      body: draft.trim(),
      timestamp: new Date().toISOString(),
      mentions: mentions.length ? mentions : undefined,
    });
    setDraft('');
  };

  return (
    <div>
      <PageHeader eyebrow="Neural Secure Comms" title="Secure Channels" description="Inter-label messaging across logistics, legal, and creative sub-teams." />

      <div className="glass-panel flex h-[calc(100vh-260px)] overflow-hidden">
        <div className="w-56 shrink-0 border-r border-white/5 p-3">
          <p className="label-mono mb-2 px-2">Channels</p>
          {channels.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveChannel(c.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${activeChannel === c.id ? 'bg-gold-500/10 text-gold-200' : 'text-charcoal-500 hover:bg-white/[0.03]'}`}
            >
              <Hash size={14} /> {c.name}
            </button>
          ))}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="scrollbar-gold flex-1 space-y-4 overflow-y-auto p-5">
            {channelMessages.map((m) => (
              <div key={m.id} className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-500/15 font-mono text-xs text-gold-200">
                  {m.authorName.split(' ').map((p) => p[0]).join('')}
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-2">
                    <p className="text-sm font-medium text-charcoal-500">{m.authorName}</p>
                    <p className="label-mono">{new Date(m.timestamp).toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-charcoal-500">{m.body}</p>
                  {m.fileShare && (
                    <p className="mt-1 inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 text-xs text-gold-300">
                      <Paperclip size={11} /> {m.fileShare}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {channelMessages.length === 0 && <p className="text-center text-sm text-charcoal-600">No messages in this channel yet.</p>}
          </div>
          <div className="flex items-center gap-2 border-t border-white/5 p-4">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Message #${channels.find((c) => c.id === activeChannel)?.name}`}
              className="input-dark"
            />
            <button onClick={handleSend} className="btn-gold shrink-0"><Send size={14} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatView;
