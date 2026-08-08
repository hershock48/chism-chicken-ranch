"use client";

import { useState } from "react";

const initial = {
 business: "",
 name: "",
 email: "",
 phone: "",
 operationType: "Restaurant",
 volume: "",
 timeline: "This spring",
 message: "",
 consent: false,
};

export default function WholesaleForm() {
 const [form, setForm] = useState(initial);
 const [status, setStatus] = useState("idle");
 const [error, setError] = useState("");

 const update = (key) => (e) => {
 const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
 setForm((f) => ({ ...f, [key]: value }));
 };

 async function onSubmit(e) {
 e.preventDefault();
 setStatus("sending");
 setError("");
 try {
 const res = await fetch("/api/contact", {
 method: "POST",
 headers: { "Content-Type": "application/json" },
 body: JSON.stringify({ ...form, interest: "Wholesale / partner" }),
 });
 const data = await res.json();
 if (!res.ok) throw new Error(data.error || "Something went wrong.");
 setStatus("success");
 setForm(initial);
 } catch (err) {
 setStatus("error");
 setError(err.message);
 }
 }

 if (status === "success") {
 return (
 <div className="card p-8 text-center">
 <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-barn text-cream">
 <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none">
 <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
 </svg>
 </div>
 <h3 className="mt-4 display text-3xl text-ink">Thanks, let&apos;s talk.</h3>
 <p className="mt-2 text-ink-soft">
 We&apos;ve got your wholesale inquiry and will reach out to discuss
 volume, pricing, and timing. Talk soon.
 </p>
 <button onClick={() => setStatus("idle")} className="btn-secondary mt-6">
 Send another
 </button>
 </div>
 );
 }

 return (
 <form onSubmit={onSubmit} className="card space-y-5 p-6 sm:p-8">
 <Field label="Business / operation name" required>
 <input type="text" required value={form.business} onChange={update("business")} className={input} placeholder="e.g. Blight Farms" />
 </Field>

 <div className="grid gap-5 sm:grid-cols-2">
 <Field label="Your name" required>
 <input type="text" required value={form.name} onChange={update("name")} className={input} placeholder="Jane Doe" />
 </Field>
 <Field label="Phone" required>
 <input type="tel" required value={form.phone} onChange={update("phone")} className={input} placeholder="(269) 555-0123" />
 </Field>
 </div>

 <Field label="Email" required>
 <input type="email" required value={form.email} onChange={update("email")} className={input} placeholder="you@business.com" />
 </Field>

 <div className="grid gap-5 sm:grid-cols-2">
 <Field label="Type of operation">
 <select value={form.operationType} onChange={update("operationType")} className={input}>
 <option>Restaurant</option>
 <option>Farm store / stand</option>
 <option>Grocery / market</option>
 <option>Distributor / wholesaler</option>
 <option>Butcher shop</option>
 <option>Co-op / buying club</option>
 <option>Other</option>
 </select>
 </Field>
 <Field label="Target timeline">
 <select value={form.timeline} onChange={update("timeline")} className={input}>
 <option>This spring</option>
 <option>This summer</option>
 <option>This year</option>
 <option>Just exploring</option>
 </select>
 </Field>
 </div>

 <Field label="Estimated volume (optional)">
 <input type="text" value={form.volume} onChange={update("volume")} className={input} placeholder="e.g. ~50 birds / month, or 200 for the season" />
 </Field>

 <Field label="Tell us about your needs" required>
 <textarea required rows={4} value={form.message} onChange={update("message")} className={`${input} resize-none`} placeholder="What you're looking for, sizes, packaging, pickup or delivery, etc." />
 </Field>

 <label className="flex items-start gap-3 text-sm text-ink-soft">
 <input type="checkbox" checked={form.consent} onChange={update("consent")} className="mt-0.5 h-5 w-5 rounded accent-terracotta" />
 <span>I&apos;d like to receive occasional updates from Chism Chicken Ranch.</span>
 </label>

 {status === "error" && (
 <p className="rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">{error}</p>
 )}

 <button type="submit" disabled={status === "sending"} className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60">
 {status === "sending" ? "Sending…" : "Send wholesale inquiry"}
 </button>
 </form>
 );
}

const input =
 "w-full rounded-xl border border-ink/15 bg-cream px-4 py-3 text-ink outline-none transition-colors placeholder:text-ink-soft/40 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20";

function Field({ label, required, children }) {
 return (
 <label className="block">
 <span className="mb-1.5 block text-sm font-semibold text-ink">
 {label}
 {required && <span className="text-terracotta"> *</span>}
 </span>
 {children}
 </label>
 );
}
