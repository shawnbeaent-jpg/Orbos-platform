import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "GA Land Clearing's commitment to an accessible website (WCAG 2.2 AA).",
  alternates: { canonical: "/legal/accessibility" },
};

export default function Accessibility() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Accessibility Statement" showCtas={false} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Accessibility" }]} />
      <article className="container-page prose-scope max-w-3xl space-y-6 py-14 text-brandslate">
        <Section title="Our commitment">
          GA Land Clearing is committed to making this website usable for everyone, including people with disabilities. We
          aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 Level AA.
        </Section>
        <Section title="What we've done">
          The site uses semantic HTML, keyboard-navigable controls, visible focus indicators, sufficient color contrast,
          descriptive labels on form fields, alternative text for meaningful graphics, and a skip-to-content link.
        </Section>
        <Section title="Ongoing effort">
          Accessibility is an ongoing effort. As we add project photography and new features, we continue testing with
          assistive technologies and refining the experience.
        </Section>
        <Section title="Feedback">
          If you encounter an accessibility barrier, please tell us so we can fix it. Email{" "}
          <a href={`mailto:${site.email}`} className="underline">{site.email}</a> or call{" "}
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
