"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/lib/site";

const money = (n) =>
 n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function ReservationCalculator() {
 const { deposit, perPound, avgWeight } = site.pricing;
 const [birds, setBirds] = useState(4);

 const depositDue = birds * deposit;
 const estWeight = birds * avgWeight;
 const estTotal = estWeight * perPound;
 const balance = Math.max(estTotal - depositDue, 0);

 return (
 <div className="overflow-hidden rounded-2xl bg-cream shadow-soft ring-1 ring-ink/[0.06]">
 <div className="bg-barn px-6 py-5 text-cream">
 <h3 className="font-serif text-2xl font-semibold text-cream">
 Reservation Estimator
 </h3>
 <p className="mt-1 text-sm text-cream/70">
 See your deposit and a ballpark total before you reserve.
 </p>
 </div>

 <div className="px-6 py-6">
 <label className="flex items-center justify-between text-sm font-semibold text-ink">
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
 <Row label="Estimated weight" sub={`~${avgWeight} lb per bird after butcher`} value={`${estWeight.toFixed(1)} lb`} />
 <Row label="Estimated total" sub={`~${money(perPound)} per lb`} value={money(estTotal)} />
 <Row label="Balance at pickup" sub="Total minus your deposit" value={money(balance)} />
 </dl>

 <p className="mt-4 text-xs leading-relaxed text-ink-soft/70">
 Estimates only, final price is by actual weight at pickup. Deposits
 reserve your birds and cover chicks &amp; starter feed.
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
 <span className="block text-xs text-ink-soft/70">{sub}</span>
 </dt>
 <dd className="font-serif text-xl font-semibold text-ink">{value}</dd>
 </div>
 );
}
