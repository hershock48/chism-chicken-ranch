"use client";

import { useState } from "react";

const initial = {
  name: "",
  email: "",
  phone: "",
  interest: "Pasture-raised chicken",
  birds: "",
  message: "",
  consent: false,
};

export default function ContactForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const update = (key) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
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
        body: JSON.stringify(form),
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
            <path
              d="M5 13l4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="mt-4 display text-3xl text-ink">Thank you!</h3>
        <p className="mt-2 text-ink-soft">
          We&apos;ve got your message and will reach out shortly to secure your
          reservation. Keep an eye on your email or phone.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-ghost mt-6">
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-5 p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" required>
          <input
            type="text"
            required
            value={form.name}
            onChange={update("name")}
            className={input}
            placeholder="Jane Doe"
          />
        </Field>
        <Field label="Phone" required>
          <input
            type="tel"
            required
            value={form.phone}
            onChange={update("phone")}
            className={input}
            placeholder="(269) 555-0123"
          />
        </Field>
      </div>

      <Field label="Email" required>
        <input
          type="email"
          required
          value={form.email}
          onChange={update("email")}
          className={input}
          placeholder="you@example.com"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="I'm interested in">
          <select
            value={form.interest}
            onChange={update("interest")}
            className={input}
          >
            <option>Pasture-raised chicken</option>
            <option>Free-range eggs</option>
            <option>Wholesale / bulk (restaurant, farm, or co-op)</option>
            <option>General question</option>
          </select>
        </Field>
        <Field label="How many birds? (optional)">
          <input
            type="number"
            min="0"
            value={form.birds}
            onChange={update("birds")}
            className={input}
            placeholder="e.g. 4"
          />
        </Field>
      </div>

      <Field label="Comment" required>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          className={`${input} resize-none`}
          placeholder="Tell us what you're looking for, and when you'd like to pick up."
        />
      </Field>

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={update("consent")}
          className="mt-0.5 h-5 w-5 rounded accent-terracotta"
        />
        <span>
          I agree to receive marketing and promotional materials from Chism
          Chicken Ranch.
        </span>
      </label>

      {status === "error" && (
        <p className="rounded-xl border border-terracotta/40 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send & Reserve"}
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
