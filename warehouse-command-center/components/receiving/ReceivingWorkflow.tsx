'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { submitReceivingInspection } from '@/lib/actions/receiving';
import { acceptedQuantity, projectTotals, type InspectionOutcome } from '@/lib/receiving/quantities';
import { checkEvidence, type DocumentType } from '@/lib/receiving/evidence';
import { uploadEvidence, fileToDataUrl, type LocalEvidence } from '@/lib/receiving/upload';
import {
  enqueueDraft,
  removeDraft,
  listDrafts,
  countDrafts,
  type KeyValueStore,
} from '@/lib/offline/receivingQueue';
import { BarcodeScanner } from './BarcodeScanner';
import { formatQuantity } from '@/lib/format';

export interface ReceivingMaterial {
  id: string;
  name: string;
  unit: string;
  requiredQuantity: number;
  usableQuantity: number;
  receivedQuantity: number;
  damagedQuantity: number;
  rejectedQuantity: number;
  manufacturer: string | null;
  modelNumber: string | null;
  finishName: string | null;
  requires: {
    purchaseOrder: boolean;
    packingSlip: boolean;
    designRevision: boolean;
    specification: boolean;
    identity: boolean;
    lot: boolean;
    package: boolean;
    storage: boolean;
  };
}

export interface ReceivingProject {
  id: string;
  projectNumber: string;
  clientName: string;
  materials: ReceivingMaterial[];
}

const STEPS = ['Select', 'BOL', 'Count & inspect', 'Verify spec', 'Photos', 'Location & review'] as const;

function store(): KeyValueStore | null {
  return typeof window !== 'undefined' ? window.localStorage : null;
}

function newKey(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `k-${Date.now()}`;
}

