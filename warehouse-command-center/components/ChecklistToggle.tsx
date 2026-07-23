'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toggleReadinessChecklist } from '@/lib/actions/readiness';

export function ChecklistToggle({
  projectId,
  checklistKey,
  label,
  completed,
  required,
  canEdit,
}: {
  projectId: string;
  checklistKey: string;
  label: string;
  completed: boolean;
  required: boolean;
  canEdit: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onChange(next: boolean) {
    startTransition(async () => {
      await toggleReadinessChecklist({ projectId, checklistKey, completed: next });
      router.refresh();
    });
  }

  return (
    <label className="flex items-center gap-3 py-2">
      <input
        type="checkbox"
        className="h-5 w-5 rounded border-steel-300"
        checked={completed}
        disabled={!canEdit || pending}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={`text-sm ${completed ? 'text-steel-500 line-through' : 'text-steel-800'}`}>
        {label}
        {required ? <span className="ml-1 text-status-blocked">*</span> : null}
      </span>
    </label>
  );
}
