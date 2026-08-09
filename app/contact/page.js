import PageHeader from "@/components/PageHeader";
import ContactForm from "@/components/ContactForm";
import { site, images } from "@/lib/site";

export const metadata = {
  title: "Reserve / Contact",
  description:
    "Buying for your family, a restaurant, or a farm store? Send us a message, pay by Venmo, or connect on social media.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="let's talk"
        title="Reserve &"
        accent="Contact"
        subtitle="Buying for your family, a restaurant, or a farm store? Send us a note and we'll be in touch quickly."
        image={images.pasture}
      />

      <div className="section grid gap-10 py-16 lg:grid-cols-[1.3fr_1fr]">
        <div className="reveal">
          <ContactForm />
        </div>

        <aside className="reveal space-y-5">
          <div className="card p-6">
            <h3 className="font-serif text-xl font-semibold text-ink">Prefer to reach out directly?</h3>
            <div className="mt-4 space-y-3">
              <a href={site.venmo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-xl bg-[#0070CF] px-5 py-4 font-semibold text-white transition-transform hover:-translate-y-0.5">
                Pay / Reserve with Venmo <span aria-hidden>→</span>
              </a>
              <a href={`mailto:${site.email}`} className="flex items-center justify-between rounded-xl bg-paper-dark px-5 py-4 font-semibold text-ink transition-colors hover:bg-wheat/40">
                Email us <span aria-hidden>→</span>
              </a>
            </div>
            <div className="mt-5 border-t border-ink/10 pt-5">
              <p className="text-sm font-semibold text-ink">Find us</p>
              <p className="mt-1 text-sm text-ink-soft">{site.location}<br />{site.region}</p>
            </div>
            <div className="mt-5 flex gap-3">
              <Social href={site.socials.facebook} label="Facebook"><path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5H14z" /></Social>
              <Social href={site.socials.instagram} label="Instagram"><path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5zm0 2A1.5 1.5 0 1 1 12 13.5 1.5 1.5 0 0 1 12 10.5zM16.5 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7z" /></Social>
              <Social href={site.socials.youtube} label="YouTube"><path d="M21 8.5c-.2-1.1-.9-1.9-2-2.1C17.2 6 12 6 12 6s-5.2 0-7 .4c-1.1.2-1.8 1-2 2.1C3 10.3 3 12 3 12s0 1.7.2 3.5c.2 1.1.9 1.9 2 2.1 1.8.4 7 .4 7 .4s5.2 0 7-.4c1.1-.2 1.8-1 2-2.1.2-1.8.2-3.5.2-3.5s0-1.7-.4-3.5zM10 15V9l5 3-5 3z" /></Social>
            </div>
          </div>

          <div className="rounded-2xl bg-wheat/25 p-6 ring-1 ring-wheat/50">
            <p className="font-serif text-lg font-semibold text-ink">A $6.50 deposit per bird holds your spot.</p>
            <p className="mt-2 text-sm text-ink-soft">Once we receive your message, we&apos;ll reach out to confirm details and secure your reservation for the next batch.</p>
          </div>
        </aside>
      </div>
    </>
  );
}

function Social({ href, label, children }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full bg-barn text-cream transition-colors hover:bg-terracotta">
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">{children}</svg>
    </a>
  );
}
