import { z } from 'zod';
import { uuid } from './common';

/** Final Ready-to-Start approval request. The server re-checks all gate conditions. */
export const approveReadinessSchema = z.object({
  projectId: uuid,
});

export type ApproveReadinessInput = z.infer<typeof approveReadinessSchema>;

/** Toggle a readiness checklist item. */
export const checklistToggleSchema = z.object({
  projectId: uuid,
  checklistKey: z.string().trim().min(1).max(80),
  completed: z.boolean(),
  notes: z.string().trim().max(1000).optional().default(''),
});

export type ChecklistToggleInput = z.infer<typeof checklistToggleSchema>;
