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
 url: "https://chism-chicken-ranch.vercel.app",
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
 pricing: { deposit: 6.5, perPound: 6.5, avgWeight: 4.5, perBird: 28 },
};

// Reservable products for the on-site Square checkout (deposit per bird).
export const reserveOptions = [
 {
 id: "broiler",
 name: "Broiler",
 weight: "3–5 lb",
 desc: "Our most popular size, a classic whole roasting chicken.",
 },
 {
 id: "roaster",
 name: "Roaster",
 weight: "5–7 lb",
 desc: "A larger bird for bigger tables and more leftovers.",
 },
];

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
