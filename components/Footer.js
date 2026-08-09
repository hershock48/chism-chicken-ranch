import Link from "next/link";
import { nav, site } from "@/lib/site";

export default function Footer() {
 return (
 <footer className="mt-24 bg-ink text-cream/90">
 <div className="section grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
 <div className="lg:col-span-2">
 <div className="flex items-center gap-3">
 <img
 src="/logo.jpg"
 alt="Chism Chicken Ranch logo"
 className="h-14 w-14 rounded-full object-cover"
 />
 <h3 className="font-serif text-2xl text-cream">Chism Chicken Ranch</h3>
 </div>
 <p className="mt-4 max-w-sm text-sm leading-relaxed text-cream/70">
 {site.tagline} Family-run by Derek Chism &amp; Tiffany Tucker since
 {" "}
 {site.established}, raising happy, healthy birds for our community
 in {site.region}.
 </p>
 <div className="mt-5 flex gap-3">
 <Social href={site.socials.facebook} label="Facebook">
 <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v6h3v-6h2.5l.5-3H14V9.5c0-.3.2-.5.5-.5H14z" />
 </Social>
 <Social href={site.socials.instagram} label="Instagram">
 <path d="M12 8.5A3.5 3.5 0 1 0 12 15.5 3.5 3.5 0 0 0 12 8.5zm0 2A1.5 1.5 0 1 1 12 13.5 1.5 1.5 0 0 1 12 10.5zM16.5 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM7 4h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zm0 2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H7z" />
 </Social>
 <Social href={site.socials.youtube} label="YouTube">
 <path d="M21 8.5c-.2-1.1-.9-1.9-2-2.1C17.2 6 12 6 12 6s-5.2 0-7 .4c-1.1.2-1.8 1-2 2.1C3 10.3 3 12 3 12s0 1.7.2 3.5c.2 1.1.9 1.9 2 2.1 1.8.4 7 .4 7 .4s5.2 0 7-.4c1.1-.2 1.8-1 2-2.1.2-1.8.2-3.5.2-3.5s0-1.7-.4-3.5zM10 15V9l5 3-5 3z" />
 </Social>
 </div>
 </div>

 <div>
 <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-wheat-light">
 Explore
 </h4>
 <ul className="mt-4 space-y-2 text-sm">
 {/* Contact is filtered out here rather than removed from nav: it belongs in
     the header and on mobile, it just does not belong in a list of places to
     browse. It reappears under Get In Touch below, which is where a visitor
     looking for it actually reads. */}
 {nav.filter((item) => item.href !== "/contact").map((item) => (
 <li key={item.href}>
 <Link href={item.href} className="text-cream/70 transition-colors hover:text-cream">
 {item.label}
 </Link>
 </li>
 ))}
 </ul>
 </div>

 <div>
 <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-wheat-light">
 Get In Touch
 </h4>
 <ul className="mt-4 space-y-3 text-sm text-cream/70">
 <li>{site.location}</li>
 <li>
 <a href={`mailto:${site.email}`} className="transition-colors hover:text-cream">
 {site.email}
 </a>
 </li>
 <li>
 <Link
 href="/contact"
 className="inline-flex items-center gap-1.5 rounded-full bg-wheat px-4 py-2 font-semibold text-ink transition-opacity hover:opacity-90"
 >
 Get in touch <span aria-hidden>&rarr;</span>
 </Link>
 </li>
 </ul>
 </div>
 </div>

 <div className="border-t border-cream/10">
 <div className="section flex flex-col items-center justify-between gap-2 py-5 text-xs text-cream/50 sm:flex-row">
 <p>© {new Date().getFullYear()} Chism Chicken Ranch. All rights reserved.</p>
 <p>Est. {site.established} · Pasture-raised in Marshall, Michigan · APPPA member</p>
 </div>
 </div>
 </footer>
 );
}

function Social({ href, label, children }) {
 return (
 <a
 href={href}
 target="_blank"
 rel="noopener noreferrer"
 aria-label={label}
 className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 text-cream transition-colors hover:bg-terracotta"
 >
 <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
 {children}
 </svg>
 </a>
 );
}
