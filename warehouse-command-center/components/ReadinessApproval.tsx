'use client';
import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { approveProjectReadiness } from '@/lib/actions/readiness';

export function ReadinessApproval({
  projectId,
  canApprove,
  eligible,
  alreadyApproved,
}: {
  projectId: string;
  canApprove: boolean;
  eligible: boolean;
  alreadyApproved: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (alreadyApproved) {
    return (
      <div className="rounded-md bg-status-ready/10 px-4 py-3 text-sm font-semibold text-status-ready">
        This project is approved Ready to Start. Any controlling change will automatically revoke it.
      </div>
    );
  }

  function approve() {
    setError(null);
    startTransition(async () => {
      const result = await approveProjectReadiness({ projectId });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      {!canApprove ? (
        <p className="text-sm text-steel-500">
          Only an Administrator or Warehouse Manager can grant final Ready-to-Start approval.
        </p>
      ) : (
        <button
          type="button"
          onClick={approve}
          disabled={pending || !eligible}
          className="btn-primary"
          title={eligible ? undefined : 'Resolve all blockers first'}
        >
          {pending ? 'Approving…' : 'Grant Ready to Start'}
        </button>
      )}
      {!eligible && canApprove ? (
        <p className="mt-2 text-xs text-steel-500">Approval unlocks when every blocker below is cleared.</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-3 rounded-md bg-status-blocked/10 px-3 py-2 text-sm text-status-blocked">
          {error}
        </p>
      ) : null}
    </div>
  );
}
