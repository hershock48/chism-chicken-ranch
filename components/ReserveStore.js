"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { site, reserveOptions, round, estimate } from "@/lib/site";

const money = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

// Estimates are rounded to the dollar. Showing "$104.00 to $143.00" implies a
// precision the birds do not have, and it does not fit a 320px screen.
const rough = (n) => `$${Math.round(n)}`;
const range = (a, b) => (Math.round(a) === Math.round(b) ? rough(a) : `${rough(a)}–${rough(b)}`);

export default function ReserveStore() {
  const [option, setOption] = useState(reserveOptions[0].id);
  const [qty, setQty] = useState(2);
  const [customer, setCustomer] = useState({ name: "", phone: "", email: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | fallback | error | success
  const [error, setError] = useState("");
  // Set when Square cannot be handed a computed amount, so the interface can
  // say so instead of promising a total the next screen will not show.
  const [handoff, setHandoff] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("status=success")) {
      setStatus("success");
    }
  }, []);

  // Changing the selection clears a previous failure so they can retry.
  useEffect(() => {
    setStatus((s) => (s === "fallback" || s === "error" ? "idle" : s));
  }, [option, qty]);

  const selected = reserveOptions.find((o) => o.id === option);
  const est = estimate(selected, qty);

  const set = (k) => (e) => setCustomer((c) => ({ ...c, [k]: e.target.value }));
  const canSubmit = customer.name.trim() && customer.phone.trim();

  async function checkout() {
    if (!canSubmit) {
      setStatus("error");
      setError("Please add your name and a phone number so we can reach you about pickup.");
      return;
    }
    setStatus("loading");
    setError("");

    // Record the reservation with the farm FIRST. If this fails we stop, because
    // a deposit the farm has no record of is worse than a checkout that did not
    // start. The customer can always be sent to pay; an anonymous payment cannot
    // be traced back to an order.
    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...customer,
          optionId: selected.id,
          optionName: selected.name,
          quantity: qty,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "We could not save your reservation.");
    } catch (err) {
      setStatus("error");
      setError(err.message);
      return;
    }

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ optionName: selected.name, quantity: qty, customer }),
      });
      const data = await res.json();
      if (data.configured === false) {
        setStatus("fallback");
        return;
      }
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout failed.");

      if (data.amountCarries === false) {
        // Do not silently drop them onto a page showing a different number.
        setHandoff({ url: data.url, perBird: data.perBird ?? site.pricing.deposit });
        setStatus("handoff");
        return;
      }
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
          Your birds are reserved for round {round.number}. We are planning pickup
          for {round.pickupWindow}
          {round.pickupConfirmed ? "" : ", and we will call you as soon as the date is set"}.
          You will pay the balance by actual weight when you collect them.
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
            Choose your size and how many birds. A {money(site.pricing.deposit)}{" "}
            deposit per bird holds your spot in round {round.number}.
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
            <p className="mt-2 text-xs text-ink-soft">
              Weights are after processing. Birds are sorted by size once they are
              dressed, so yours will land somewhere in that range.
            </p>
          </fieldset>

          <div className="mt-6">
            <label className="text-sm font-semibold text-ink" htmlFor="qty">How many birds?</label>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <Stepper value={qty} setValue={setQty} />
              <div className="flex flex-wrap gap-2">
                {[2, 4, 6, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setQty(n)}
                    aria-label={`${n} birds`}
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

          {/* Who to call about pickup. The date is not fixed yet, so this is not
              optional politeness, it is how the farm delivers what it just sold. */}
          <div className="mt-7 border-t border-ink/10 pt-6">
            <h3 className="text-sm font-semibold text-ink">Where do we reach you?</h3>
            <p className="mt-1 text-xs text-ink-soft">
              Pickup is {round.pickupWindow}. We will call with your exact date.
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <Field id="res-name" label="Your name" value={customer.name} onChange={set("name")} autoComplete="name" required />
              <Field id="res-phone" label="Phone" type="tel" value={customer.phone} onChange={set("phone")} autoComplete="tel" required />
              <div className="sm:col-span-2">
                <Field id="res-email" label="Email (optional)" type="email" value={customer.email} onChange={set("email")} autoComplete="email" />
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
            <Row label="Deposit due now" sub="Non-refundable · secures your birds" value={money(est.depositDue)} highlight />
            <Row label="Est. weight" sub={`${selected.minWeight}–${selected.maxWeight} lb per bird`} value={`${est.weight.min}–${est.weight.max} lb`} />
            <Row label="Est. total" sub={`~${money(site.pricing.perPound)}/lb`} value={range(est.total.min, est.total.max)} />
            <Row label="Balance at pickup" sub="Paid by actual weight" value={range(est.balance.min, est.balance.max)} />
          </dl>

          <p className="mt-3 text-xs leading-relaxed text-ink-soft">
            An estimate, not a quote. You pay for the actual weight of the birds
            you collect, so the final figure lands somewhere in that range.
          </p>

          {status === "error" && (
            <p role="alert" className="mt-4 rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
              {error}
            </p>
          )}

          {status === "handoff" ? (
            /* Square has no computed amount for this order. Say that plainly
               here rather than letting them discover it on the payment page. */
            <div className="mt-5 rounded-xl border-2 border-wheat bg-wheat/20 p-4 text-sm text-ink-soft">
              <p className="font-semibold text-ink">Your reservation is saved.</p>
              <p className="mt-1">
                One thing before you pay: Square will ask you to set the quantity
                yourself. Enter <strong className="text-ink">{qty}</strong> at{" "}
                {money(handoff.perBird)} per bird, which comes to{" "}
                <strong className="text-ink">{money(est.depositDue)}</strong>.
              </p>
              <a href={handoff.url} className="btn-primary mt-3 w-full text-center">
                Continue to Square
              </a>
              <p className="mt-2 text-xs">
                We already have your order, so if the quantity comes through wrong
                we will sort it out with you.
              </p>
            </div>
          ) : status === "fallback" ? (
            <div className="mt-5 rounded-xl border border-ink/10 bg-cream p-4 text-sm text-ink-soft">
              <p className="font-semibold text-ink">Card checkout is being set up.</p>
              <p className="mt-1">
                Your reservation is saved and we have your details. Send your{" "}
                {money(est.depositDue)} deposit by Venmo to confirm it.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={site.venmo} target="_blank" rel="noopener noreferrer" className="btn-venmo">Pay {money(est.depositDue)} by Venmo</a>
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
              {status === "loading" ? "Starting checkout…" : `Reserve & pay ${money(est.depositDue)} deposit`}
            </button>
          )}

          <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-ink-soft">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" />
            </svg>
            Secure checkout powered by Square
          </p>

          <noscript>
            <p className="mt-4 rounded-xl border border-ink/10 bg-cream p-4 text-sm text-ink-soft">
              This reservation form needs JavaScript.{" "}
              <Link href="/contact" className="font-semibold text-terracotta underline">
                Send us a message
              </Link>{" "}
              with the size and number of birds you want and we will reserve them
              for you.
            </p>
          </noscript>
        </div>
      </div>
    </div>
  );
}

function Field({ id, label, value, onChange, type = "text", autoComplete, required }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-semibold text-ink">
        {label}
        {required && <span className="text-terracotta"> *</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 w-full rounded-xl border-2 border-ink/10 bg-cream px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-terracotta"
      />
    </div>
  );
}

function Stepper({ value, setValue }) {
  const clamp = (n) => Math.max(1, Math.min(50, n));
  return (
    <div className="inline-flex items-center rounded-full border-2 border-ink/15">
      <button type="button" aria-label="Decrease" onClick={() => setValue((v) => clamp(v - 1))} className="grid h-10 w-10 place-items-center text-lg text-ink hover:text-terracotta">−</button>
      <input
        id="qty"
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
        <span className="block text-xs text-ink-soft">{sub}</span>
      </dt>
      <dd className="font-serif text-xl font-semibold text-ink">{value}</dd>
    </div>
  );
}
