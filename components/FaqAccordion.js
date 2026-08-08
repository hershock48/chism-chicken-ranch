"use client";

import { useState } from "react";

export default function FaqAccordion({ items }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="divide-y divide-ink/10 overflow-hidden rounded-2xl bg-cream shadow-soft ring-1 ring-ink/[0.06]">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-paper-dark/40"
            >
              <span className="font-serif text-lg font-medium text-ink">
                {item.q}
              </span>
              <span
                className={`grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-terracotta transition-transform duration-300 ${
                  isOpen ? "rotate-45 bg-wheat/40" : "bg-paper-dark"
                }`}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                  <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div className={`grid transition-all duration-300 ease-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <p className="px-6 pb-6 leading-relaxed text-ink-soft">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
