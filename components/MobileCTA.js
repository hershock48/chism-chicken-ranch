"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export default function MobileCTA() {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname === "/reserve") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 p-3 shadow-[0_-8px_24px_-12px_rgba(59,47,40,0.3)] backdrop-blur lg:hidden">
      <div className="flex gap-3">
        <Link href="/reserve" className="btn-primary flex-1">
          Reserve Birds
        </Link>
        <a
          href={site.venmo}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Pay with Venmo"
          className="btn-venmo px-5"
        >
          Venmo
        </a>
      </div>
    </div>
  );
}
