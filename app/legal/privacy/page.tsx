import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How GA Land Clearing collects, uses, and protects your information.",
  alternates: { canonical: "/legal/privacy" },
};

export default function Privacy() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" showCtas={false} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <article className="container-page prose-scope max-w-3xl space-y-6 py-14 text-brandslate">
        <p className="text-sm">Last updated: {new Date().getFullYear()}. This is a general template and should be reviewed by legal counsel before launch.</p>
        <Section title="Information we collect">
          When you submit a quote or contact request, we collect the details you provide — such as your name, phone,
          email, property address, project details, and any files you attach. We also collect basic analytics and
          marketing attribution data (for example, UTM parameters and referring page).
        </Section>
        <Section title="How we use your information">
          We use your information to respond to your request, schedule and perform site assessments, prepare scopes and
          pricing, and follow up about your project. We do not sell your personal information.
        </Section>
        <Section title="Text messaging consent">
          We only send SMS messages if you explicitly opt in. You can opt out at any time by replying STOP. Message and
          data rates may apply.
        </Section>
        <Section title="Data sharing">
          We may share necessary project details with the qualified subcontractors and operators coordinated to perform
          your work, and with service providers that help us operate (such as email, hosting, and analytics). We require
          these parties to handle your information responsibly.
        </Section>
        <Section title="Data retention & security">
          We retain lead and project information as needed to operate our business and meet legal obligations, and we use
          reasonable safeguards to protect it. No method of transmission or storage is 100% secure.
        </Section>
        <Section title="Your choices">
          You may request access to, correction of, or deletion of your personal information by contacting us at{" "}
          <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
        </Section>
        <Section title="Contact">
          Questions about this policy? Email <a href={`mailto:${site.email}`} className="underline">{site.email}</a> or call{" "}
          <a href={`tel:${site.phoneE164}`} className="underline">{site.phoneDisplay}</a>.
        </Section>
      </article>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xl font-bold text-midnight">{title}</h2>
      <p className="mt-2 leading-relaxed">{children}</p>
    </section>
  );
}
