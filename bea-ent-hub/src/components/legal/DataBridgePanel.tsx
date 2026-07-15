import React, { useState } from 'react';
import { Copy, Check, Radio } from 'lucide-react';
import { LegalEntityProfile } from '../../types';

interface Props {
  entity: LegalEntityProfile;
}

const DataBridgePanel: React.FC<Props> = ({ entity }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copy = (field: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 1400);
    });
  };

  const rows: { key: string; label: string; value: string; placeholder: string }[] = [
    { key: 'entityName', label: 'Legal Entity Name', value: entity.entityName, placeholder: 'Not set yet' },
    { key: 'ein', label: 'EIN', value: entity.ein, placeholder: 'Not captured' },
    { key: 'businessAddress', label: 'Business Address', value: entity.businessAddress, placeholder: 'Not set' },
    { key: 'jurisdictionAbbr', label: 'Jurisdiction', value: entity.jurisdictionAbbr ?? '', placeholder: 'Not selected' },
  ];

  return (
    <div className="glass-card sticky top-8 p-5">
      <p className="label-mono mb-3 flex items-center gap-1.5">
        <Radio size={12} className="animate-pulse-gold text-gold-400" /> Auto-Fill Data Bridge
      </p>
      <p className="mb-4 text-xs text-charcoal-600">
        Tracked in real time as you complete the wizard. Click any field to copy it while you fill out external
        portals.
      </p>
      <div className="space-y-2.5">
        {rows.map((row) => (
          <button
            key={row.key}
            onClick={() => copy(row.key, row.value)}
            disabled={!row.value}
            className="flex w-full items-center justify-between gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5 text-left transition hover:border-gold-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="min-w-0">
              <p className="label-mono">{row.label}</p>
              <p className={`truncate text-sm ${row.value ? 'text-charcoal-500' : 'text-charcoal-600 italic'}`}>{row.value || row.placeholder}</p>
            </div>
            {copiedField === row.key ? <Check size={14} className="shrink-0 text-emerald-400" /> : <Copy size={14} className="shrink-0 text-gold-500/60" />}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataBridgePanel;
