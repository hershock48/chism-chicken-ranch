import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import ReserveStore from "@/components/ReserveStore";
import { images, site, round, reserveOptions } from "@/lib/site";

export const metadata = {
 title: "Reserve Your Birds",
 description:
 "Pre-order pasture-raised chicken from Chism Chicken Ranch for pickup in early October. Pay your $6.50-per-bird deposit by card, then pay the balance by actual weight at pickup.",
 alternates: { canonical: "/reserve" },
};

const steps = [
 { n: "1", t: "Pay your deposit", d: "A $6.50-per-bird deposit reserves your birds and starts them from the hatchery." },
 { n: "2", t: "We raise them", d: "Small-batch, on pasture, Non-GMO fed, humanely butchered at ~8 weeks." },
 { n: "3", t: "Pick up & pay balance", d: "Collect your birds fresh and pay the remaining ~$6.50/lb by actual weight." },
];

export default function ReservePage() {
 // The eyebrow used to read `new Date().getFullYear() + 1`, which printed
 // "taking orders for 2027" on a page selling birds for this October, and
 // printed it from the build rather than from today. Both halves wrong. It
 // reads from the round constant now.
 return (
 <>
 <PageHeader
 eyebrow={`round ${round.number} · pickup ${round.pickupShort}`}
 title="Reserve your"
 accent="birds"
 subtitle={`Pre-order pasture-raised chicken for pickup ${round.pickupWindow}. Choose your size, see what it will cost, and hold your birds with a deposit.`}
 image={images.hero}
 />

 <div className="section py-16">
 <div className="reveal">
 <ReserveStore />
 </div>

 {/* How the deposit works */}
 <div className="mt-14 grid gap-6 sm:grid-cols-3">
 {steps.map((s) => (
 <div key={s.n} className="reveal flex gap-4">
 <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-terracotta font-serif text-sm font-bold text-cream">
 {s.n}
 </span>
 <div>
 <h3 className="font-serif text-lg font-semibold text-ink">{s.t}</h3>
 <p className="mt-1 text-sm leading-relaxed text-ink-soft">{s.d}</p>
 </div>
 </div>
 ))}
 </div>

 {/* Reassurance / alternatives */}
 <div className="reveal mt-12 rounded-2xl border border-ink/10 bg-cream p-6 text-sm leading-relaxed text-ink-soft sm:p-8">
 <p>
 <strong className="font-semibold text-ink">Good to know:</strong> the
 deposit is non-refundable, we use it to buy your chicks and their
 starter feed. Final price is by actual weight at pickup. Broilers run{" "}
 {reserveOptions[0].weight} dressed and roasters {reserveOptions[1].weight},
 so at ${site.pricing.perPound.toFixed(2)} a pound a single bird works out
 somewhere between $
 {Math.round(reserveOptions[0].minWeight * site.pricing.perPound)} and $
 {Math.round(reserveOptions[1].maxWeight * site.pricing.perPound)}.
 {round.pickupConfirmed
 ? ""
 : " Pickup is planned for " +
 round.pickupWindow +
 ", and we will call you with the exact date once processing is scheduled."}{" "}
 Prefer to pay another way?{" "}
 <Link href="/contact" className="font-semibold text-terracotta hover:underline">
 Message us
 </Link>{" "}
 or{" "}
 <a href={site.venmo} target="_blank" rel="noopener noreferrer" className="font-semibold text-terracotta hover:underline">
 pay by Venmo
 </a>
 .
 </p>
 {/* This page is where the hero's main call to action lands, and it had no
     route to wholesale at all: the old copy above mentioned buying in bulk
     for a restaurant or farm store and then sent those people to a contact
     form, past the page built for them. Split out and pointed at
     /wholesale, since a buyer who has read this far is exactly the one the
     client did not want sifting through retail. */}
 <p className="mt-4 border-t border-ink/10 pt-4">
 Buying in bulk for a restaurant, farm store or co-op?{" "}
 <Link href="/wholesale" className="font-semibold text-terracotta hover:underline">
 See wholesale pricing and volumes
 </Link>
 .
 </p>
 </div>
 </div>
 </>
 );
}
