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

## Notes

- The site is intentionally **photo-lite** (type/graphic driven) — no stock imagery.
  To add real farm photos later, drop them in `public/` and place them in the
  relevant sections.
- The contact email (`lib/site.js`) is a placeholder — update it to the real one.
