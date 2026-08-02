// Notification layer (spec §13). Email/SMS are sent through providers that
// require API keys. When keys are absent (e.g. local/dev or pre-launch), these
// degrade to a no-op that logs intent — the app never crashes for a missing key,
// and no message is ever sent without a configured provider + consent.
import { site } from "./site";

type LeadSummary = {
  publicId: string;
  name: string;
  email: string;
  phone: string;
  score: number;
  category: string;
  services: string[];
  city?: string | null;
  smsConsent: boolean;
};

export async function sendLeadEmails(lead: LeadSummary) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[notify] RESEND_API_KEY not set — skipping emails for ${lead.publicId}`);
    return { confirmationSent: false, internalSent: false, reason: "no-provider" };
  }
  try {
    // Confirmation to the prospect + internal alert to the team.
    const from = `${site.name} <noreply@${new URL(site.url).hostname}>`;
    const send = (payload: Record<string, unknown>) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

    await send({
      from,
      to: lead.email,
      subject: `We received your request — ${lead.publicId}`,
      text: `Hi ${lead.name},\n\nThanks for reaching out to ${site.name}. Your request (${lead.publicId}) is in and we'll follow up shortly to schedule your site assessment.\n\n${site.phoneDisplay}\n${site.name}`,
    });
    await send({
      from,
      to: process.env.LEAD_INBOX || site.email,
      subject: `New ${lead.category} lead ${lead.publicId} (score ${lead.score})`,
      text: `New lead ${lead.publicId}\nName: ${lead.name}\nPhone: ${lead.phone}\nEmail: ${lead.email}\nCity: ${lead.city ?? "—"}\nServices: ${lead.services.join(", ") || "—"}\nScore: ${lead.score} (${lead.category})`,
    });
    return { confirmationSent: true, internalSent: true };
  } catch (err) {
    console.error("[notify] email send failed", err);
    return { confirmationSent: false, internalSent: false, reason: "send-error" };
  }
}

export async function sendLeadSms(lead: LeadSummary) {
  // Consent is mandatory before any SMS (spec §13).
  if (!lead.smsConsent) return { sent: false, reason: "no-consent" };
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM;
  if (!sid || !token || !from) {
    console.info(`[notify] Twilio not configured — skipping SMS for ${lead.publicId}`);
    return { sent: false, reason: "no-provider" };
  }
  try {
    const body = new URLSearchParams({
      To: lead.phone,
      From: from,
      Body: `${site.name}: we received your request ${lead.publicId} and will follow up shortly. Reply STOP to opt out.`,
    });
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
    });
    return { sent: true };
  } catch (err) {
    console.error("[notify] sms send failed", err);
    return { sent: false, reason: "send-error" };
  }
}
