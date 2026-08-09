import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { images, gallery } from "@/lib/site";
import PhotoSlider from "@/components/PhotoSlider";

export const metadata = {
 title: "About Us",
 description:
 "The best-tasting chicken starts with the happiest chickens. Meet the family behind Chism Chicken Ranch and our commitment to ethical, sustainable farming since 2013.",
 alternates: { canonical: "/about" },
};

const values = [
 { title: "Ethical & sustainable", body: "Our chickens move daily across spacious pastures to peck, scratch, and forage to their heart's content." },
 { title: "Nothing to hide", body: "We're open about our practices. No antibiotics, no hormones, no GMOs, just transparency you can trust." },
 { title: "Rooted in community", body: "Choosing our birds supports local farmers, and we're proud supporters of local 4-H and the next generation in agriculture." },
];

export default function AboutPage() {
 return (
 <>
 <PageHeader
 eyebrow="our story"
 title="About Chism Chicken"
 accent="Ranch"
 subtitle="We believe the best-tasting chicken starts with the happiest chickens."
 image={images.farmers}
 />

 <section className="section py-16">
 <div className="grid items-center gap-10 lg:grid-cols-2">
 <div className="reveal overflow-hidden rounded-3xl shadow-soft">
 <img src={images.farmers} alt="The Chism family on the ranch" className="h-full w-full object-cover" />
 </div>
 <div className="reveal space-y-4 leading-relaxed text-ink-soft">
 <p>At Chism Chicken Ranch, we&apos;re proud to offer pasture-raised chicken raised with care and respect on lush, green pastures. What sets it apart is simple: our commitment to ethical and sustainable farming.</p>
 <p>Our chickens move daily through spacious pastures, where they can peck, scratch, and forage. This natural lifestyle results in happier, healthier birds, and meat that&apos;s unparalleled in flavor and tenderness.</p>
 <p>But it&apos;s not just about taste, it&apos;s about transparency. When you choose our chicken, you can trust you&apos;re getting meat free from antibiotics, hormones, and GMOs, while supporting local farmers dedicated to preserving the land.</p>
 <Link href="/reserve" className="btn-primary">Reserve your chicken</Link>
 </div>
 </div>
 </section>

 <section className="border-y border-ink/10 bg-paper-dark/40 py-16">
 <div className="section reveal mx-auto max-w-3xl text-center">
 <span className="eyebrow justify-center">the family</span>
 <h2 className="mt-3 display text-4xl sm:text-5xl">
 Derek Chism &amp; Tiffany Tucker
 </h2>
 <p className="mt-5 leading-relaxed text-ink-soft">Derek, with his daughter Emelia, has raised chickens with compassionate care for over ten years. Their passion for giving the animals the best possible life speaks volumes about their dedication to ethical farming.</p>
 <p className="mt-4 leading-relaxed text-ink-soft">Tiffany brings over two decades of feeding her community, and now grows herbs and vegetables too. Together, they combine a love of growing food with a commitment to community and sustainable practices, bringing back the importance of real nutrition for this generation and the next.</p>
 </div>
 </section>

 <section className="section py-16">
 <div className="grid gap-6 sm:grid-cols-3">
 {values.map((v) => (
 <div key={v.title} className="card card-hover reveal p-7">
 <h3 className="font-serif text-xl font-semibold text-ink">{v.title}</h3>
 <p className="mt-2 text-sm leading-relaxed text-ink-soft">{v.body}</p>
 </div>
 ))}
 </div>
 </section>

 {/* Life on the ranch, photo gallery */}
 <section className="border-t border-ink/10 bg-paper-dark/40 py-16">
 <div className="section">
 <div className="reveal mx-auto max-w-2xl text-center">
 <span className="eyebrow justify-center">life on the ranch</span>
 <h2 className="mt-3 display text-4xl sm:text-5xl">
 From pasture to <span className="accent">plate</span>
 </h2>
 <p className="mt-3 leading-relaxed text-ink-soft">
 The day-to-day: hard work, birds on grass, and our kids growing up in
 the middle of it.
 </p>
 </div>
 {/* Was a six-tile grid, which the client described as "just blocked
     together". A slider gives each photo its own moment and its own caption,
     and it is where Emelia's first year in 4-H now leads. */}
 <PhotoSlider photos={gallery} />
 </div>
 </section>

 <section className="border-y border-ink/10 bg-terracotta">
 <div className="section flex flex-col items-center justify-between gap-6 py-12 text-center text-cream sm:flex-row sm:text-left">
 <h2 className="display text-3xl sm:text-4xl">Taste the difference for yourself</h2>
 <Link href="/reserve" className="btn bg-cream text-ink hover:-translate-y-0.5">Reserve your birds →</Link>
 </div>
 </section>
 </>
 );
}
