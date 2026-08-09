import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { site, images } from "@/lib/site";

export const metadata = {
 title: "Products",
 description:
 "Pasture-raised meat chickens, farm-fresh free-range eggs, raised on grass and fresh air in Marshall, Michigan.",
 alternates: { canonical: "/products" },
};

const products = [
 {
 img: images.meat,
 tag: "Best seller",
 title: "Pasture-Raised Meat Chickens",
 blurb:
 "Cornish Cross Rock raised on fresh pasture and a 28% protein Non-GMO ration. The same variety you'd find at the store, but raised in fresh air and green grass, the way nature intended.",
 facts: [
 ["Breed", "Cornish Cross Rock"],
 ["Avg. weight", "~4.5 lb after butcher"],
 ["Price", "~$6.50 / lb at pickup"],
 ["Deposit", "$6.50 / bird to reserve"],
 ],
 },
 {
 img: images.eggs,
 tag: "Seasonal",
 title: "Farm-Fresh Free-Range Eggs",
 blurb:
 "Our hens roam, forage, and dust-bathe in the sunshine, and it shows in every rich, golden yolk. Availability is seasonal and limited, so reach out to check current supply.",
 facts: [
 ["From", "Free-ranging hens"],
 ["Yolks", "Deep golden, rich flavor"],
 ["Supply", "Seasonal, ask availability"],
 ],
 },
 ];

const productsJsonLd = {
 "@context": "https://schema.org",
 "@type": "ItemList",
 itemListElement: [
 { name: "Pasture-Raised Meat Chickens", desc: "Cornish Cross Rock raised on pasture with 28% protein Non-GMO feed. ~4.5 lb after butcher.", price: "6.50" },
 { name: "Farm-Fresh Free-Range Eggs", desc: "Rich, golden-yolk eggs from free-ranging hens. Seasonal availability." },
 ].map((p, i) => ({
 "@type": "ListItem",
 position: i + 1,
 item: {
 "@type": "Product",
 name: p.name,
 description: p.desc,
 brand: { "@type": "Brand", name: site.name },
 offers: {
 "@type": "Offer",
 priceCurrency: "USD",
 ...(p.price ? { price: p.price } : {}),
 availability: "https://schema.org/InStock",
 seller: { "@type": "Organization", name: site.name },
 },
 },
 })),
};

export default function ProductsPage() {
 return (
 <>
 <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productsJsonLd) }} />
 <PageHeader
 eyebrow="from our farm"
 title="Our"
 accent="products"
 subtitle={`Here at ${site.short} the birds are raised in fresh air with green grass under their feet, and you can taste the difference.`}
 image={images.meat}
 />

 <div className="section space-y-16 py-16">
 {products.map((p, i) => (
 <article key={p.title} className={`reveal grid items-center gap-8 lg:grid-cols-2 ${i % 2 ? "lg:[&>div:first-child]:order-2" : ""}`}>
 <div className="overflow-hidden rounded-3xl shadow-soft">
 <img src={p.img} alt={p.title} className="h-80 w-full object-cover" />
 </div>
 <div>
 <span className="eyebrow">{p.tag}</span>
 <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">{p.title}</h2>
 <p className="mt-3 leading-relaxed text-ink-soft">{p.blurb}</p>
 <dl className="mt-6 grid grid-cols-2 gap-3">
 {p.facts.map(([k, v]) => (
 <div key={k} className="rounded-xl bg-cream px-4 py-3 ring-1 ring-ink/[0.06]">
 <dt className="text-xs uppercase tracking-wider text-ink-soft">{k}</dt>
 <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
 </div>
 ))}
 </dl>
 <Link href="/reserve" className="btn-primary mt-6">Reserve / Ask</Link>
 </div>
 </article>
 ))}
 </div>

 <section className="border-y border-ink/10 bg-wheat/20">
 <div className="section flex flex-col items-center justify-between gap-6 py-12 text-center sm:flex-row sm:text-left">
 <div>
 <h2 className="display text-2xl text-ink sm:text-3xl">Not sure what to order?</h2>
 <p className="mt-1 text-ink-soft">Tell us how you cook and we&apos;ll help you choose the right amount.</p>
 </div>
 <div className="flex flex-wrap justify-center gap-3">
 <Link href="/contact" className="btn-primary">Contact Us</Link>
 </div>
 </div>
 </section>
 </>
 );
}
