import Link from "next/link";
import { site, images } from "@/lib/site";
import ReservationCalculator from "@/components/ReservationCalculator";
import Marquee from "@/components/Marquee";
import CountUp from "@/components/CountUp";

export const metadata = { alternates: { canonical: "/" } };

export default function Home() {
 return (
 <>
 {/* HERO */}
 <section className="relative overflow-hidden">
 <img
 src={images.hero}
 alt="Chism Chicken Ranch pasture pens at golden hour in Marshall, Michigan"
 className="absolute inset-0 h-full w-full scale-105 object-cover"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
 <div className="section relative flex min-h-[84vh] flex-col justify-center py-24 text-cream">
 <span className="eyebrow reveal text-wheat-light before:bg-wheat-light">
 Family-run · Est. {site.established} · {site.region}
 </span>
 <h1 className="reveal mt-5 max-w-3xl display text-5xl leading-[1.02] text-cream sm:text-7xl">
 Pasture-raised poultry,{" "}
 <span className="font-serif font-normal italic text-wheat-light">
 raised right.
 </span>
 </h1>
 {/* Was a spec list: Non-GMO, no antibiotics, no hormones, pasture, Marshall.
     Every one of those is restated in the stats row 60px below it, again in
     the marquee below that, and again in the value cards below that. The
     client's note was that the same information repeats within four or five
     sentences, and it did, four times over. This paragraph now carries the one
     thing no number or badge can: what you can actually buy, and from whom. */}
 <p className="reveal mt-6 max-w-xl text-lg leading-relaxed text-cream/85">
 Chicken and eggs from small batches, moved to fresh pasture as they
 graze.
 </p>
 <div className="reveal mt-9 flex flex-wrap gap-4">
 <Link href="/reserve" className="btn-primary">
 Reserve Your Birds
 </Link>
 <Link
 href="/how-it-works"
 className="btn border border-cream/40 text-cream hover:bg-cream hover:text-ink"
 >
 How It Works
 </Link>
 </div>

 {/* The wholesale door, in the hero. /wholesale already existed but the only
     ways to it were the nav's seventh item and a card two thirds of the way
     down the page, so a chef or a farm store had to scroll through the whole
     retail pitch to find their own route. The client's note: "They're not
     gonna wanna sift through everything to find where they need to go for
     them."

     Deliberately a text link and not a third button. Families are the volume
     business and the two buttons above are theirs; a wholesaler is looking for
     the word "wholesale" and will find it, while nobody else has to step
     around it. */}
 <p className="reveal mt-6 text-sm text-cream/70">
 Buying for a restaurant, farm store or co-op?{" "}
 <Link
 href="/wholesale"
 className="group inline-flex items-center gap-1 font-semibold text-wheat-light underline decoration-wheat-light/40 underline-offset-4 hover:decoration-wheat-light"
 >
 See wholesale
 <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">&rarr;</span>
 </Link>
 </p>

 <dl className="reveal mt-14 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
 {[
 { n: 10, suffix: "+", l: "Years farming" },
 { n: 100, suffix: "%", l: "Non-GMO feed" },
 { n: 0, l: "Antibiotics" },
 { n: 8, prefix: "~", suffix: "wk", l: "On pasture" },
 ].map((s) => (
 <div key={s.l} className="border-l border-cream/25 pl-4">
 <dt className="font-serif text-4xl font-semibold text-wheat-light">
 <CountUp to={s.n} prefix={s.prefix} suffix={s.suffix} />
 </dt>
 <dd className="mt-1.5 text-[11px] uppercase tracking-[0.15em] text-cream/65">
 {s.l}
 </dd>
 </div>
 ))}
 </dl>
 </div>
 </section>

 <Marquee />

 {/* VALUE PROPS */}
 <section className="section mt-20">
 <div className="grid gap-5 sm:grid-cols-3">
 {[
 { title: "Always On The Move", body: "Onto fresh grass every few days, to peck, scratch and forage in the sun.", tone: "text-barn", bg: "bg-barn/10", icon: <path d="M3 20h18M5 20c0-4 2-7 5-7m9 7c0-5-3-9-7-9M8 13c-1-3 1-6 4-6m0 0c1 2 3 3 5 3" /> },
 // Titles and bodies rewritten to stop restating the stats row. "Clean Feed"
 // was Non-GMO plus no antibiotics plus no hormones, all three of which are
 // already numbers above; it now says what the ration actually is and why the
 // foraging matters. "Local & Transparent" was the fourth mention of Michigan;
 // the hatchery and the batch size are the new information, so those stay and
 // the geography goes.
 { title: "Fed Well, Not Fast", body: "A 28% protein ration, plus whatever they turn up themselves. That is what you taste.", tone: "text-terracotta", bg: "bg-terracotta/10", icon: <path d="M12 3v18M5 8c2 0 4 1 7 4M19 8c-2 0-4 1-7 4" /> },
 { title: "Small Batches, Start to Finish", body: "Chicks from a hatchery we know, in batches small enough that we know the birds.", tone: "text-wheat", bg: "bg-wheat/20", icon: <path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6" /> },
 ].map((c) => (
 <div key={c.title} className="card card-hover reveal p-7">
 <span className={`grid h-12 w-12 place-items-center rounded-xl ${c.bg} ${c.tone}`}>
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
 {c.icon}
 </svg>
 </span>
 <h3 className="mt-5 font-serif text-xl font-semibold text-ink">{c.title}</h3>
 <p className="mt-2 text-sm leading-relaxed text-ink-soft">{c.body}</p>
 </div>
 ))}
 </div>
 </section>

 {/* PRODUCTS PREVIEW */}
 <section className="section mt-24">
 <div className="reveal flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
 <div>
 <span className="eyebrow">from our farm</span>
 <h2 className="mt-3 display text-4xl sm:text-5xl">
 Fresh from the <span className="accent">pasture</span>
 </h2>
 </div>
 <Link href="/products" className="btn-ghost">View all products →</Link>
 </div>

 <div className="mt-8 grid gap-6 md:grid-cols-2">
 {[
 { img: images.roast, tag: "Best seller", title: "Meat Chickens", body: "Cornish Cross raised on grass, ~4.5 lb after butcher, priced by weight.", price: "~$6.50/lb" },
 { img: images.layers, tag: "Seasonal", title: "Free-Range Eggs", body: "Rich, golden yolks from hens that roam, forage, and live the good life.", price: "Ask us" },
 ].map((p) => (
 <Link key={p.title} href="/products" className="card card-hover reveal group flex flex-col overflow-hidden">
 <div className="relative h-48 overflow-hidden">
 <img src={p.img} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
 <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink">
 {p.tag}
 </span>
 </div>
 <div className="flex flex-1 flex-col p-6">
 <h3 className="font-serif text-2xl font-semibold text-ink">{p.title}</h3>
 <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{p.body}</p>
 <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
 <span className="font-serif text-lg font-semibold text-ink">{p.price}</span>
 <span className="inline-flex items-center gap-1 text-sm font-semibold text-terracotta">
 Details
 <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
 </span>
 </div>
 </div>
 </Link>
 ))}
 </div>
 </section>

 {/* WHO WE SERVE */}
 <section className="section mt-24">
 <div className="reveal max-w-2xl">
 <span className="eyebrow">who we serve</span>
 <h2 className="mt-3 display text-4xl sm:text-5xl">
 Built for your table, or your <span className="accent">business</span>
 </h2>
 <p className="mt-4 leading-relaxed text-ink-soft">
 Filling a freezer or stocking a kitchen, we can raise it for you.
 </p>
 </div>

 <div className="mt-10 grid gap-6 md:grid-cols-3">
 {[
 { title: "Families & home cooks", href: "/reserve", body: "Reserve a few birds for the freezer and pick them up fresh, real, local food you can feel good about serving.", cta: "Reserve for home", icon: <path d="M4 21V9l8-6 8 6v12M9 21v-6h6v6" /> },
 { title: "Chefs & restaurants", href: "/wholesale", body: "Consistent, pasture-raised poultry your menu can stand behind. Let's talk volume, timing, and pickup or delivery.", cta: "Talk wholesale", icon: <><path d="M7 3v8a3 3 0 0 0 6 0V3M10 3v18" /><path d="M17 3c-1.5 1-2 3-2 5s.5 3 2 3v10" /></> },
 { title: "Farms, resellers & co-ops", href: "/wholesale", body: "Raise beef or pork but not chicken? Offer your customers pasture-raised poultry without raising a single bird, buy in bulk and resell through your farm store.", cta: "Partner with us", icon: <><path d="M3 21h18M5 21V10l7-5 7 5v11" /><path d="M9 21v-6h6v6" /></> },
 ].map((c) => (
 <Link key={c.title} href={c.href} className="card card-hover group flex flex-col p-7">
 <span className="grid h-12 w-12 place-items-center rounded-xl bg-terracotta/10 text-terracotta">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
 {c.icon}
 </svg>
 </span>
 <h3 className="mt-5 font-serif text-xl font-semibold text-ink">{c.title}</h3>
 <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{c.body}</p>
 <span className="mt-5 inline-flex items-center gap-1 font-semibold text-terracotta">
 {c.cta}
 <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
 </span>
 </Link>
 ))}
 </div>

 {/* Wholesale link, keeps the home page focused; details live on /wholesale */}
 <Link
 href="/wholesale"
 className="reveal group mt-8 flex flex-col items-start justify-between gap-3 rounded-2xl bg-cream p-6 shadow-soft ring-1 ring-ink/[0.06] transition-transform hover:-translate-y-0.5 sm:flex-row sm:items-center sm:p-7"
 >
 <p className="text-ink-soft">
 <span className="font-serif text-lg font-semibold text-ink">
 Run a restaurant, farm store, or co-op?
 </span>{" "}
 We wholesale to partners across SW Michigan and Chicago.
 </p>
 <span className="inline-flex flex-shrink-0 items-center gap-1 font-semibold text-terracotta">
 Wholesale &amp; partners
 <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
 </span>
 </Link>
 </section>

 {/* COMPARISON */}
 <section className="mt-24 bg-barn py-20 text-cream">
 <div className="section">
 <div className="reveal mx-auto max-w-2xl text-center">
 <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-wheat-light">
 know the difference
 </span>
 <h2 className="mt-4">
 <span className="block font-serif text-lg uppercase tracking-[0.15em] text-cream/55">
 Free-Range vs.
 </span>
 <span className="mt-1 block accent text-5xl text-wheat-light sm:text-6xl">
 Pasture-Raised
 </span>
 </h2>
 </div>

 <div className="mt-12 grid gap-6 md:grid-cols-2">
 <div className="reveal rounded-2xl border border-cream/15 bg-cream/5 p-7">
 <h3 className="font-serif text-2xl text-cream/80">Free Range</h3>
 <ul className="mt-4 space-y-3 text-sm text-cream/70">
 {["Some access to the outdoors, but rules vary widely.", "May still spend much of the day indoors.", "Outdoor area can be small and crowded.", "Diet is mostly grain, with limited natural foraging."].map((t) => (
 <li key={t} className="flex gap-3"><Dot muted /> {t}</li>
 ))}
 </ul>
 </div>
 <div className="reveal rounded-2xl border-2 border-wheat bg-wheat/10 p-7">
 <h3 className="font-serif text-2xl text-wheat-light">
 Pasture-Raised
 <span className="ml-2 align-middle text-xs font-bold uppercase tracking-wider text-cream/70">Our way</span>
 </h3>
 <ul className="mt-4 space-y-3 text-sm text-cream/90">
 {["Outdoors most of the day in moveable, predator-safe coops.", "Rotated to fresh pasture regularly.", "Constant access to grass, insects & sunshine.", "Varied, nutrient-rich diet and real exercise."].map((t) => (
 <li key={t} className="flex gap-3"><Dot /> {t}</li>
 ))}
 </ul>
 </div>
 </div>
 </div>
 </section>

 {/* FARMERS */}
 <section className="section mt-24">
 <div className="grid items-center gap-10 lg:grid-cols-2">
 <div className="reveal overflow-hidden rounded-3xl shadow-soft">
 <img src={images.farmers} alt="Derek Chism and family on the ranch" className="h-full w-full object-cover" />
 </div>
 <div className="reveal">
 <span className="eyebrow">meet the farmers</span>
 <h2 className="mt-3 display text-4xl sm:text-5xl">
 Derek Chism &amp; Tiffany Tucker
 </h2>
 <p className="mt-4 leading-relaxed text-ink-soft">
 Derek and his daughter Emelia have raised chickens
 with compassionate care for over a decade. Tiffany brings two
 decades of feeding her community, now growing herbs and vegetables
 alongside the flock.
 </p>
 <p className="mt-4 leading-relaxed text-ink-soft">
 In a world of cheap, commercialized food, they believe their
 community deserves a local product raised ethically, with the
 well-being of every animal put first.
 </p>
 <Link href="/about" className="btn-secondary mt-6">Read our story</Link>
 </div>
 </div>
 </section>

 {/* RESERVE CTA + CALCULATOR */}
 <section className="mt-24 border-y border-ink/10 bg-wheat/20">
 <div className="section grid items-center gap-10 py-16 lg:grid-cols-2">
 <div className="reveal">
 <span className="eyebrow">ready when you are</span>
 <h2 className="mt-3 display text-4xl sm:text-5xl">
 Reserve your <span className="accent">birds</span> today
 </h2>
 <p className="mt-4 max-w-md leading-relaxed text-ink-soft">
 Pre-purchase for spring and summer with a ${site.pricing.deposit.toFixed(2)}
 {" "}deposit per bird, it starts your bird from the hatchery and
 holds your place in our next small batch. Come pick up your birds
 fresh, or ask about delivery.
 </p>
 <ul className="mt-6 space-y-3">
 {["Reserve with a quick message", "We raise & humanely butcher at ~8 weeks", "Pick up fresh, or ask about delivery"].map((t, i) => (
 <li key={t} className="flex items-center gap-3 text-ink">
 <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full bg-terracotta text-sm font-bold text-cream">{i + 1}</span>
 {t}
 </li>
 ))}
 </ul>
 /* Venmo lives at checkout only. The client's note was that the button is
                "visually redundant and needs to be on the checkout page when you
                list payment options" - and it already was: ReserveStore shows
                "Pay $X by Venmo" with the actual deposit amount beside the card
                option. So the ask was never to add it somewhere, it was to stop
                repeating it. A payment button in front of somebody who has not
                chosen anything yet has no amount to offer and no order to pay
                for. */
 <div className="mt-7 flex flex-wrap gap-3">
 <Link href="/reserve" className="btn-primary">Reserve Now</Link>
 </div>
 </div>
 <div className="reveal">
 <ReservationCalculator />
 </div>
 </div>
 </section>
 </>
 );
}

function Dot({ muted }) {
 return <span className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${muted ? "bg-cream/40" : "bg-wheat-light"}`} />;
}
