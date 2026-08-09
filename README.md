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

`site.url` in `lib/site.js` is the one string every canonical tag, the sitemap, the
JSON-LD `@id` and every OG url are built from. It is now
`https://www.chismchickenranch.com`. It sat on the `.vercel.app` host for a while after
the real domain went live, which meant the site was telling search engines that a
duplicate of itself was the original — worth checking first if canonicals ever look
wrong again.

`www` rather than the apex because the apex answers 308 on asset paths and Vercel lists
`www` first among the project's domains. If the apex is actually primary, it is one word
here.

After deploying, submit `/sitemap.xml` in Google Search Console.

## The logo band: the hen runs into the mark

`components/MarkRun.js`, in the cream band that **opens the home page**, above the
hero. On load the hen scurries in from off the right of the page, brakes, skids
past her spot and settles inside the arch, with her grass tuft appearing as she
stops. Then a very small idle keeps her breathing. It is the first thing the site
does, which is the same job the donut does at the top of glazedweb.com.

This is a different request from the eggs, even though it arrived in the same
conversation. The eggs answered the client's written note. This answers what she
was actually reacting to: they kept praising glazedweb.com's animated donut, so
what they wanted was *their own mark* doing what his does. The idea of running the
chicken along to her spot is Kevin's.

**The hen is their hen, not a drawing of one.** That decision carries everything
else. Their logo exists only as `public/logo.jpg`, 500×500, and the hen inside it
is 103×101 pixels of fine cross-hatched engraving. Redrawing her as vector line
art was the obvious route and it was the wrong one: a redrawn hen would sit inside
their real arch beside their real type, where the comparison is immediate and any
wobble in the linework reads as a mistake. So she was cut out of the logo itself
and is animated as pixels.

`public/mark/` holds the three pieces lifted out of that JPEG:

| File | What it is |
| --- | --- |
| `arch.svg` | the type and arch, **vector** — traced from their own artwork |
| `hen.png` | the hen alone, comb to feet |
| `grass.png` | the tuft she stands in, drawn over her feet |

Layered over `#FAF0E6` at the offsets in the component they reproduce the original
mark. When she is home, that band is their logo. Nothing in it has been
approximated.

### Why the type is vector

288px of JPEG is not enough for it. The band renders the mark at ~300 CSS px,
which on a 2× screen means the browser asks for 600 device pixels and had 288, so
their wordmark was being upscaled twofold — and it looked it.

It is **traced from their own bitmap**, not set in a matching typeface, for exactly
the reason the hen is not redrawn: those are their letterforms, and a font that is
nearly right changes the shape of their name. `trace_mark.py` (kept outside the
repo with the other tooling) has the derivation. Three things in it are worth
knowing before you regenerate it:

- **The threshold is 162 because it was measured, not chosen.** Every candidate
  from 88 to 172 was traced, rendered at the mark's native size over the mark's
  own background, and diffed against their JPEG; 162 is the minimum error, and the
  curve is flat from 154 to 166. Lower thresholds look bolder than their logo,
  because a solid shape at full ink has to be *narrower* than an anti-aliased one
  to carry the same weight.
- **A single layer, not two.** An earlier version traced twice — a solid core plus
  a lighter halo — to rebuild the anti-aliasing. It read as embossed: a solid halo
  under a solid core is a hard step, not a gradient, so every letter came out
  looking outlined.
- **The 8× upscale before thresholding is load-bearing.** potrace's curves are only
  as smooth as the grid it is given, and tracing the 288px original directly
  follows the JPEG's stair-stepping instead of the letterform.

It is also smaller over the wire than the PNG it replaced: 16.7KB gzipped against
33KB, because path data compresses and a PNG does not.

**The hen cannot go the same way, and that was tested rather than assumed.** Her
body is light cream with faint stippling, so at any threshold that keeps the type
honest she traces to zero paths — nothing at all. She stays pixels, and at this
size the softness reads as engraving rather than as a mistake.

Things that will break it if you do not know them:

- **The band's background must be `bg-paper`, and that is not a "close enough"
  cream.** `#FAF0E6` is the exact background inside their logo file. The sprites
  had the cream divided back out of them when they were cut, so they only
  composite seamlessly over that value. On any other background the linework picks
  up a faint halo.
- **The arch layer is transparent and draws on top of the hen**, so she runs
  *behind* their type and behind the arch leg. The first version made it an opaque
  tile with its own cream, and she crossed in front of their "2013" on the way in,
  which read as a layering mistake rather than a choice.
- **The offsets are measured, not eyeballed.** They are where each piece sat in
  `logo.jpg` as a percentage of the cropped mark. Do not round them, and if you
  re-export any asset, re-derive all three together — the aspect ratios are locked.
- **Display at 300px or less — for the hen's sake now, not the type's.** The type is
  vector and sharp at any size. `hen.png` is 103px native, so past about 340px she
  starts to soften noticeably while the type beside her stays crisp, and the
  mismatch is what looks wrong. A higher-resolution logo file from the client would
  lift that ceiling; it is worth asking whether one exists.
- **Easing lives inside the keyframes, per segment, not as one curve.** One
  ease-out across the whole run was the first attempt, and measuring it showed 98%
  of the travel happening in the first half, leaving her to creep the last 17px for
  three quarters of a second. A dash reads as a dash because the speed is flat
  while it lasts and only breaks at the end.
- **The run bob's keyframes start and end on the ground on purpose.** End a
  two-frame square wave at the top of the hop and the last iteration snaps her 4px
  down the instant the bob stops.
- Nothing animates until JS adds `.is-running`, and the un-animated state is the
  hen already home. With the script blocked, or reduced motion asked for, the band
  is simply their logo. Both verified.
- **Because it is above the fold, the run waits for the sprites to have painted
  and then waits a further 280ms.** Above the fold the IntersectionObserver fires
  during load, and starting the dash before `hen.png` has decoded means she is
  absent for the run and simply appears in the arch. The extra beat is so the
  visitor is looking when she goes rather than arriving to find it half over.
- **The header's text wordmark fades in only once you are 150px down, and only on
  the home page** (`components/Navbar.js`). With the masthead directly below it,
  the header repeating the name made it the third appearance inside 600px; now the
  header takes the branding over as the masthead scrolls away. It is opacity, not
  `hidden`, so nothing shifts and nothing is lost to a screen reader. `pastMasthead`
  is deliberately separate from `scrolled`: the header shadow still wants to appear
  the instant the page moves.

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
there is no hen — eggs falling from above frame is nice motion, a hen standing
next to eggs falling out of the sky is confusing, and the glazedweb card cut its
own hen for the same reason. A "bok bok bok" bubble briefly stood in for her here
and was removed: the hen is now on the same page running into the logo, so a
speech bubble further down was introducing a chicken you had already met.

Things worth knowing before editing it:

- **The egg cluster sits left of the band's centre, and that is not a mistake.**
  It was originally to leave room on the right for the speech bubble. The bubble is
  gone and the offset stayed, because the grass patch is what centres the band and
  the composition is better slightly off-axis than dead centred.
- **Anything positioned over this band belongs inside the `viewBox`, not on top of
  it in HTML.** That is what the bubble got wrong before it was deleted: as an
  absolutely-positioned `<span>` with a px font size it stayed put while the band
  scaled with the viewport, so its clearance from the small egg closed as screens
  narrowed — 1px at 390, overlapping the shell by 18px at 320. In SVG units a gap
  cannot drift.
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
