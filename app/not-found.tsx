import Link from "next/link";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container-page max-w-xl text-center">
        <p className="font-heading text-6xl font-bold text-forest">404</p>
        <h1 className="mt-4 text-3xl font-bold text-midnight">This ground hasn&apos;t been cleared yet</h1>
        <p className="mt-3 text-brandslate">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn-ghost">Back to home</Link>
          <Link href="/request-quote" className="btn-primary">Request a quote <Icon name="arrow" className="h-4 w-4" /></Link>
        </div>
      </div>
    </section>
  );
}
