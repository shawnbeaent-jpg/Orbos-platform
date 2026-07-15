import React, { useEffect, useState } from 'react';
import { ChevronDown, ExternalLink, Lock, Sparkles, Download, Info } from 'lucide-react';
import { useApp, useCurrentArtist } from '../../state/AppContext';
import { Badge, statusTone } from '../ui';
import {
  EIN_APPLICATION_URL,
  JURISDICTIONS,
  MAILBOX_PROVIDERS,
  consultNaics,
} from '../../data/legalData';
import { NaicsCode, RoyaltyOrg, RoyaltyRegStatus } from '../../types';
import DataBridgePanel from './DataBridgePanel';

const STEP_TITLES = [
  'Jurisdiction Selection',
  'Articles of Organization',
  'EIN Portal Link & Capture',
  'Business Address Strategy',
  'AI NAICS Code Consultant',
  'Operating Agreement Generator',
  'Ready for Bank',
  'Music Royalty Registration Checklist',
];

const AccordionStep: React.FC<{
  index: number;
  title: string;
  open: boolean;
  onToggle: () => void;
  badge?: React.ReactNode;
  children: React.ReactNode;
}> = ({ index, title, open, onToggle, badge, children }) => (
  <div className="glass-card overflow-hidden !p-0">
    <button onClick={onToggle} className="flex w-full items-center gap-4 px-5 py-4 text-left">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 font-mono text-xs text-gold-200">
        {index}
      </div>
      <span className="flex-1 font-serif text-base text-gold-100">{title}</span>
      {badge}
      <ChevronDown size={16} className={`shrink-0 text-gold-500/60 transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>
    {open && <div className="border-t border-white/5 px-5 py-5">{children}</div>}
  </div>
);

const LegalWizard: React.FC = () => {
  const artist = useCurrentArtist();
  const {
    currentUser,
    legalEntities,
    ensureLegalEntity,
    updateLegalEntity,
    setNaicsCodes,
    generateOperatingAgreement,
    toggleBankChecklistItem,
    updateRoyaltyStatus,
  } = useApp();

  const [openStep, setOpenStep] = useState(1);
  const [naicsInput, setNaicsInput] = useState('');
  const [naicsResults, setNaicsResults] = useState<NaicsCode[] | null>(null);
  const [einDraft, setEinDraft] = useState('');

  useEffect(() => {
    if (artist) ensureLegalEntity(artist.id, artist.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artist?.id]);

  const entity = artist ? legalEntities.find((e) => e.artistId === artist.id) : undefined;

  useEffect(() => {
    if (entity) setEinDraft(entity.ein);
  }, [entity?.artistId]);

  if (!artist || !entity) {
    return <p className="text-sm text-charcoal-600">No artist selected — pick an active artist to start their legal foundation.</p>;
  }

  const isLocked = currentUser?.role === 'INDIE' && (currentUser.subscriptionTier ?? 'Hustler') === 'Hustler';

  const formatEin = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 9);
    return digits.length > 2 ? `${digits.slice(0, 2)}-${digits.slice(2)}` : digits;
  };

  const runNaicsConsult = () => {
    const results = consultNaics(naicsInput || `${artist.genre} independent artist`);
    setNaicsResults(results);
  };

  const generateAgreement = () => {
    const jurisdiction = JURISDICTIONS.find((j) => j.abbr === entity.jurisdictionAbbr);
    const text = `OPERATING AGREEMENT (Specimen Draft)

Entity: ${entity.entityName}
Entity Type: ${entity.entityType}
Jurisdiction: ${jurisdiction ? `${jurisdiction.state} (${jurisdiction.abbr})` : 'Not yet selected'}
EIN: ${entity.ein || 'Pending'}
Effective Date: ${new Date().toLocaleDateString()}

ARTICLE I — FORMATION
The undersigned Member(s) hereby form ${entity.entityName} as a ${entity.entityType} under the laws of ${jurisdiction?.state ?? '[Jurisdiction]'}.

ARTICLE II — PURPOSE
The Company is organized to engage in the business of music creation, performance, licensing, merchandising, and any lawful related activity.

ARTICLE III — MANAGEMENT
The Company shall be member-managed. All major decisions require majority member consent unless otherwise delegated in writing.

ARTICLE IV — CAPITAL CONTRIBUTIONS & DISTRIBUTIONS
Distributions shall be made in proportion to membership interest, as recorded in the Company's books, subject to reasonable reserves.

ARTICLE V — DISSOLUTION
The Company may be dissolved upon unanimous member consent or as required by ${jurisdiction?.state ?? 'the governing state'} law.

This is an in-app specimen draft generated for planning purposes. Have it reviewed by a licensed attorney in your jurisdiction before execution.`;
    generateOperatingAgreement(artist.id, text);
  };

  const downloadAgreement = () => {
    if (!entity.operatingAgreementText) return;
    const blob = new Blob([entity.operatingAgreementText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${entity.entityName.replace(/\s+/g, '_')}_Operating_Agreement.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bankDoneCount = entity.bankChecklist.filter((b) => b.done).length;
  const royaltyDoneCount = entity.royaltyRegistrations.filter((r) => r.status === 'Registered').length;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        {/* Step 1 */}
        <AccordionStep index={1} title={STEP_TITLES[0]} open={openStep === 1} onToggle={() => setOpenStep(openStep === 1 ? 0 : 1)}
          badge={entity.jurisdictionAbbr ? <Badge tone="green">{entity.jurisdictionAbbr} selected</Badge> : undefined}>
          <p className="mb-4 text-sm text-charcoal-500">Pick the state where you'll form your entity. Each links directly to that state's Secretary of State filing portal.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {JURISDICTIONS.map((j) => (
              <button
                key={j.abbr}
                onClick={() => updateLegalEntity(artist.id, { jurisdictionAbbr: j.abbr })}
                className={`rounded-lg border p-3 text-left transition ${entity.jurisdictionAbbr === j.abbr ? 'border-gold-500/50 bg-gold-500/10' : 'border-white/10 hover:border-gold-500/30'}`}
              >
                <p className="text-sm font-medium text-charcoal-500">{j.state}</p>
                <p className="label-mono mt-0.5">{j.filingFeeNote}</p>
              </button>
            ))}
          </div>
          {entity.jurisdictionAbbr && (
            <a
              href={JURISDICTIONS.find((j) => j.abbr === entity.jurisdictionAbbr)?.filingUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost mt-4 inline-flex text-xs"
            >
              Open {JURISDICTIONS.find((j) => j.abbr === entity.jurisdictionAbbr)?.state} SOS Filing Portal <ExternalLink size={12} />
            </a>
          )}
        </AccordionStep>

        {/* Step 2 */}
        <AccordionStep index={2} title={STEP_TITLES[1]} open={openStep === 2} onToggle={() => setOpenStep(openStep === 2 ? 0 : 2)}
          badge={entity.articlesFiled ? <Badge tone="green">Filed</Badge> : <Badge tone="amber">Not filed</Badge>}>
          <div className="space-y-3">
            <div>
              <p className="label-mono mb-1.5">Entity Name</p>
              <input value={entity.entityName} onChange={(e) => updateLegalEntity(artist.id, { entityName: e.target.value })} className="input-dark" />
            </div>
            <div>
              <p className="label-mono mb-1.5">Entity Type</p>
              <select
                value={entity.entityType}
                onChange={(e) => updateLegalEntity(artist.id, { entityType: e.target.value as typeof entity.entityType })}
                className="input-dark"
              >
                <option value="LLC">LLC</option>
                <option value="S-Corp">S-Corp</option>
                <option value="Sole Proprietorship">Sole Proprietorship</option>
              </select>
            </div>
            {entity.jurisdictionAbbr && (
              <a href={JURISDICTIONS.find((j) => j.abbr === entity.jurisdictionAbbr)?.filingUrl} target="_blank" rel="noreferrer" className="btn-ghost inline-flex text-xs">
                Open Filing Portal Bridge <ExternalLink size={12} />
              </a>
            )}
            <label className="flex items-center gap-2 text-sm text-charcoal-500">
              <input type="checkbox" checked={entity.articlesFiled} onChange={(e) => updateLegalEntity(artist.id, { articlesFiled: e.target.checked })} className="accent-gold-500" />
              I have filed my Articles of Organization with the state
            </label>
          </div>
        </AccordionStep>

        {/* Step 3 */}
        <AccordionStep index={3} title={STEP_TITLES[2]} open={openStep === 3} onToggle={() => setOpenStep(openStep === 3 ? 0 : 3)}
          badge={entity.ein ? <Badge tone="green">Captured</Badge> : undefined}>
          <p className="mb-3 text-sm text-charcoal-500">Apply for a free federal EIN directly through the IRS, then store the number here.</p>
          <a href={EIN_APPLICATION_URL} target="_blank" rel="noreferrer" className="btn-ghost mb-3 inline-flex text-xs">
            Open IRS EIN Application <ExternalLink size={12} />
          </a>
          <div className="flex gap-2">
            <input
              value={einDraft}
              onChange={(e) => setEinDraft(formatEin(e.target.value))}
              placeholder="XX-XXXXXXX"
              className="input-dark font-mono"
            />
            <button onClick={() => updateLegalEntity(artist.id, { ein: einDraft })} className="btn-gold shrink-0">Save</button>
          </div>
        </AccordionStep>

        {/* Step 4 */}
        <AccordionStep index={4} title={STEP_TITLES[3]} open={openStep === 4} onToggle={() => setOpenStep(openStep === 4 ? 0 : 4)}>
          <p className="mb-3 text-sm text-charcoal-500">A registered agent or virtual mailbox keeps your home address off public filings.</p>
          <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {MAILBOX_PROVIDERS.map((p) => (
              <button
                key={p.name}
                onClick={() => updateLegalEntity(artist.id, { mailboxProvider: p.name })}
                className={`group relative rounded-lg border p-3 text-left transition ${entity.mailboxProvider === p.name ? 'border-gold-500/50 bg-gold-500/10' : 'border-white/10 hover:border-gold-500/30'}`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-charcoal-500">{p.name}</p>
                  <Info size={12} className="text-gold-500/50" />
                </div>
                <p className="mt-1 text-xs text-charcoal-600">{p.note}</p>
                <a href={p.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} className="mt-1 inline-flex items-center gap-1 text-[11px] text-gold-400 hover:text-gold-200">
                  Visit site <ExternalLink size={10} />
                </a>
              </button>
            ))}
          </div>
          <p className="label-mono mb-1.5">Business Address on File</p>
          <input
            value={entity.businessAddress}
            onChange={(e) => updateLegalEntity(artist.id, { businessAddress: e.target.value })}
            className="input-dark"
            placeholder="Street, City, State, ZIP"
          />
        </AccordionStep>

        {/* Step 5 */}
        <AccordionStep index={5} title={STEP_TITLES[4]} open={openStep === 5} onToggle={() => setOpenStep(openStep === 5 ? 0 : 5)}
          badge={entity.naicsCodes.length > 0 ? <Badge tone="green">{entity.naicsCodes.length} code(s) set</Badge> : undefined}>
          <p className="mb-3 text-sm text-charcoal-500">Describe your business — we'll match it to the correct real NAICS classification codes.</p>
          <textarea
            value={naicsInput}
            onChange={(e) => setNaicsInput(e.target.value)}
            rows={3}
            className="input-dark mb-3 resize-none"
            placeholder="e.g. I write and perform my own songs, and occasionally produce beats for other artists."
          />
          <button onClick={runNaicsConsult} className="btn-ghost text-xs"><Sparkles size={13} /> Consult NAICS Codes</button>
          {naicsResults && (
            <div className="mt-4 space-y-2">
              {naicsResults.map((n) => (
                <div key={n.code} className="rounded-lg border border-gold-500/20 bg-gold-500/5 p-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-gold-300">{n.code}</span>
                    <span className="text-sm font-medium text-charcoal-500">{n.label}</span>
                  </div>
                  <p className="mt-1 text-xs text-charcoal-600">{n.description}</p>
                </div>
              ))}
              <button onClick={() => setNaicsCodes(artist.id, naicsResults)} className="btn-gold text-xs">Save Codes to Entity</button>
            </div>
          )}
          {entity.naicsCodes.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {entity.naicsCodes.map((n) => <Badge key={n.code} tone="gold">{n.code} · {n.label}</Badge>)}
            </div>
          )}
        </AccordionStep>

        {/* Step 6 */}
        <AccordionStep index={6} title={STEP_TITLES[5]} open={openStep === 6} onToggle={() => setOpenStep(openStep === 6 ? 0 : 6)}
          badge={entity.operatingAgreementGenerated ? <Badge tone="green">Generated</Badge> : isLocked ? <Badge tone="amber"><Lock size={10} className="mr-1 inline" />Mogul+</Badge> : undefined}>
          {isLocked ? (
            <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-gold-500/30 py-8 text-center">
              <Lock size={22} className="text-gold-500/60" />
              <p className="text-sm text-charcoal-500">The Operating Agreement Generator is a Mogul and Hitmaker feature.</p>
              <p className="text-xs text-charcoal-600">Upgrade your plan in the Subscription Vault to unlock it.</p>
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm text-charcoal-500">Auto-drafts a specimen Operating Agreement from your entity details above.</p>
              <button onClick={generateAgreement} className="btn-gold mb-3 text-xs">
                <Sparkles size={13} /> Generate Operating Agreement
              </button>
              {entity.operatingAgreementText && (
                <>
                  <div className="scrollbar-gold max-h-56 overflow-y-auto whitespace-pre-wrap rounded-lg border border-white/10 bg-midnight-900/50 p-4 font-mono text-[11px] leading-relaxed text-charcoal-500">
                    {entity.operatingAgreementText}
                  </div>
                  <button onClick={downloadAgreement} className="btn-ghost mt-3 text-xs"><Download size={13} /> Download as .txt</button>
                </>
              )}
            </div>
          )}
        </AccordionStep>

        {/* Step 7 */}
        <AccordionStep index={7} title={STEP_TITLES[6]} open={openStep === 7} onToggle={() => setOpenStep(openStep === 7 ? 0 : 7)}
          badge={<Badge tone={bankDoneCount === entity.bankChecklist.length ? 'green' : 'amber'}>{bankDoneCount}/{entity.bankChecklist.length}</Badge>}>
          <p className="mb-3 text-sm text-charcoal-500">Exactly what to bring to open a business bank account.</p>
          <div className="space-y-2">
            {entity.bankChecklist.map((item) => (
              <label key={item.id} className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-sm text-charcoal-500">
                <input type="checkbox" checked={item.done} onChange={() => toggleBankChecklistItem(artist.id, item.id)} className="accent-gold-500" />
                {item.label}
              </label>
            ))}
          </div>
        </AccordionStep>

        {/* Step 8 */}
        <AccordionStep index={8} title={STEP_TITLES[7]} open={openStep === 8} onToggle={() => setOpenStep(openStep === 8 ? 0 : 8)}
          badge={<Badge tone={royaltyDoneCount === entity.royaltyRegistrations.length ? 'green' : 'amber'}>{royaltyDoneCount}/{entity.royaltyRegistrations.length} registered</Badge>}>
          <p className="mb-3 text-sm text-charcoal-500">Choose one PRO (ASCAP, BMI, or SESAC) and register with each of the others separately — they collect different royalty types.</p>
          <div className="space-y-2">
            {entity.royaltyRegistrations.map((reg) => (
              <div key={reg.org} className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-charcoal-500">{reg.org}</p>
                    <p className="text-xs text-charcoal-600">{reg.note}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={reg.url} target="_blank" rel="noreferrer" className="btn-ghost px-2.5 py-1 text-[11px]">
                      Register <ExternalLink size={10} />
                    </a>
                    <select
                      value={reg.status}
                      onChange={(e) => updateRoyaltyStatus(artist.id, reg.org as RoyaltyOrg, e.target.value as RoyaltyRegStatus)}
                      className="rounded-md border border-white/10 bg-transparent px-2 py-1 text-xs text-charcoal-500"
                    >
                      <option value="Not Started" className="bg-midnight-900">Not Started</option>
                      <option value="In Progress" className="bg-midnight-900">In Progress</option>
                      <option value="Registered" className="bg-midnight-900">Registered</option>
                    </select>
                    <Badge tone={statusTone(reg.status === 'Registered' ? 'Completed' : reg.status)}>{reg.status}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionStep>
      </div>

      <DataBridgePanel entity={entity} />
    </div>
  );
};

export default LegalWizard;
