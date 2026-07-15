import React, { useState } from 'react';
import { Scale, FileText, Plus, Building2 } from 'lucide-react';
import { useApp } from '../state/AppContext';
import { Badge, Card, PageHeader, SectionTitle, Table, statusTone } from '../components/ui';
import { Contract } from '../types';
import LegalWizard from '../components/legal/LegalWizard';

const TEMPLATES: Contract['templateType'][] = ['Split Sheet', 'Performance Agreement', 'NDA', 'Producer Beat License'];

const TEMPLATE_FIELDS: Record<Contract['templateType'], string[]> = {
  'Split Sheet': ['Artist Name', 'Producer Name', 'Track Title'],
  'Performance Agreement': ['Artist Name', 'Fee', 'Event Date'],
  NDA: ['Party Name', 'Effective Date'],
  'Producer Beat License': ['Producer Name', 'Artist Name', 'License Fee'],
};

const LegalFoundationModule: React.FC = () => {
  const { contracts, addContract } = useApp();
  const [tab, setTab] = useState<'wizard' | 'templates'>('wizard');
  const [templateType, setTemplateType] = useState<Contract['templateType']>('Split Sheet');
  const [title, setTitle] = useState('');
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  const generate = () => {
    if (!title.trim()) return;
    addContract({
      id: `c-${Date.now()}`,
      templateType,
      title: title.trim(),
      status: 'Draft',
      createdDate: new Date().toISOString().slice(0, 10),
      variables: fieldValues,
    });
    setTitle('');
    setFieldValues({});
  };

  return (
    <div>
      <PageHeader
        eyebrow="Legal Foundation"
        title="Legal Foundation"
        description="Go from unregistered creator to fully incorporated, royalty-registered business — plus a library of ready-to-draft contracts."
      />

      <div className="mb-6 flex gap-2">
        <button onClick={() => setTab('wizard')} className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${tab === 'wizard' ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}>
          <Building2 size={12} className="mr-1.5 inline" /> Legal Foundation Wizard
        </button>
        <button onClick={() => setTab('templates')} className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${tab === 'templates' ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}>
          <FileText size={12} className="mr-1.5 inline" /> Contract Templates &amp; Library
        </button>
      </div>

      {tab === 'wizard' && <LegalWizard />}

      {tab === 'templates' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <SectionTitle sub="Select a blueprint and fill in the variables">
              <span className="inline-flex items-center gap-2"><FileText size={16} className="text-gold-400" /> Quick-Draft Generator</span>
            </SectionTitle>
            <div className="mb-3 flex flex-wrap gap-2">
              {TEMPLATES.map((t) => (
                <button key={t} onClick={() => setTemplateType(t)} className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${templateType === t ? 'border-gold-500/50 bg-gold-500/15 text-gold-200' : 'border-white/10 text-charcoal-500 hover:border-gold-500/30'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="mb-3">
              <p className="label-mono mb-1.5">Document Title</p>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="input-dark" placeholder={`${templateType} — Draft`} />
            </div>
            <div className="space-y-3">
              {TEMPLATE_FIELDS[templateType].map((field) => (
                <div key={field}>
                  <p className="label-mono mb-1.5">{field}</p>
                  <input
                    value={fieldValues[field] ?? ''}
                    onChange={(e) => setFieldValues({ ...fieldValues, [field]: e.target.value })}
                    className="input-dark"
                    placeholder={field}
                  />
                </div>
              ))}
            </div>
            <button onClick={generate} className="btn-gold mt-4 w-full"><Plus size={15} /> Generate Draft</button>
          </Card>

          <Card>
            <SectionTitle sub="Draft, Sent, Signed, Countersigned">
              <span className="inline-flex items-center gap-2"><Scale size={16} className="text-gold-400" /> Contract Library</span>
            </SectionTitle>
            <Table headers={['Document', 'Type', 'Created', 'Status']}>
              {contracts.map((c) => (
                <tr key={c.id}>
                  <td className="px-4 py-3 text-charcoal-500">{c.title}</td>
                  <td className="px-4 py-3 text-xs text-charcoal-600">{c.templateType}</td>
                  <td className="px-4 py-3 text-xs text-charcoal-600">{c.createdDate}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone(c.status)}>{c.status}</Badge></td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LegalFoundationModule;
