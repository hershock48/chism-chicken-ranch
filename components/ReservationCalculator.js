"use client";

import { useState } from "react";
import Link from "next/link";
import { site, reserveOptions, estimate } from "@/lib/site";

const money = (n) =>
 n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// Estimates round to the dollar. Cents on a figure that swings by ten dollars
// is false precision, and the range has to fit a phone.
const rough = (n) => `$${Math.round(n)}`;
const range = (a, b) =>
 Math.round(a) === Math.round(b) ? rough(a) : `${rough(a)}–${rough(b)}`;

// This estimator renders on the home page AND on /how-it-works, and it used to
// carry its own copy of the arithmetic. Two implementations of one sum across
// three rendered surfaces, all reading a single 4.5 lb average that applied to
// neither size of bird. It now calls the same estimate() as the reserve page,
// so a number quoted here cannot disagree with the number quoted at checkout.
export default function ReservationCalculator() {
 const { deposit, perPound } = site.pricing;
 const [birds, setBirds] = useState(4);
 const [optionId, setOptionId] = useState(reserveOptions[0].id);

 const selected = reserveOptions.find((o) => o.id === optionId);
 const est = estimate(selected, birds);
 const depositDue = est.depositDue;

 return (
 <div className="overflow-hidden rounded-2xl bg-cream shadow-soft ring-1 ring-ink/[0.06]">
 <div className="bg-barn px-6 py-5 text-cream">
 <h3 className="font-serif text-2xl font-semibold text-cream">
 Reservation Estimator
 </h3>
 <p className="mt-1 text-sm text-cream/85">
 See your deposit and a ballpark total before you reserve.
 </p>
 </div>

 <div className="px-6 py-6">
 <fieldset>
 <legend className="text-sm font-semibold text-ink">Which size?</legend>
 <div className="mt-2 grid grid-cols-2 gap-2">
 {reserveOptions.map((o) => {
 const active = o.id === optionId;
 return (
 <button
 key={o.id}
 type="button"
 onClick={() => setOptionId(o.id)}
 aria-pressed={active}
 className={`rounded-xl border-2 px-3 py-2 text-left transition-colors ${
 active ? "border-terracotta bg-terracotta/5" : "border-ink/10 hover:border-ink/25"
 }`}
 >
 <span className="block font-serif text-base font-semibold text-ink">{o.name}</span>
 <span className="block text-[11px] font-bold uppercase tracking-wider text-terracotta">
 {o.weight}
 </span>
 </button>
 );
 })}
 </div>
 </fieldset>

 <label className="mt-5 flex items-center justify-between text-sm font-semibold text-ink">
 <span>How many birds?</span>
 <span className="rounded-full bg-paper-dark px-3 py-0.5 font-serif text-lg text-terracotta">
 {birds}
 </span>
 </label>

 <input
 type="range"
 min="1"
 max="50"
 value={birds}
 onChange={(e) => setBirds(Number(e.target.value))}
 className="mt-3 w-full accent-terracotta"
 aria-label="Number of birds"
 />

 <div className="mt-2 flex items-center gap-2">
 {[2, 4, 6, 10, 20].map((n) => (
 <button
 key={n}
 onClick={() => setBirds(n)}
 className={`rounded-full px-3 py-0.5 text-xs font-bold transition-colors ${
 birds === n ? "bg-terracotta text-cream" : "bg-paper-dark text-ink hover:bg-wheat-light"
 }`}
 >
 {n}
 </button>
 ))}
 </div>

 <dl className="mt-6 space-y-3">
 <Row label="Deposit due now" sub={`${money(deposit)} per bird · non-refundable`} value={money(depositDue)} highlight />
 <Row label="Estimated weight" sub={`${selected.minWeight}–${selected.maxWeight} lb per bird after butcher`} value={`${est.weight.min}–${est.weight.max} lb`} />
 <Row label="Estimated total" sub={`~${money(perPound)} per lb`} value={range(est.total.min, est.total.max)} />
 <Row label="Balance at pickup" sub="Total minus your deposit" value={range(est.balance.min, est.balance.max)} />
 </dl>

 <p className="mt-4 text-xs leading-relaxed text-ink-soft">
 Estimates only, final price is by actual weight at pickup. Birds are
 sorted by size after processing, so yours will land somewhere in that
 range. Deposits reserve your birds and cover chicks &amp; starter feed.
 </p>

 <Link href="/reserve" className="btn-primary mt-5 w-full">
 Reserve {birds} {birds === 1 ? "bird" : "birds"} →
 </Link>
 </div>
 </div>
 );
}

function Row({ label, sub, value, highlight }) {
 return (
 <div className={`flex items-end justify-between gap-4 rounded-xl px-4 py-3 ${highlight ? "bg-wheat/25 ring-1 ring-wheat" : "bg-paper"}`}>
 <dt>
 <span className="block text-sm font-semibold text-ink">{label}</span>
 <span className="block text-xs text-ink-soft">{sub}</span>
 </dt>
 <dd className="font-serif text-xl font-semibold text-ink">{value}</dd>
 </div>
 );
}
