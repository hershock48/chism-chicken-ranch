# Chism Chicken Ranch

A modern, interactive marketing site for Chism Chicken Ranch — pasture-raised
poultry in Marshall, Michigan. Built with **Next.js 14 (App Router)**, **React**,
and **Tailwind CSS**.

## Features

- Responsive, rustic-farmhouse design with reveal-on-scroll animations
- Sticky navigation with mobile menu
- Interactive **Reservation Estimator** (deposit + price-by-weight calculator)
- Accordion FAQ
- Working **contact / reservation form** (via API route) + Venmo and social links
- SEO metadata on every page

## Run locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000

To test a production build:

```bash
npm run build
npm start
```

## Contact form email (optional but recommended)

The form works out of the box (submissions are logged on the server). To
actually receive emails, sign up at [resend.com](https://resend.com) and set
these environment variables (locally in `.env.local`, and in Vercel → Project →
Settings → Environment Variables):

```
RESEND_API_KEY=your_key
CONTACT_TO=where-inquiries-should-go@example.com
CONTACT_FROM=Chism Chicken Ranch <hello@yourdomain.com>   # must be a verified sender
```

Any email provider works — just swap the fetch call in
`app/api/contact/route.js`.

## Square checkout (reservation deposits)

The `/reserve` page takes the $6.50-per-bird deposit by card through
**Square-hosted checkout** (`app/api/checkout/route.js` creates a Square Payment
Link on the fly). To go live, set these environment variables in Vercel:

```
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_LOCATION_ID=your_square_location_id
SQUARE_ENV=production        # or "sandbox" while testing
```

Get these from the Square Developer dashboard (developer.squareup.com) using the
same Square account the farm already uses. Test with sandbox credentials first.
Until the vars are set, the reserve page gracefully falls back to a
"pay deposit by Venmo + message us" flow, so nothing errors. The balance is
always paid by actual weight at pickup — the online step only collects the
deposit.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **New Project → Import** the repo. Framework preset auto-detects
   Next.js — no config needed.
3. Add the environment variables above (if using email).
4. Deploy.

## Project structure

```
app/
  layout.js          # root layout, fonts, nav + footer
  page.js            # home
  products/          # products
  how-it-works/      # process timeline + calculator
  about/             # story + farmers
  faq/               # accordion FAQ
  contact/           # form + Venmo/socials
  api/contact/       # form handler
components/           # Navbar, Footer, ContactForm, FaqAccordion, etc.
lib/site.js          # central content/config (links, pricing, images)
```

## SEO

Built to be search-legit out of the box:

- Per-page titles, descriptions, and canonical URLs
- `app/sitemap.js` and `app/robots.js` (auto-served at `/sitemap.xml` and `/robots.txt`)
- JSON-LD structured data: **LocalBusiness/Farm** (site-wide), **Product** (products
  page), and **FAQPage** (FAQ page — eligible for rich results)
- Dynamic Open Graph / Twitter image generated at `app/opengraph-image.js`
- Web app manifest + theme color + SVG favicon

Update `site.url` in `lib/site.js` to the final domain so canonicals, sitemap, and
OG tags point to the right place. After deploying, submit `/sitemap.xml` in Google
Search Console.

## The eggs above "Fresh from the pasture"

`components/EggDrop.js`. Three eggs fall in as you scroll and settle in pasture
grass, each on its own scroll window, each squashing slightly as it lands. It sits
directly above the products heading on the home page.

It exists because the client asked for it and pointed at where she had seen it:
*"a little bit of motion... going from your webpage to clicking on C.C.Ranch
underneath the header saying 'fresh from the shop'. Suggestion: for the motion
effect, maybe we can have the chicken lay an egg here to break things up, lol!"*
The Chism card on glazedweb.com already drops eggs on scroll, so she had seen the
effect and described it back to us.

**The mechanic is lifted from that card, not re-invented.** Same fall distance
relative to the headroom, same overlapping scroll windows, same half-sine squash
in the last 14% of each fall, same shadow that deepens and widens as the egg
arrives, same settled-scene behaviour under `prefers-reduced-motion`. If the
glazedweb version is ever retuned, retune it there and copy the numbers across.

Two deliberate departures, both explained at the top of the component: the eggs
are brown and cream farm eggs rather than glazed ones (the green glaze cap is the
Glazed Web logo, and on a poultry farm's own site it reads as a spoiled egg), and
there is no hen — the "bok bok bok" bubble puts her just off frame instead, which
is one `<g>` and one CSS block to delete if the client would rather it went.

Things worth knowing before editing it:

- The whole drawing, **bubble included**, lives inside one `viewBox`. The bubble
  started as an absolutely-positioned `<span>` with a px font size, and because the
  band scales with the viewport while the span did not, the gap between the bubble
  and the small egg closed as the screen narrowed: clear by 1px at 390, overlapping
  the shell by 18px at 320. In SVG it holds the same relationship at every width.
  If you move anything, `eggfit.mjs` (kept outside the repo, alongside `audit.mjs`)
  measures that gap from 320px to 1600px.
- Egg positions and sizes are arguments to `eggPath()`, and the grass is two arrays
  of `[x, baseY, height, lean, width, fill]`. Nothing is a hand-typed path except
  the three sheen arcs, so moving an egg means changing one number — plus its
  shadow, its speckles and its sheen, which is why the component comments name
  them together.
- **JS lifts the eggs out of frame, it does not put them down.** Their resting place
  is where they are in the markup, so with the script blocked the band renders as
  three eggs already settled in the grass rather than an empty strip. Verified.
- `transform-box: fill-box` in `globals.css` is load-bearing. Without it a CSS
  transform on an SVG group is measured from the origin of the `viewBox`, so
  `transform-origin: 50% 100%` would mean the bottom of the whole drawing and the
  eggs would swing instead of squashing on their own bases.
- The band is left-aligned, not centred, and the products section drops to `mt-10`
  from the `mt-24` the others use. Both are for the same reason: the band carries
  about 110px of empty sky at the top for the eggs to fall through, and the point
  is for the eggs to land on top of the heading rather than float near it.

## Notes

- The site is intentionally **photo-lite** (type/graphic driven) — no stock imagery.
  To add real farm photos later, drop them in `public/` and place them in the
  relevant sections.
- The contact email (`lib/site.js`) is a placeholder — update it to the real one.
