"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileCTA() {
  const pathname = usePathname();
  if (pathname === "/contact" || pathname === "/reserve") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper/95 p-3 shadow-[0_-8px_24px_-12px_rgba(59,47,40,0.3)] backdrop-blur lg:hidden">
      {/* Was Reserve plus a Venmo button, pinned to the bottom of every page on
          every phone. That was the most redundant instance of all: a payment
          button following you around the site with nothing to pay for, and no
          amount to show. Venmo now appears once, at checkout, with the deposit
          figure next to it. The bar keeps the half that was doing work. */}
      <Link href="/reserve" className="btn-primary block w-full text-center">
        Reserve Birds
      </Link>
    </div>
  );
}
