"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site, reserveOptions } from "@/lib/site";

const money = (n) =>
 n.toLocaleString("en-US", { style: "currency", currency: "USD" });

export default function ReserveStore() {
 const { deposit, perPound, avgWeight } = site.pricing;
 const [option, setOption] = useState(reserveOptions[0].id);
 const [qty, setQty] = useState(2);
 const [status, setStatus] = useState("idle"); // idle | loading | fallback | error | success
 const [error, setError] = useState("");

 useEffect(() => {
 if (typeof window !== "undefined" && window.location.search.includes("status=success")) {
 setStatus("success");
 }
 }, []);

 // If the user changes their selection, clear any fallback/error so they can retry.
 useEffect(() => {
 setStatus((s) => (s === "fallback" || s === "error" ? "idle" : s));
 }, [option, qty]);

 const selected = reserveOptions.find((o) => o.id === option);
 const depositDue = qty * deposit;
 const estWeight = qty * avgWeight;
 const estTotal = estWeight * perPound;
 const balance = Math.max(estTotal - depositDue, 0);

 async function checkout() {
 setStatus("loading");
 setError("");
 try {
 const res = await fetch("/api/checkout", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ optionName: selected.name, quantity: qty }),
 });
 const data = await res.json();
 if (data.configured === false) {
 setStatus("fallback");
 return;
 }
 if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed.");
 window.location.href = data.url;
 } catch (err) {
 setStatus("error");
 setError(err.message);
 }
 }

 if (status === "success") {
 return (
 <div className="rounded-2xl bg-cream p-8 text-center shadow-soft ring-1 ring-ink/[0.06]">
 <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-barn text-cream">
 <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
 <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 </div>
 <h2 className="mt-4 display text-3xl text-ink">Deposit received, thank you!</h2>
 <p className="mt-2 text-ink-soft">
 Your birds are reserved for the next batch. We&apos;ll be in touch with
 pickup details as the season gets closer. You&apos;ll pay the balance by
 weight at pickup.
 </p>
 <Link href="/" className="btn-secondary mt-6">Back to home</Link>
 </div>
 );
 }

 return (
 <div className="overflow-hidden rounded-2xl bg-cream shadow-soft ring-1 ring-ink/[0.06]">
 <div className="grid lg:grid-cols-2">
 {/* Configure */}
 <div className="p-6 sm:p-8">
 <h2 className="font-serif text-2xl font-semibold text-ink">
 Reserve pasture-raised chicken
 </h2>
 <p className="mt-1 text-sm text-ink-soft">
 Choose your size and how many birds. A {money(deposit)} deposit per
 bird holds your spot for the next batch.
 </p>

 <fieldset className="mt-6">
 <legend className="text-sm font-semibold text-ink">Choose a size</legend>
 <div className="mt-3 grid gap-3 sm:grid-cols-2">
 {reserveOptions.map((o) => {
 const active = o.id === option;
 return (
 <button
 key={o.id}
 type="button"
 onClick={() => setOption(o.id)}
 aria-pressed={active}
 className={`rounded-xl border-2 p-4 text-left transition-colors ${
 active
 ? "border-terracotta bg-terracotta/5"
 : "border-ink/10 hover:border-ink/25"
 }`}
 >
 <span className="flex items-center justify-between">
 <span className="font-serif text-lg font-semibold text-ink">{o.name}</span>
 <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${active ? "border-terracotta bg-terracotta" : "border-ink/25"}`}>
 {active && <span className="h-2 w-2 rounded-full bg-cream" />}
 </span>
 </span>
 <span className="mt-0.5 block text-xs font-bold uppercase tracking-wider text-terracotta">
 {o.weight}
 </span>
 <span className="mt-1 block text-xs text-ink-soft">{o.desc}</span>
 </button>
 );
 })}
 </div>
 </fieldset>

 <div className="mt-6">
 <label className="text-sm font-semibold text-ink">How many birds?</label>
 <div className="mt-3 flex items-center gap-3">
 <Stepper value={qty} setValue={setQty} />
 <div className="flex flex-wrap gap-2">
 {[2, 4, 6, 10].map((n) => (
 <button
 key={n}
 type="button"
 onClick={() => setQty(n)}
 className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
 qty === n ? "bg-terracotta text-cream" : "bg-paper-dark text-ink hover:bg-wheat-light"
 }`}
 >
 {n}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>

 {/* Summary */}
 <div className="border-t border-ink/10 bg-paper p-6 sm:p-8 lg:border-l lg:border-t-0">
 <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-ink-soft">Order summary</h3>
 <p className="mt-2 font-serif text-lg text-ink">
 {qty} × {selected.name}{" "}
 <span className="text-ink-soft">({selected.weight})</span>
 </p>

 <dl className="mt-5 space-y-3 text-sm">
 <Row label="Deposit due now" sub="Non-refundable · secures your birds" value={money(depositDue)} highlight />
 <Row label="Est. weight" sub={`~${avgWeight} lb per bird`} value={`${estWeight.toFixed(1)} lb`} />
 <Row label="Est. total" sub={`~${money(perPound)}/lb`} value={money(estTotal)} />
 <Row label="Balance at pickup" sub="Paid by actual weight" value={money(balance)} />
 </dl>

 {status === "error" && (
 <p className="mt-4 rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
 {error}
 </p>
 )}

 {status === "fallback" ? (
 <div className="mt-5 rounded-xl border border-ink/10 bg-cream p-4 text-sm text-ink-soft">
 <p className="font-semibold text-ink">Card checkout is being set up.</p>
 <p className="mt-1">
 For now, send your {money(depositDue)} deposit by Venmo, then
 message us with your order so we can confirm.
 </p>
 <div className="mt-3 flex flex-wrap gap-2">
 <a href={site.venmo} target="_blank" rel="noopener noreferrer" className="btn-venmo">Pay {money(depositDue)} by Venmo</a>
 <Link href="/contact" className="btn-secondary">Message us</Link>
 </div>
 </div>
 ) : (
 <button
 type="button"
 onClick={checkout}
 disabled={status === "loading"}
 className="btn-primary mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60"
 >
 {status === "loading" ? "Starting checkout…" : `Reserve & pay ${money(depositDue)} deposit`}
 </button>
 )}

 <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-soft">
 <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
 <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
 </svg>
 Secure checkout powered by Square
 </p>
 </div>
 </div>
 </div>
 );
}

function Stepper({ value, setValue }) {
 const clamp = (n) => Math.max(1, Math.min(50, n));
 return (
 <div className="inline-flex items-center rounded-full border-2 border-ink/15">
 <button type="button" aria-label="Decrease" onClick={() => setValue((v) => clamp(v - 1))} className="grid h-10 w-10 place-items-center text-lg text-ink hover:text-terracotta">−</button>
 <input
 type="number"
 min="1"
 max="50"
 value={value}
 onChange={(e) => setValue(clamp(Number(e.target.value) || 1))}
 className="w-12 border-0 bg-transparent text-center font-serif text-lg font-semibold text-ink outline-none"
 aria-label="Number of birds"
 />
 <button type="button" aria-label="Increase" onClick={() => setValue((v) => clamp(v + 1))} className="grid h-10 w-10 place-items-center text-lg text-ink hover:text-terracotta">+</button>
 </div>
 );
}

function Row({ label, sub, value, highlight }) {
 return (
 <div className={`flex items-end justify-between gap-4 rounded-xl px-4 py-3 ${highlight ? "bg-wheat/25 ring-1 ring-wheat" : "bg-cream"}`}>
 <dt>
 <span className="block font-semibold text-ink">{label}</span>
 <span className="block text-xs text-ink-soft/70">{sub}</span>
 </dt>
 <dd className="font-serif text-xl font-semibold text-ink">{value}</dd>
 </div>
 );
}
