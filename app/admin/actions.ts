"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { LEAD_STAGES } from "@/lib/admin";

async function audit(action: string, entityId: string, detail: Record<string, unknown>) {
  try {
    await prisma.auditLog.create({
      data: { actor: "admin", action, entity: "Lead", entityId, detail: JSON.stringify(detail) },
    });
  } catch {
    /* audit is best-effort */
  }
}

export async function updateStage(formData: FormData) {
  const id = String(formData.get("id"));
  const stage = String(formData.get("stage"));
  if (!id || !LEAD_STAGES.includes(stage as (typeof LEAD_STAGES)[number])) return;
  await prisma.lead.update({ where: { id }, data: { stage: stage as (typeof LEAD_STAGES)[number] } });
  await audit("stage_change", id, { stage });
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function overrideScore(formData: FormData) {
  const id = String(formData.get("id"));
  const raw = formData.get("scoreOverride");
  const val = raw === "" || raw == null ? null : Math.max(0, Math.min(100, Number(raw)));
  if (Number.isNaN(val as number)) return;
  await prisma.lead.update({ where: { id }, data: { scoreOverride: val } });
  await audit("score_override", id, { scoreOverride: val });
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function addNote(formData: FormData) {
  const id = String(formData.get("id"));
  const body = String(formData.get("body") || "").trim();
  if (!id || !body) return;
  await prisma.leadNote.create({ data: { leadId: id, author: "admin", body } });
  await audit("note_added", id, { body });
  revalidatePath(`/admin/leads/${id}`);
}

export async function toggleTask(formData: FormData) {
  const taskId = String(formData.get("taskId"));
  const leadId = String(formData.get("leadId"));
  const done = String(formData.get("done")) === "true";
  if (!taskId) return;
  await prisma.leadTask.update({ where: { id: taskId }, data: { done: !done } });
  revalidatePath(`/admin/leads/${leadId}`);
}
