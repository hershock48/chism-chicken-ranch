/** @type {import('next').NextConfig} */

// THE QR CODE ON THE PRINTED BUSINESS CARDS.
//
// There is a stack of cards already printed whose QR code points at the old
// website. Whether those cards can be saved depends on one thing, and it is
// worth being precise because the answer decides between a one-line change and
// a reprint:
//
//   A QR code is just a URL painted as squares. It cannot be changed after
//   printing. What CAN be changed is what that URL does when someone visits it,
//   and that is only possible if we control the thing at the other end.
//
// So there are three cases, and the first step is the same in all of them:
// scan a card with a phone camera and read the URL it offers. Then:
//
//   1. The URL is a short link from a QR generator (qrco.de, bit.ly, qr1.at and
//      similar). Those are "dynamic" codes and the destination is a setting in
//      that account. Log in, point it at https://www.chismchickenranch.com/reserve,
//      done. Nothing here needs to change and the cards are saved outright.
//
//   2. The URL is a host we control, including the old Vercel address. Handled
//      below, permanently, with a 301.
//
//   3. The URL is a host nobody controls any more, e.g. a free subdomain on an
//      old site builder that has lapsed. Then no redirect anywhere can help,
//      because the request never reaches us. The cards cannot be saved by
//      software. A sticker over the code is the cheap fix.
//
// On Derek's actual question, "SEO 301": yes, 301 rather than 302. A 301 is
// permanent and tells search engines to move the ranking signals to the new
// address and index that one instead. A 302 says "temporary, keep indexing the
// old one," which would split the farm's search presence across two addresses
// indefinitely. Everything below is 301.

const CANONICAL = "https://www.chismchickenranch.com";

const nextConfig = {
  poweredByHeader: false,
  compress: true,

  async redirects() {
    return [
      // ---- Case 2: hosts we control ----
      //
      // The site answered on chism-chicken-ranch.vercel.app before the domain
      // was connected, so anything printed or shared in that window points here.
      // Sending it to the real domain does two jobs at once: printed material
      // from that period keeps working, and the duplicate copy of the whole site
      // stops competing with the farm for its own name in search results. A
      // .vercel.app host is indexable by default and is a genuine duplicate.
      //
      // Per-deployment URLs (the long ones with a hash) are unaffected, so
      // previewing a build still works normally.
      //
      // statusCode: 301 rather than `permanent: true`. Next's `permanent` emits
      // 308, which Google and Bing treat identically to 301 for passing ranking
      // signals, so this is not an SEO difference. It is 301 because that is the
      // number Derek asked for and the number any redirect-checking tool he
      // pastes the URL into will show him. Matching the expectation is free.
      //
      // /api is excluded deliberately. A 301 is allowed to turn a POST into a
      // GET, which would drop a form body on the floor without an error. 308 is
      // the one that preserves the method, so rather than pick between them,
      // page traffic gets the 301 and the API is simply left alone.
      {
        source: "/:path((?!api/).*)",
        has: [{ type: "host", value: "chism-chicken-ranch.vercel.app" }],
        destination: `${CANONICAL}/:path`,
        statusCode: 301,
      },

      // ---- Short paths for printed material ----
      //
      // For the NEW flyers: print chismchickenranch.com/order. It is short
      // enough to read aloud, short enough to make a dense QR unnecessary, and
      // it is ours forever, so where it points can change every season without
      // reprinting anything. Print the path, never the deep link.
      { source: "/order", destination: "/reserve", statusCode: 301 },
      { source: "/preorder", destination: "/reserve", statusCode: 301 },
      { source: "/qr", destination: "/reserve", statusCode: 301 },

      // ---- Case 3 slot ----
      //
      // If the scan turns out to be a path on a host we do control, add it here
      // and it is saved. One line each, e.g.:
      //   { source: "/chickens", destination: "/products", statusCode: 301 },
    ];
  },
};

module.exports = nextConfig;
