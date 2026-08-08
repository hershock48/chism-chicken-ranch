import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import FaqAccordion from "@/components/FaqAccordion";
import { images } from "@/lib/site";

export const metadata = {
 title: "FAQ",
 description:
 "Common questions about how we feed, raise, and prepare our pasture-raised chickens at Chism Chicken Ranch.",
 alternates: { canonical: "/faq" },
};

const faqs = [
 { q: "What type of feed do you feed your chickens?", a: "We feed a meat-bird ration with 28% protein from our local feed mill, along with all the grass and bugs the chickens find while living on pasture." },
 { q: "Where do you get your chicks from?", a: "We do our best to source our birds from a Michigan hatchery, Townline in Zeeland, MI." },
 { q: "What breed are the chickens?", a: "We raise Cornish Cross Rock. It's the same variety you'd buy at the grocery store, the difference is entirely in how they're raised." },
 { q: "How much does my chicken weigh?", a: "On average, a chicken weighs around 4.5 lb after butcher." },
 { q: "Why are there red spots in my egg?", a: "These are typically caused by a ruptured blood vessel in the hen's ovary or oviduct during egg formation. The egg is still completely safe to eat." },
 { q: "Why is some of the meat green?", a: "This happens from time to time and the meat is not rotten or unsafe. It's a condition called Green Muscle Disease, when a muscle grows too large to get enough blood supply, it can turn green from lack of oxygen. It's still considered safe to eat." },
];

const faqJsonLd = {
 "@context": "https://schema.org",
 "@type": "FAQPage",
 mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

export default function FaqPage() {
 return (
 <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
 <PageHeader
 eyebrow="good to know"
 title="Frequently Asked"
 accent="Questions"
 subtitle="Everything you might want to know about how we raise and prepare our birds."
 image={images.faq}
 />

 <div className="section grid gap-10 py-16 lg:grid-cols-[1.6fr_1fr]">
 <div className="reveal">
 <FaqAccordion items={faqs} />
 </div>

 <aside className="reveal lg:sticky lg:top-24 lg:self-start">
 <div className="card overflow-hidden">
 <img src={images.faq} alt="Pasture-raised birds at Chism Chicken Ranch" className="h-48 w-full object-cover" />
 <div className="p-6">
 <h3 className="font-serif text-xl font-semibold text-ink">Still have a question?</h3>
 <p className="mt-2 text-sm text-ink-soft">We&apos;re happy to help. Reach out and we&apos;ll get back to you quickly.</p>
 <Link href="/contact" className="btn-primary mt-4 w-full">Contact Us</Link>
 </div>
 </div>
 </aside>
 </div>
 </>
 );
}
