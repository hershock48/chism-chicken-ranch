"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  // Separate from `scrolled` on purpose. The shadow wants to appear the instant
  // the page moves; this one is about whether the home page's logo masthead is
  // still on screen, so it needs the height of that band, not 8px.
  const [pastMasthead, setPastMasthead] = useState(false);
  const pathname = usePathname();
  const onHome = pathname === "/";

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      setPastMasthead(window.scrollY > 150);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-paper/95 backdrop-blur transition-shadow duration-200 ${
        scrolled ? "shadow-soft" : ""
      }`}
    >
      <div className="section flex h-[70px] items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/logo.jpg"
            alt="Chism Chicken Ranch logo"
            className="h-12 w-12 rounded-full object-cover"
          />
          {/* On the home page the full logo lockup sits 40px below this, arch,
              wordmark and all, so at the top of the page the header repeating the
              name is the third time it appears inside 600px. It fades in as the
              masthead scrolls away and the header takes the branding over.

              Opacity rather than hidden, deliberately: the element stays in the
              accessibility tree and in the layout, so nothing shifts and nothing
              is lost to a screen reader. Off the home page there is no masthead,
              so it is simply always there. */}
          <span
            className={`hidden font-serif text-lg font-semibold text-ink transition-opacity duration-300 sm:block ${
              onHome && !pastMasthead ? "opacity-0" : "opacity-100"
            }`}
          >
            Chism Chicken Ranch
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {nav
            .filter((i) => !["/", "/reserve"].includes(i.href))
            .map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-terracotta ${
                    active ? "text-terracotta" : "text-ink/75"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          <Link href="/reserve" className="btn-primary">
            Reserve Birds
          </Link>
        </nav>

        <button
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-full text-ink hover:bg-paper-dark lg:hidden"
        >
          <span className="relative block h-4 w-6">
            <span className={`absolute left-0 h-0.5 w-6 bg-current transition-all ${open ? "top-1.5 rotate-45" : "top-0"}`} />
            <span className={`absolute left-0 top-1.5 h-0.5 w-6 bg-current transition-all ${open ? "opacity-0" : "opacity-100"}`} />
            <span className={`absolute left-0 h-0.5 w-6 bg-current transition-all ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
          </span>
        </button>
      </div>

      <div
        className={`overflow-hidden border-t border-ink/10 bg-paper transition-[max-height] duration-300 lg:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <nav className="section flex flex-col gap-1 py-3">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-base font-medium ${
                  active ? "bg-ink text-cream" : "text-ink hover:bg-paper-dark"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
