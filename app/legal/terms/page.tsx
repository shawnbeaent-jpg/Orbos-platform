import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms governing use of the GA Land Clearing website.",
  alternates: { canonical: "/legal/terms" },
};

export default function Terms() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms of Service" showCtas={false} breadcrumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <article className="container-page prose-scope max-w-3xl space-y-6 py-14 text-brandslate">
        <p className="text-sm">Last updated: {new Date().getFullYear()}. This is a general template and should be reviewed by legal counsel before launch.</p>
        <Section title="Use of this website">
          This website provides information about GA Land Clearing&apos;s services and lets you request quotes and site
          assessments. By using it, you agree to provide accurate information and to use the site lawfully.
        </Section>
        <Section title="No binding quote or contract">
          Submitting a request does not create a contract. Any scope, pricing, or schedule becomes binding only through a
          separate written agreement signed by both parties. Information on this site is provided for general guidance and
          may change without notice.
        </Section>
        <Section title="Service model">
          {site.modelDisclosure}
        </Section>
        <Section title="No professional advice">
          Content on this site is not engineering, legal, or permitting advice. Permitting requirements are set by local
          authorities; confirm them with the appropriate agency or your engineer.
        </Section>
        <Section title="Limitation of liability">
          To the fullest extent permitted by law, GA Land Clearing is not liable for indirect or consequential damages
          arising from use of this website. The website is provided &quot;as is&quot; without warranties of any kind.
        </Section>
        <Section title="Contact">
          Questions about these terms? Email <a href={`mailto:${site.email}`} className="underline">{site.email}</a>.
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
