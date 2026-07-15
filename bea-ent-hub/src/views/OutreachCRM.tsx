import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, Table, statusTone } from '../components/ui';
import { OutreachStatus } from '../types';

const STATUSES: OutreachStatus[] = ['Identified', 'Contacted', 'Follow-up', 'Secured', 'Declined'];

const OutreachCRM: React.FC = () => {
  const { outreach, updateOutreachStatus } = useApp();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [target, setTarget] = useState(outreach[0]?.id ?? '');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!subject.trim() || !message.trim() || !target) return;
    updateOutreachStatus(target, 'Contacted');
    setSent(true);
    setTimeout(() => setSent(false), 2200);
    setSubject('');
    setMessage('');
  };

  return (
    <div>
      <PageHeader
        eyebrow="PR Blaster & Mailing Matrix"
        title="Outreach CRM"
        description="Compose pitches to curators, blogs, and radio hosts, then track every outlet through the outreach funnel."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <SectionTitle sub="Personalize and send in one motion">
            <span className="inline-flex items-center gap-2"><Mail size={16} className="text-gold-400" /> Compose Pitch</span>
          </SectionTitle>
          <div className="space-y-3">
            <div>
              <p className="label-mono mb-1.5">Target Outlet</p>
              <select value={target} onChange={(e) => setTarget(e.target.value)} className="input-dark">
                {outreach.map((o) => <option key={o.id} value={o.id}>{o.name}</option>)}
              </select>
            </div>
            <div>
              <p className="label-mono mb-1.5">Subject</p>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className="input-dark" placeholder="New single premiere — exclusive?" />
            </div>
            <div>
              <p className="label-mono mb-1.5">Message</p>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} className="input-dark resize-none" placeholder="Hi team, sharing an exclusive first listen..." />
            </div>
            <button onClick={handleSend} className="btn-gold w-full">
              <Send size={14} /> {sent ? 'Pitch Sent!' : 'Send Pitch'}
            </button>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <SectionTitle sub="Blogs, radio hosts, curators, and magazine editors">Outreach Matrix</SectionTitle>
          <Table headers={['Outlet', 'Category', 'Location', 'Status', 'Last Contact']}>
            {outreach.map((o) => (
              <tr key={o.id}>
                <td className="px-4 py-3">
                  <p className="text-charcoal-500">{o.name}</p>
                  <p className="text-xs text-charcoal-600">{o.email}</p>
                </td>
                <td className="px-4 py-3 text-charcoal-500">{o.category}</td>
                <td className="px-4 py-3 text-xs text-charcoal-600">{o.city}, {o.state}</td>
                <td className="px-4 py-3">
                  <select
                    value={o.status}
                    onChange={(e) => updateOutreachStatus(o.id, e.target.value as OutreachStatus)}
                    className="rounded-md border border-white/10 bg-transparent px-2 py-1 text-xs text-charcoal-500"
                  >
                    {STATUSES.map((s) => <option key={s} value={s} className="bg-midnight-900">{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3"><Badge tone={statusTone(o.status)}>{o.lastContactDate ?? '—'}</Badge></td>
              </tr>
            ))}
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default OutreachCRM;
