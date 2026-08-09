"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The farm gallery, as a slider rather than a block of tiles.
 *
 * Built on CSS scroll-snap rather than a carousel library, and that choice does
 * most of the work here. The track is a plain horizontally-scrolling list, so it
 * is swipeable on a phone with native momentum, scrollable with a trackpad,
 * reachable by keyboard, and readable by a screen reader as what it is: a list
 * of photographs. The buttons and dots below only call scrollTo. If the
 * JavaScript never arrives, the visitor still gets every photo and can still
 * swipe through them. Nothing is behind the script.
 */
export default function PhotoSlider({ photos }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);

  // Which slide is centred, worked out from scroll position rather than tracked
  // in state, so a swipe, a keypress and a button press all agree.
  const sync = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;
    for (let i = 0; i < el.children.length; i++) {
      const c = el.children[i];
      const centre = c.offsetLeft + c.offsetWidth / 2;
      const d = Math.abs(centre - mid);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    setActive(best);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        sync();
      });
    };
    sync();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sync]);

  const go = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const c = el.children[Math.max(0, Math.min(photos.length - 1, i))];
    if (!c) return;
    // scrollIntoView would also scroll the page vertically to reach the track.
    // Setting scrollLeft on the track only moves the track.
    el.scrollTo({
      left: c.offsetLeft - (el.clientWidth - c.offsetWidth) / 2,
      behavior: window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <div className="mt-10">
      <ul
        ref={trackRef}
        className="ccr-track flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
        // A horizontal scroller needs to be focusable to be operable by
        // keyboard alone, and needs a role and label to explain itself.
        tabIndex={0}
        // No role here, and that is the fix rather than an omission. role="group"
        // overrides a ul's implicit role of list, which orphaned all seven li
        // children and gave axe seven "listitem" violations: an li has to sit
        // inside something with role=list. A ul takes aria-label perfectly well
        // on its own and keeps its semantics.
        aria-label="Photographs from the farm, scroll or use the buttons below"
      >
        {photos.map((p, i) => (
          <li
            key={p.src}
            className="w-[86%] flex-shrink-0 snap-center sm:w-[58%] lg:w-[42%]"
          >
            <figure className="m-0">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-soft ring-1 ring-ink/[0.06]">
                <img
                  src={p.src}
                  alt={p.alt}
                  loading={i < 2 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </div>
              {p.caption && (
                <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {p.caption}
                </figcaption>
              )}
            </figure>
          </li>
        ))}
      </ul>

      <div className="mt-2 flex items-center gap-4">
        <div className="flex gap-2">
          <SliderButton label="Previous photo" onClick={() => go(active - 1)} disabled={active === 0}>
            &larr;
          </SliderButton>
          <SliderButton
            label="Next photo"
            onClick={() => go(active + 1)}
            disabled={active === photos.length - 1}
          >
            &rarr;
          </SliderButton>
        </div>
        <ol className="flex flex-1 items-center gap-2" aria-label="Photo position">
          {photos.map((p, i) => (
            <li key={p.src}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to photo ${i + 1} of ${photos.length}`}
                aria-current={i === active ? "true" : undefined}
                className={`block h-2 rounded-full transition-all ${
                  i === active ? "w-6 bg-terracotta" : "w-2 bg-ink/20 hover:bg-ink/40"
                }`}
              />
            </li>
          ))}
        </ol>
        <p className="text-xs uppercase tracking-[0.14em] text-ink-soft">
          {active + 1} / {photos.length}
        </p>
      </div>
    </div>
  );
}

function SliderButton({ label, onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-cream text-ink transition-colors hover:border-ink/35 disabled:cursor-not-allowed disabled:opacity-35"
    >
      {children}
    </button>
  );
}
