import React, { useState } from 'react';
import { Terminal, Zap, RefreshCcw } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle } from '../components/ui';

const SERVICES = ['auth-gateway', 'asset-vault', 'outreach-crm', 'financials', 'command-palette'];

const LEVEL_TONE: Record<string, 'green' | 'amber' | 'red' | 'gray'> = {
  INFO: 'green',
  WARN: 'amber',
  ERROR: 'red',
  DEBUG: 'gray',
};

const SystemDebugger: React.FC = () => {
  const { systemLogs, pushSystemLog } = useApp();
  const [toggles, setToggles] = useState<Record<string, boolean>>(Object.fromEntries(SERVICES.map((s) => [s, true])));

  const generateError = () => {
    const service = SERVICES[Math.floor(Math.random() * SERVICES.length)];
    pushSystemLog({
      id: `sl-${Date.now()}`,
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      service,
      message: `Simulated fault injection — resilience test on ${service}`,
    });
  };

  const toggleService = (service: string) => setToggles({ ...toggles, [service]: !toggles[service] });

  return (
    <div>
      <PageHeader eyebrow="Diagnostic Control Console" title="System Debugger" description="Real-time system logs, connection health, and mock error generation for resilience testing." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <SectionTitle sub="Toggle mock connection health">
            <span className="inline-flex items-center gap-2"><Zap size={16} className="text-gold-400" /> API Health</span>
          </SectionTitle>
          <div className="space-y-2">
            {SERVICES.map((s) => (
              <button key={s} onClick={() => toggleService(s)} className="flex w-full items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-left text-sm transition hover:border-gold-500/30">
                <span className="font-mono text-xs text-charcoal-500">{s}</span>
                <Badge tone={toggles[s] ? 'green' : 'red'}>{toggles[s] ? 'ONLINE' : 'OFFLINE'}</Badge>
              </button>
            ))}
          </div>
          <button onClick={generateError} className="btn-ghost mt-4 w-full"><RefreshCcw size={13} /> Generate Mock Error</button>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle sub="Streaming diagnostic output">
            <span className="inline-flex items-center gap-2"><Terminal size={16} className="text-gold-400" /> Live System Log</span>
          </SectionTitle>
          <div className="scrollbar-gold max-h-[26rem] space-y-1.5 overflow-y-auto rounded-lg border border-white/5 bg-midnight-950/60 p-3 font-mono text-xs">
            {systemLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-2">
                <span className="shrink-0 text-charcoal-600">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <Badge tone={LEVEL_TONE[log.level]}>{log.level}</Badge>
                <span className="shrink-0 text-gold-500/70">[{log.service}]</span>
                <span className="text-charcoal-500">{log.message}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SystemDebugger;
