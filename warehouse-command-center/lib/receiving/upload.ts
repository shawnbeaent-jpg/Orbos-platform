import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { DocumentType, EvidenceDescriptor } from '@/lib/receiving/evidence';

const BUCKET = 'project-documents';

export interface LocalEvidence {
  documentType: DocumentType;
  file: File;
  caption?: string;
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
}

function randomId(): string {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : String(Date.now());
}

/**
 * Upload evidence files to the org-scoped private bucket and return descriptors.
 * Path layout: <orgId>/<projectId>/<documentType>/<uuid>-<filename>, which the
 * storage RLS policies validate against the caller's organization.
 */
export async function uploadEvidence(
  orgId: string,
  projectId: string,
  items: LocalEvidence[],
): Promise<EvidenceDescriptor[]> {
  const supabase = getSupabaseBrowserClient();
  const descriptors: EvidenceDescriptor[] = [];
  for (const item of items) {
    const path = `${orgId}/${projectId}/${item.documentType}/${randomId()}-${safeName(item.file.name)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, item.file, {
      contentType: item.file.type,
      upsert: false,
    });
    if (error) throw new Error(`Upload failed for ${item.file.name}: ${error.message}`);
    descriptors.push({ documentType: item.documentType, storagePath: path, caption: item.caption });
  }
  return descriptors;
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
