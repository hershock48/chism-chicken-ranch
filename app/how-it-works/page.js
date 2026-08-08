import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ReservationCalculator from "@/components/ReservationCalculator";
import { images } from "@/lib/site";

export const metadata = {
 title: "How It Works",
 description:
 "Reserve your pasture-raised chickens from CCR in a few simple steps, pre-purchase with a deposit, then pick up fresh or ask about delivery.",
 alternates: { canonical: "/how-it-works" },
};

const steps = [
 { title: "Contact us", body: "Fill out the contact form to let us know you're interested. We'll reach right back to secure your spot and deposit." },
 { title: "Pre-purchase your birds", body: "Reserve for spring and summer with a $6.50-per-bird deposit. It starts your bird from the hatchery and guarantees your place in our next batch." },
 { title: "Small-batch care", body: "We raise our birds in small batches, from their first days in the brooder to their time on pasture, so each one gets real attention." },
 { title: "Pasture-raised excellence", body: "Out on pasture, the birds roam in fresh air and sunshine with Non-GMO feed, clean water, and plenty of room to peck and scratch." },
 { title: "Humane butchering", body: "Around 8 weeks, the birds are humanely butchered. We handle transport so the process is stress-free for you and the birds." },
 { title: "Pickup or delivery", body: "Come collect your birds packaged and ready to freeze or refrigerate, or ask us about delivery. Fresh, local, and convenient." },
 { title: "Pay by weight", body: "At pickup you pay the remaining balance, about $6.50 per pound (roughly $28 per bird), for exceptional value on truly pasture-raised poultry." },
];

export default function HowItWorksPage() {
 return (
 <>
 <PageHeader
 eyebrow="reserve your birds"
 title="How it"
 accent="works"
 subtitle="From first inquiry to a freezer full of wholesome poultry, here's the whole journey, step by step."
 image={images.howItWorks}
 />

 <div className="section grid gap-12 py-16 lg:grid-cols-[1.4fr_1fr]">
 <ol className="relative space-y-8 border-l-2 border-wheat pl-8">
 {steps.map((s, i) => (
 <li key={s.title} className="reveal relative">
 <span className="absolute -left-[42px] grid h-8 w-8 place-items-center rounded-full bg-terracotta font-serif text-sm font-bold text-cream ring-4 ring-paper">
 {i + 1}
 </span>
 <h3 className="font-serif text-xl font-semibold text-ink">{s.title}</h3>
 <p className="mt-1.5 leading-relaxed text-ink-soft">{s.body}</p>
 </li>
 ))}
 </ol>

 <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
 <ReservationCalculator />
 <div className="rounded-2xl border border-terracotta/25 bg-terracotta/5 p-5 text-sm leading-relaxed text-terracotta-dark">
 <strong className="font-semibold">Please note:</strong> the deposit is
 non-refundable. We use it to purchase your birds from the hatchery and
 the feed to get them started.
 </div>
 <Link href="/reserve" className="btn-primary w-full">Start your reservation →</Link>
 </div>
 </div>
 </>
 );
}
