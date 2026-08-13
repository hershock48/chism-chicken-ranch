// Central site data, reused across pages and structured data.
export const site = {
 name: "Chism Chicken Ranch",
 // The short form, and the whole trademark question lives on this one line.
 //
 // Changed from "CCR" on 9 Aug 2026. Tiffany raised that CCR is Creedence
 // Clearwater Revival; Derek's position was to let it ride. Both are reasonable
 // reads of the odds, and the odds are not really the issue: a farm selling
 // chicken is not in a rock band's market and nobody buys eggs thinking
 // otherwise. The issue is that the downside is lopsided. A demand letter is
 // cheap to send and expensive to answer, and it would arrive after the signage,
 // the cartons and the search results all say CCR.
 //
 // It costs nothing to sidestep, because "CCR" was never the strong option.
 // Three letters shared with a famous band and several hundred other outfits is
 // a weak mark even with the band out of the picture, while "Chism" is theirs
 // alone and warmer besides. Chism eggs. The Chism birds.
 //
 // Every use on the site reads this constant, so the decision is one word here
 // if they want CCR back. Nothing else has to change either way.
 short: "Chism",
 established: 2013,
 // The real domain, not the vercel.app host. This one string feeds every canonical
 // tag, the sitemap, the JSON-LD @id and every OG url, so while it said
 // vercel.app the site was telling search engines that a duplicate of itself was
 // the original. That is the one SEO fault that actively works against a client
 // rather than merely missing an opportunity. The README has said "update this to
 // the final domain" since the first commit; the domain went live and this did not
 // follow it.
 //
 // www rather than the apex on two pieces of evidence: the apex answers 308 on
 // asset paths, and Vercel lists www first among the project's domains. If the
 // apex turns out to be primary this is one word, and either way it beats pointing
 // at the duplicate.
 url: "https://www.chismchickenranch.com",
 tagline: "Pasture-raised poultry, raised right in Southwest Michigan.",
 description:
 "Family-run pasture-raised chicken and free-range eggs in Marshall, Michigan since 2013. Non-GMO fed, no antibiotics or hormones, humanely raised, farm to table.",
 location: "Marshall, Michigan 49068",
 region: "Southwest Michigan",
 address: { locality: "Marshall", region: "MI", postalCode: "49068", country: "US" },
 geo: { lat: 42.2725, lng: -84.9633 },
 areaServed: ["Marshall, MI", "Battle Creek, MI", "Calhoun County, MI", "Southwest Michigan", "Chicago, IL"],
 founders: ["Derek Chism", "Tiffany Tucker"],
 venmo:
 "https://venmo.com/code?user_id=4121730796750547324&created=1727366969.323001&printed=1",
 // Square-hosted deposit checkout (created in the Square dashboard).
 squarePaymentLink: "https://square.link/u/pMzRSiAb",
 email: "chismchickenranch@gmail.com",
 socials: {
 facebook: "https://facebook.com/chismchickenranch",
 instagram: "https://instagram.com/chismchickenranch",
 youtube: "https://youtube.com/@chismchickenranch",
 },
 // There is no single "average bird" any more, and there never really was.
 // avgWeight used to be one number, 4.5 lb, applied to every bird of every
 // size. That is what made the checkout screen contradict itself: you picked
 // the Roaster, and the summary directly underneath told you it would weigh
 // 4.5 lb, which was below the bottom of the range printed on the option you
 // had just chosen. Weight now lives on each option in reserveOptions, as a
 // range, because that is how the birds actually come back from processing.
 pricing: { deposit: 6.5, perPound: 6.5 },
};

// THE ROUND CURRENTLY OPEN FOR PRE-ORDERS.
//
// Everything seasonal on the site reads from this one object: the eyebrow on
// /reserve, the pickup line in the order summary, the confirmation screen, and
// the pre-purchase band on the home page. Opening round 4 is an edit here and
// nowhere else.
//
// It replaces `new Date().getFullYear() + 1`, which rendered "taking orders for
// 2027" on a page selling birds for October 2026. Worse than wrong: /reserve is
// statically generated, so that year was baked in at build time and would have
// stayed 2027 no matter how long the site ran. A page whose content depends on
// the calendar cannot compute the calendar at build time.
export const round = {
 number: 3,
 open: true,
 // Not confirmed yet. Derek is calling Morren Ag for the chicks and Stutzmans
 // for processing. Until pickupConfirmed flips to true the site says the
 // window is approximate, because a customer planning a freezer around it
 // deserves to know it can move.
 pickupWindow: "the first or second week of October",
 pickupShort: "early October",
 pickupConfirmed: false,
};

// Reservable sizes for the on-site Square checkout (deposit per bird).
//
// The weight ranges are Derek's, given 13 Aug 2026, and they are the dressed
// weight after processing, not live weight. Broilers run 2.5 to 4 lb; anything
// 4 lb and over is a Roaster, up to about 5.5. `weight` is derived from the
// numbers rather than typed alongside them, so the label on the button can
// never drift away from the arithmetic in the summary.
export const reserveOptions = [
 {
 id: "broiler",
 name: "Broiler",
 minWeight: 2.5,
 maxWeight: 4,
 desc: "Our most popular size, a classic whole roasting chicken.",
 },
 {
 id: "roaster",
 name: "Roaster",
 minWeight: 4,
 maxWeight: 5.5,
 desc: "A larger bird for bigger tables and more leftovers.",
 },
].map((o) => ({ ...o, weight: `${o.minWeight}–${o.maxWeight} lb` }));