export function ReceivingWorkflow({ orgId, projects }: { orgId: string; projects: ReceivingProject[] }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [idempotencyKey, setIdempotencyKey] = useState<string>('');
  const [projectId, setProjectId] = useState('');
  const [materialId, setMaterialId] = useState('');

  const [bolNumber, setBolNumber] = useState('');
  const [bolVerified, setBolVerified] = useState(false);
  const [driverName, setDriverName] = useState('');
  const [driverAck, setDriverAck] = useState<'not_applicable' | 'acknowledged' | 'refused' | 'driver_unavailable'>(
    'not_applicable',
  );
  const [signedWithException, setSignedWithException] = useState(false);

  const [received, setReceived] = useState(0);
  const [damaged, setDamaged] = useState(0);
  const [rejected, setRejected] = useState(0);
  const [shortQty, setShortQty] = useState(0);
  const [inspectionPassed, setInspectionPassed] = useState(false);
  const [packagingIntact, setPackagingIntact] = useState(true);
  const [inspectionLevel, setInspectionLevel] = useState<
    'packaging_and_label' | 'open_carton_visual' | 'full_piece_by_piece' | 'concealed_inspection_deferred'
  >('open_carton_visual');
  const [concealedReason, setConcealedReason] = useState('');
  const [concealedDeadline, setConcealedDeadline] = useState('');

  const [ver, setVer] = useState({
    purchaseOrder: false,
    packingSlip: false,
    designRevision: false,
    specification: false,
    identity: false,
    lot: false,
    pkg: false,
    storage: false,
  });

  const [zone, setZone] = useState('');
  const [rack, setRack] = useState('');
  const [bin, setBin] = useState('');
  const [notes, setNotes] = useState('');
  const [overrideReason, setOverrideReason] = useState('');
  const [evidence, setEvidence] = useState<LocalEvidence[]>([]);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<'saved' | 'queued' | null>(null);
  const [queuedCount, setQueuedCount] = useState(0);

  useEffect(() => {
    setIdempotencyKey(newKey());
    const s = store();
    if (s) setQueuedCount(countDrafts(s));
  }, []);

  const project = projects.find((p) => p.id === projectId);
  const material = project?.materials.find((m) => m.id === materialId);
  const concealed = inspectionLevel === 'concealed_inspection_deferred';

  const outcome: InspectionOutcome = useMemo(
    () => ({
      bolVerified,
      inspectionPassed,
      purchaseOrderVerified: ver.purchaseOrder,
      packingSlipVerified: ver.packingSlip,
      designRevisionVerified: ver.designRevision,
      specificationVerified: ver.specification,
      identityVerified: ver.identity,
      lotCompatibilityVerified: ver.lot,
      packageCompleteVerified: ver.pkg,
    }),
    [bolVerified, inspectionPassed, ver],
  );

  const accepted = useMemo(() => {
    if (!material) return 0;
    return acceptedQuantity(
      { receivedQuantity: received, damagedQuantity: damaged, rejectedQuantity: rejected },
      outcome,
      {
        purchaseOrderRequired: material.requires.purchaseOrder,
        packingSlipRequired: material.requires.packingSlip,
        designRevisionRequired: material.requires.designRevision,
        specificationRequired: material.requires.specification,
        identityRequired: material.requires.identity,
        lotRequired: material.requires.lot,
        packageRequired: material.requires.package,
      },
    );
  }, [material, received, damaged, rejected, outcome]);

  const projected = useMemo(() => {
    if (!material) return null;
    try {
      return projectTotals(
        {
          requiredQuantity: material.requiredQuantity,
          receivedQuantity: material.receivedQuantity,
          usableQuantity: material.usableQuantity,
          damagedQuantity: material.damagedQuantity,
          rejectedQuantity: material.rejectedQuantity,
        },
        { receivedQuantity: received, damagedQuantity: damaged, rejectedQuantity: rejected },
        accepted,
      );
    } catch {
      return null;
    }
  }, [material, received, damaged, rejected, accepted]);

  const evidenceCheck = checkEvidence(
    { damagedQuantity: damaged, rejectedQuantity: rejected, concealedInspectionDeferred: concealed },
    evidence.map((e) => ({ documentType: e.documentType, storagePath: e.file.name })),
  );

  function addEvidence(documentType: DocumentType, files: FileList | null) {
    if (!files) return;
    const additions: LocalEvidence[] = Array.from(files).map((file) => ({ documentType, file }));
    setEvidence((prev) => [...prev, ...additions]);
  }

  function buildPayload(): Record<string, unknown> {
    return {
      projectId,
      projectMaterialId: materialId,
      deliveryId: null,
      idempotencyKey,
      bolNumber,
      bolVerified,
      driverName,
      receivedQuantity: received,
      damagedQuantity: damaged,
      rejectedQuantity: rejected,
      shortQuantity: shortQty,
      inspectionPassed,
      inspectionLevel,
      packagingIntact,
      packagingCondition: '',
      purchaseOrderVerified: ver.purchaseOrder,
      packingSlipVerified: ver.packingSlip,
      designRevisionVerified: ver.designRevision,
      specificationVerified: ver.specification,
      identityVerified: ver.identity,
      lotCompatibilityVerified: ver.lot,
      packageCompleteVerified: ver.pkg,
      storageCompliant: ver.storage,
      driverAcknowledgmentStatus: driverAck,
      signedWithException,
      concealedInspectionDeferred: concealed,
      concealedInspectionReason: concealedReason,
      concealedDamageNoticeDeadline: concealed ? concealedDeadline || null : null,
      warehouseZone: zone,
      warehouseRack: rack,
      warehouseBin: bin,
      notes,
      overrideReason,
    };
  }

  async function queueOffline() {
    const s = store();
    if (!s) return;
    const queuedEvidence = await Promise.all(
      evidence.map(async (e) => ({
        documentType: e.documentType,
        dataUrl: await fileToDataUrl(e.file),
        filename: e.file.name,
      })),
    );
    enqueueDraft(s, {
      idempotencyKey,
      createdAt: new Date().toISOString(),
      inspection: buildPayload(),
      evidence: queuedEvidence,
    });
    setQueuedCount(countDrafts(s));
    setDone('queued');
  }

  async function onSubmit() {
    setError(null);
    if (!material) {
      setError('Select a project and material first.');
      return;
    }
    if (!evidenceCheck.satisfied && overrideReason.trim().length === 0) {
      setError(`Missing required evidence: ${evidenceCheck.missing.join(', ')}. Capture it or give an override reason.`);
      return;
    }
    setSubmitting(true);
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        await queueOffline();
        return;
      }
      const descriptors = await uploadEvidence(orgId, projectId, evidence);
      const result = await submitReceivingInspection(buildPayload(), descriptors);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone('saved');
      router.refresh();
    } catch {
      // Network or upload failure → keep the receipt safe on-device.
      await queueOffline();
    } finally {
      setSubmitting(false);
    }
  }

  const syncQueue = useCallback(async () => {
    const s = store();
    if (!s) return;
    for (const draft of listDrafts(s)) {
      try {
        const files: LocalEvidence[] = await Promise.all(
          draft.evidence.map(async (e) => {
            const blob = await (await fetch(e.dataUrl)).blob();
            return { documentType: e.documentType as DocumentType, file: new File([blob], e.filename, { type: blob.type }) };
          }),
        );
        const pid = String((draft.inspection as { projectId?: string }).projectId ?? '');
        const descriptors = await uploadEvidence(orgId, pid, files);
        const result = await submitReceivingInspection(draft.inspection, descriptors);
        if (result.ok) removeDraft(s, draft.idempotencyKey);
      } catch {
        // Leave the draft queued; try again on the next sync.
      }
    }
    setQueuedCount(countDrafts(s));
  }, [orgId]);

  useEffect(() => {
    function onOnline() {
      void syncQueue();
    }
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [syncQueue]);

  if (done) {
    return (
      <div className="card p-6 text-center">
        <p className="text-lg font-bold text-status-ready">
          {done === 'saved' ? 'Receiving inspection saved' : 'Saved offline — will sync automatically'}
        </p>
        <p className="mt-1 text-sm text-steel-600">
          {done === 'saved'
            ? 'Material totals were updated atomically and readiness re-evaluated.'
            : 'This device holds the receipt with its idempotency key; syncing it will not double-count quantities.'}
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              // Reset for the next delivery with a fresh idempotency key.
              setDone(null);
              setStep(0);
              setIdempotencyKey(newKey());
              setEvidence([]);
              setReceived(0);
              setDamaged(0);
              setRejected(0);
              setBolNumber('');
              setBolVerified(false);
              setInspectionPassed(false);
              setVer({
                purchaseOrder: false,
                packingSlip: false,
                designRevision: false,
                specification: false,
                identity: false,
                lot: false,
                pkg: false,
                storage: false,
              });
              setOverrideReason('');
            }}
          >
            Receive another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      {queuedCount > 0 ? (
        <div className="mb-3 flex items-center justify-between rounded-md bg-status-delayed/10 px-3 py-2 text-sm text-status-delayed">
          <span>
            {queuedCount} receiving {queuedCount === 1 ? 'draft' : 'drafts'} pending sync
          </span>
          <button type="button" className="btn-secondary" onClick={() => void syncQueue()}>
            Sync now
          </button>
        </div>
      ) : null}

      {/* Stepper */}
      <ol className="mb-4 flex items-center gap-1 text-xs" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex-1 rounded-full px-2 py-1 text-center ${
              i === step ? 'bg-steel-700 text-white' : i < step ? 'bg-steel-200 text-steel-700' : 'bg-steel-100 text-steel-400'
            }`}
          >
            {label}
          </li>
        ))}
      </ol>

      <div className="card p-4">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="rp">
                Project
              </label>
              <select
                id="rp"
                className="input"
                value={projectId}
                onChange={(e) => {
                  setProjectId(e.target.value);
                  setMaterialId('');
                }}
              >
                <option value="">Select a project…</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectNumber} — {p.clientName}
                  </option>
                ))}
              </select>
            </div>
            {project ? (
              <div>
                <label className="label" htmlFor="rm">
                  Material line
                </label>
                <select id="rm" className="input" value={materialId} onChange={(e) => setMaterialId(e.target.value)}>
                  <option value="">Select a material…</option>
                  {project.materials.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({formatQuantity(m.usableQuantity)}/{formatQuantity(m.requiredQuantity)} {m.unit})
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {material ? (
              <p className="rounded-md bg-steel-50 p-3 text-xs text-steel-600">
                Approved: {[material.manufacturer, material.modelNumber, material.finishName].filter(Boolean).join(' / ') || '—'}
              </p>
            ) : null}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="label" htmlFor="bol">
                BOL / delivery ticket number
              </label>
              <input id="bol" className="input" value={bolNumber} onChange={(e) => setBolNumber(e.target.value)} />
            </div>
            <BarcodeScanner onDetected={(v) => setBolNumber(v)} />
            <Toggle label="BOL/ticket matches PO and expected delivery" checked={bolVerified} onChange={setBolVerified} />
            <div>
              <label className="label" htmlFor="driver">
                Driver name
              </label>
              <input id="driver" className="input" value={driverName} onChange={(e) => setDriverName(e.target.value)} />
            </div>
            <div>
              <label className="label" htmlFor="ack">
                Driver acknowledgment
              </label>
              <select id="ack" className="input" value={driverAck} onChange={(e) => setDriverAck(e.target.value as typeof driverAck)}>
                <option value="not_applicable">Not applicable</option>
                <option value="acknowledged">Acknowledged exceptions</option>
                <option value="refused">Refused to acknowledge</option>
                <option value="driver_unavailable">Driver unavailable</option>
              </select>
            </div>
            <Toggle label="BOL signed with exception" checked={signedWithException} onChange={setSignedWithException} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <NumberField label={`Received (${material?.unit ?? 'EA'})`} value={received} onChange={setReceived} />
            <div className="grid grid-cols-3 gap-2">
              <NumberField label="Damaged" value={damaged} onChange={setDamaged} />
              <NumberField label="Rejected" value={rejected} onChange={setRejected} />
              <NumberField label="Short" value={shortQty} onChange={setShortQty} />
            </div>
            <div>
              <label className="label" htmlFor="level">
                Inspection level
              </label>
              <select
                id="level"
                className="input"
                value={inspectionLevel}
                onChange={(e) => setInspectionLevel(e.target.value as typeof inspectionLevel)}
              >
                <option value="packaging_and_label">Packaging &amp; label</option>
                <option value="open_carton_visual">Open-carton visual</option>
                <option value="full_piece_by_piece">Full piece-by-piece</option>
                <option value="concealed_inspection_deferred">Concealed — deferred</option>
              </select>
            </div>
            {concealed ? (
              <div className="space-y-2 rounded-md bg-status-delayed/10 p-3">
                <input
                  className="input"
                  placeholder="Reason inspection is deferred"
                  value={concealedReason}
                  onChange={(e) => setConcealedReason(e.target.value)}
                />
                <div>
                  <label className="label" htmlFor="deadline">
                    Concealed-damage notice deadline
                  </label>
                  <input
                    id="deadline"
                    type="date"
                    className="input"
                    value={concealedDeadline}
                    onChange={(e) => setConcealedDeadline(e.target.value)}
                  />
                </div>
              </div>
            ) : null}
            <Toggle label="Product condition inspection passed" checked={inspectionPassed} onChange={setInspectionPassed} />
            <Toggle label="Packaging intact (no crush/puncture/moisture)" checked={packagingIntact} onChange={setPackagingIntact} />
            {projected ? (
              <p className="rounded-md bg-steel-50 p-3 text-sm">
                Will accept <span className="font-bold">{formatQuantity(accepted)}</span> usable · new total{' '}
                <span className="font-bold">
                  {formatQuantity(projected.usableQuantity)}/{formatQuantity(projected.requiredQuantity)}
                </span>{' '}
                → <span className="font-semibold capitalize">{projected.status}</span>
              </p>
            ) : (
              <p className="rounded-md bg-status-blocked/10 p-3 text-sm text-status-blocked">
                Damaged + rejected cannot exceed received.
              </p>
            )}
          </div>
        )}

        {step === 3 && material && (
          <div className="space-y-3">
            <p className="text-sm text-steel-600">
              Confirm the exact approved specification and identity. Quantity acceptance is not specification acceptance.
            </p>
            {material.requires.purchaseOrder && (
              <Toggle label="Purchase order verified" checked={ver.purchaseOrder} onChange={(v) => setVer((s) => ({ ...s, purchaseOrder: v }))} />
            )}
            {material.requires.packingSlip && (
              <Toggle label="Packing slip verified" checked={ver.packingSlip} onChange={(v) => setVer((s) => ({ ...s, packingSlip: v }))} />
            )}
            {material.requires.designRevision && (
              <Toggle label="Current design revision verified" checked={ver.designRevision} onChange={(v) => setVer((s) => ({ ...s, designRevision: v }))} />
            )}
            {material.requires.specification && (
              <Toggle label="Manufacturer / model / finish / dimensions match" checked={ver.specification} onChange={(v) => setVer((s) => ({ ...s, specification: v }))} />
            )}
            {material.requires.identity && (
              <Toggle label="Cabinet tag / serial / slab / lot identity verified" checked={ver.identity} onChange={(v) => setVer((s) => ({ ...s, identity: v }))} />
            )}
            {material.requires.lot && (
              <Toggle label="Dye lot / shade / caliber compatibility verified" checked={ver.lot} onChange={(v) => setVer((s) => ({ ...s, lot: v }))} />
            )}
            {material.requires.package && (
              <Toggle label="Accessory / installation-kit package complete" checked={ver.pkg} onChange={(v) => setVer((s) => ({ ...s, pkg: v }))} />
            )}
            {!Object.values(material.requires).some(Boolean) && (
              <p className="text-sm text-steel-500">No special verifications required for this line.</p>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm text-steel-600">Capture required photos. Missing evidence blocks a clean receipt.</p>
            <PhotoInput label="BOL / delivery ticket" onFiles={(f) => addEvidence('bol', f)} />
            <PhotoInput label="Product / label" onFiles={(f) => addEvidence('material_photo', f)} />
            <PhotoInput label="Approved finish comparison" onFiles={(f) => addEvidence('finish_comparison_photo', f)} />
            {(damaged > 0 || rejected > 0) && <PhotoInput label="Damage" onFiles={(f) => addEvidence('damage_photo', f)} />}
            <PhotoInput label="Staging location" onFiles={(f) => addEvidence('material_photo', f)} />

            {evidence.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {evidence.map((e, i) => (
                  <span key={`${e.file.name}-${i}`} className="badge bg-steel-200 text-steel-700">
                    {e.documentType.replace(/_/g, ' ')}
                    <button type="button" aria-label="Remove" className="ml-1" onClick={() => setEvidence((p) => p.filter((_, j) => j !== i))}>
                      ×
                    </button>
                  </span>
                ))}
              </div>
            ) : null}

            <div className={`rounded-md p-3 text-sm ${evidenceCheck.satisfied ? 'bg-status-ready/10 text-status-ready' : 'bg-status-delayed/10 text-status-delayed'}`}>
              {evidenceCheck.satisfied ? 'All required evidence captured.' : `Still needed: ${evidenceCheck.missing.join(', ')}`}
            </div>
            {!evidenceCheck.satisfied ? (
              <div>
                <label className="label" htmlFor="ov">
                  Authorized override reason (required to complete without all evidence)
                </label>
                <input id="ov" className="input" value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} />
              </div>
            ) : null}
          </div>
        )}

        {step === 5 && material && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="label" htmlFor="zone">
                  Zone
                </label>
                <input id="zone" className="input" value={zone} onChange={(e) => setZone(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="rack">
                  Rack
                </label>
                <input id="rack" className="input" value={rack} onChange={(e) => setRack(e.target.value)} />
              </div>
              <div>
                <label className="label" htmlFor="bin">
                  Bin
                </label>
                <input id="bin" className="input" value={bin} onChange={(e) => setBin(e.target.value)} />
              </div>
            </div>
            <Toggle label="Assigned location satisfies the material handling/storage class" checked={ver.storage} onChange={(v) => setVer((s) => ({ ...s, storage: v }))} />
            <div>
              <label className="label" htmlFor="notes">
                Notes
              </label>
              <textarea id="notes" className="input" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <div className="rounded-md bg-steel-50 p-3 text-sm text-steel-700">
              <p className="font-semibold">Review</p>
              <p>
                {material.name}: receiving {formatQuantity(received)} {material.unit}, accepting {formatQuantity(accepted)} usable.
              </p>
              <p>BOL {bolNumber || '—'} {bolVerified ? '(verified)' : '(not verified)'}</p>
            </div>
            {error ? (
              <p role="alert" className="rounded-md bg-status-blocked/10 px-3 py-2 text-sm text-status-blocked">
                {error}
              </p>
            ) : null}
            <button type="button" className="btn-primary w-full" onClick={onSubmit} disabled={submitting}>
              {submitting ? 'Saving…' : 'Save receiving inspection'}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-6 flex justify-between">
          <button type="button" className="btn-secondary" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
            Back
          </button>
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              className="btn-primary"
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !material}
            >
              Next
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-3 py-1">
      <input type="checkbox" className="h-5 w-5 rounded border-steel-300" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="text-sm text-steel-800">{label}</span>
    </label>
  );
}

function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        step="any"
        className="input"
        value={Number.isNaN(value) ? '' : value}
        onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      />
    </div>
  );
}

function PhotoInput({ label, onFiles }: { label: string; onFiles: (files: FileList | null) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border border-dashed border-steel-300 px-3 py-3 text-sm text-steel-700">
      <span>{label}</span>
      <input type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={(e) => onFiles(e.target.files)} />
      <span className="btn-secondary">Add photo</span>
    </label>
  );
}
