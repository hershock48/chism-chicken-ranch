import PageHeader from "@/components/PageHeader";
import WholesaleForm from "@/components/WholesaleForm";
import { images, partners } from "@/lib/site";

export const metadata = {
 title: "Wholesale & Partners",
 description:
 "Wholesale pasture-raised poultry for restaurants, farm stores, and resellers in Southwest Michigan and Chicago. Add local chicken to your lineup, start a wholesale inquiry.",
 alternates: { canonical: "/wholesale" },
};

const perks = [
 { title: "Consistent, small-batch supply", body: "We plan our batches around our partners, so you can count on pasture-raised poultry when you need it.", icon: <path d="M3 12h4l3 8 4-16 3 8h4" /> },
 { title: "A story your customers trust", body: "Pasture-raised, Non-GMO, no antibiotics or hormones, the kind of poultry that sells itself at the counter or on a menu.", icon: <path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 21l-4.9-2.9.9-5.5-4-3.9L9.5 8z" /> },
 { title: "Add poultry without raising it", body: "Raise beef or pork but not chicken? Offer your customers local pastured poultry without a single new coop.", icon: <><path d="M3 21h18M5 21V10l7-5 7 5v11" /><path d="M9 21v-6h6v6" /></> },
 { title: "Pickup or delivery", body: "We'll work out packaging, sizing, and whether you pick up or we deliver, whatever fits your operation.", icon: <><path d="M3 7h11v8H3zM14 10h4l3 3v2h-7z" /><circle cx="7" cy="17" r="1.6" /><circle cx="17" cy="17" r="1.6" /></> },
];

export default function WholesalePage() {
 return (
 <>
 <PageHeader
 eyebrow="for business"
 title="Wholesale &"
 accent="partners"
 subtitle="Restaurants, farm stores, and resellers, add pasture-raised, Non-GMO poultry to your lineup. Let's talk volume, timing, and pricing."
 image={images.coop}
 />

 {/* Perks */}
 <section className="section py-16">
 <div className="grid gap-6 sm:grid-cols-2">
 {perks.map((p) => (
 <div key={p.title} className="reveal flex gap-4 rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-ink/[0.06]">
 <span className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
 {p.icon}
 </svg>
 </span>
 <div>
 <h3 className="font-serif text-lg font-semibold text-ink">{p.title}</h3>
 <p className="mt-1 text-sm leading-relaxed text-ink-soft">{p.body}</p>
 </div>
 </div>
 ))}
 </div>
 </section>

 {/* Proof, current partners */}
 <section className="border-y border-ink/10 bg-paper-dark/40 py-16">
 <div className="section">
 <div className="reveal mx-auto max-w-2xl text-center">
 <span className="eyebrow justify-center">already on board</span>
 <h2 className="mt-3 display text-3xl sm:text-4xl">
 Partners already carrying our <span className="accent">poultry</span>
 </h2>
 </div>
 <div className="mt-8 grid gap-4 sm:grid-cols-3">
 {partners.map((p) => (
 <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-ink/[0.06] transition-transform hover:-translate-y-1">
 <p className="font-serif text-lg font-semibold text-ink">{p.name}</p>
 <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-terracotta">{p.kind}</p>
 <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.blurb}</p>
 <span className="mt-3 inline-block text-terracotta transition-transform group-hover:translate-x-1">Visit ↗</span>
 </a>
 ))}
 </div>
 </div>
 </section>

 {/* Inquiry form */}
 <section className="section py-16">
 <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
 <div className="reveal">
 <span className="eyebrow">let&apos;s talk</span>
 <h2 className="mt-3 display text-4xl sm:text-5xl">
 Start a wholesale <span className="accent">inquiry</span>
 </h2>
 <p className="mt-4 leading-relaxed text-ink-soft">
 Tell us a little about your operation and what you&apos;re looking
 for. We&apos;ll follow up to talk sizing, volume, pricing, and
 whether pickup or delivery works best.
 </p>
 <p className="mt-4 leading-relaxed text-ink-soft">
 Planning for spring? The earlier we hear from you, the better we
 can build your birds into our batch schedule.
 </p>
 </div>
 <div className="reveal">
 <WholesaleForm />
 </div>
 </div>
 </section>
 </>
 );
}