// The whole flock, for surfaces that are not asking you to pick a size.
export const flockWeight = {
 min: Math.min(...reserveOptions.map((o) => o.minWeight)),
 max: Math.max(...reserveOptions.map((o) => o.maxWeight)),
};

// ONE estimate function, called by every surface that quotes a price.
//
// There were two copies of this arithmetic before, in ReserveStore and in
// ReservationCalculator, and the calculator renders on two more pages. Four
// places to get the same sum wrong. It returns a range because the birds come
// back in a range: quoting a single total means being wrong on nearly every
// order and having the customer discover it at the truck.
export function estimate(option, qty) {
 const { deposit, perPound } = site.pricing;
 const min = option.minWeight * qty;
 const max = option.maxWeight * qty;
 const depositDue = deposit * qty;
 return {
 depositDue,
 weight: { min, max },
 total: { min: min * perPound, max: max * perPound },
 balance: {
 min: Math.max(min * perPound - depositDue, 0),
 max: Math.max(max * perPound - depositDue, 0),
 },
 };
}

// Real farm photos, self-hosted in /public/photos (optimized).
export const images = {
 logo: "/logo.jpg",
 // Named shots
 pens: "/photos/pens.jpg", // golden-hour pasture pens (landscape), hero
 pensV: "/photos/pens_v.jpg",
 family: "/photos/family.jpg", // Derek, Tiffany, Emelia + daughter at the henhouse
 derek: "/photos/derek.jpg", // Derek feeding the flock
 coop: "/photos/coop.jpg", // broilers inside a mobile coop
 pasture: "/photos/pasture.jpg", // broilers close-up on grass
 flock: "/photos/flock.jpg", // broilers at the waterer
 layers: "/photos/layers.jpg", // speckled laying hens foraging
 roast: "/photos/roast.jpg", // roasted chicken dinner
 packaged: "/photos/packaged.jpg", // branded frozen whole chicken
 fair: "/photos/fair.jpg", // Emelia showing birds at 4-H fair
 // Aliases used across pages
 hero: "/photos/pens.jpg",
 farmers: "/photos/family.jpg",
 meat: "/photos/packaged.jpg",
 eggs: "/photos/layers.jpg",
 howItWorks: "/photos/derek.jpg",
 faq: "/photos/pasture.jpg",
};

// Captions are new. In a grid of tiles a photo is decoration; in a slider it
// gets looked at one at a time, so each one can say something. Ordered to lead
// with the place and end with the reason.
export const gallery = [
 {
 src: "/photos/emelia-first-4h.jpg",
 alt: "Emelia as a young girl at Fair Lake, holding one of her chickens",
 caption:
 "Emelia's first year in 4-H. The family's answer for why any of this exists.",
 },
 { src: "/photos/pens.jpg", alt: "Pasture pens at golden hour", caption: "The pens at golden hour, before they get moved again." },
 { src: "/photos/derek.jpg", alt: "Derek feeding the flock on pasture", caption: "Derek, on the daily round." },
 { src: "/photos/flock.jpg", alt: "Broilers at the waterer in fresh grass", caption: "Fresh grass, fresh water, every few days somewhere new." },
 { src: "/photos/layers.jpg", alt: "Speckled laying hens foraging", caption: "The layers, doing as they please." },
 { src: "/photos/roast.jpg", alt: "A roasted pasture-raised chicken dinner", caption: "Where it all ends up." },
 { src: "/photos/fair.jpg", alt: "Emelia showing birds at the 4-H fair", caption: "Still showing at the county fair." },
];

// Wholesale / reseller partners (from owner's notes + public info).
export const partners = [
 {
 name: "Blight Farms",
 kind: "Farm store · Albion, MI",
 blurb:
 "A generational family farm raising regenerative beef and Berkshire pork, no poultry of their own, so their customers now get our pasture-raised chicken alongside their freezer beef and pork.",
 location: "Albion, MI",
 url: "https://www.blightfarms.com",
 },
 {
 name: "Jolo Farms & Services",
 kind: "Farm stand · Battle Creek, MI",
 blurb:
 "A family farm stand on B Drive North offering fresh produce, honey, and baked goods, now carrying our pasture-raised poultry so their customers can buy local chicken too.",
 location: "9848 B Dr N, Battle Creek, MI",
 url: "https://www.facebook.com/Jolofarmsandservices/",
 },
 {
 name: "Local Pastures",
 kind: "Home delivery · Chicago, IL",
 blurb:
 "A Chicago delivery service bringing pasture-raised meat from Midwest farms straight to Chicagoland doors, a channel that carries our poultry to the city.",
 location: "Chicago, IL",
 url: "https://www.localpastures.com/",
 },
];

// Wholesale moved up to third. It was seventh of eight, which put a whole
// business line behind five retail entries and the fold on a phone. Reserve
// stays first because it is the volume business; Wholesale sits next to
// Products because that is where somebody buying by the case starts looking.
export const nav = [
 { href: "/", label: "Home" },
 { href: "/reserve", label: "Reserve" },
 { href: "/products", label: "Products" },
 { href: "/wholesale", label: "Wholesale" },
 { href: "/how-it-works", label: "How It Works" },
 { href: "/about", label: "About" },
 { href: "/faq", label: "FAQ" },
 { href: "/contact", label: "Contact" },
];
