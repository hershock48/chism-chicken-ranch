import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { site, reserveOptions, round } from "@/lib/site";

/**
 * Starts a Square-hosted checkout for the reservation deposit.
 *
 * THE PRECEDENCE HERE USED TO BE BACKWARDS, AND IT WAS THE BUG.
 *
 * The old order was: if a static Square Payment Link exists, return it and stop.
 * Since one is set in lib/site.js, that branch always won, so this route
 * carefully validated optionName and quantity and then threw both away. Proven
 * by asking it for three different orders:
 *
 *   4 Broilers  -> https://square.link/u/pMzRSiAb
 *   1 Roaster   -> https://square.link/u/pMzRSiAb
 *   50 Roasters -> https://square.link/u/pMzRSiAb
 *
 * Identical. So a customer who configured 4 Roasters read "Reserve & pay $26.00
 * deposit" on our button, clicked it, and landed on a Square page for a single
 * $6.50 item with the quantity reset and no record of which bird they wanted.
 * An amount that changes between the button and the payment page is the most
 * alarming thing a checkout can do. It reads as a bait and switch, and most
 * people close the tab. That is the "screen for checking out is still a little
 * screwy" the farm reported.
 *
 * Now: the API path is tried FIRST, because it is the only one that can carry a
 * real amount. The static link is the fallback, and when we fall back we say so
 * (`amountCarries: false`) so the interface stops promising a total it cannot
 * deliver. Correct behaviour is the default; degraded behaviour is labeled.
 *
 * Configure in the Vercel dashboard, never in a file:
 *   SQUARE_ACCESS_TOKEN  Square access token (production or sandbox)
 *   SQUARE_LOCATION_ID   the location ID
 *   SQUARE_ENV           "production" (default) or "sandbox"
 *   SQUARE_VERSION       optional API version override
 *   SQUARE_PAYMENT_LINK  optional override of the fallback link
 */

const MAX_BIRDS = 50;

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const option = reserveOptions.find(
    (o) => o.name === body?.optionName || o.id === body?.optionName
  );
  const quantity = Math.round(Number(body?.quantity));

  if (!option) {
    return NextResponse.json({ error: "Choose a bird size." }, { status: 400 });
  }
  if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_BIRDS) {
    return NextResponse.json(
      { error: `Choose a quantity between 1 and ${MAX_BIRDS}.` },
      { status: 400 }
    );
  }

  // Deposit is read from the same constant the interface quotes from, so the
  // amount charged and the amount displayed cannot drift apart. It was 650
  // hardcoded here while the page read site.pricing.deposit.
  const depositCents = Math.round(site.pricing.deposit * 100 * quantity);
  const label = `${quantity} × ${option.name} (${option.weight})`;

  const token = process.env.SQUARE_ACCESS_TOKEN;
  const locationId = process.env.SQUARE_LOCATION_ID;

  // ---- Preferred path: build a payment link for this exact order ----
  if (token && locationId) {
    const base =
      process.env.SQUARE_ENV === "sandbox"
        ? "https://connect.squareupsandbox.com"
        : "https://connect.squareup.com";
    const version = process.env.SQUARE_VERSION || "2024-10-17";
    const origin = new URL(request.url).origin;

    try {
      const res = await fetch(`${base}/v2/online-checkout/payment-links`, {
        method: "POST",
        headers: {
          "Square-Version": version,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idempotency_key: randomUUID(),
          quick_pay: {
            // This string is what shows on Derek's Square notification and on
            // the customer's receipt, so it has to name the order. Previously
            // he received an amount with nothing attached to it.
            name: `Round ${round.number} deposit, ${label}`,
            price_money: { amount: depositCents, currency: "USD" },
            location_id: locationId,
          },
          checkout_options: {
            redirect_url: `${origin}/reserve?status=success`,
            ask_for_shipping_address: false,
          },
          pre_populated_data: body?.customer?.email
            ? { buyer_email: String(body.customer.email).slice(0, 255) }
            : undefined,
          description:
            `Non-refundable $${site.pricing.deposit.toFixed(2)}/bird deposit to reserve ` +
            `${label} pasture-raised chicken for round ${round.number}, ` +
            `pickup ${round.pickupWindow}. Balance paid by actual weight at pickup.`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.payment_link?.url) {
        return NextResponse.json({ url: data.payment_link.url, amountCarries: true });
      }
      // Fall through to the static link rather than dead-ending the customer.
      console.error("Square payment link failed:", JSON.stringify(data));
    } catch (err) {
      console.error("Square request failed:", err);
    }
  }

  // ---- Fallback: the dashboard Payment Link ----
  //
  // It cannot carry a computed amount, so we return amountCarries: false and the
  // interface tells the customer they will set the quantity on Square's page.
  // Saying that up front is the difference between an inconvenience and feeling
  // misled. Their order has already been emailed to the farm by /api/reserve, so
  // even if Square's quantity ends up wrong, Derek has the real order.
  const staticLink = process.env.SQUARE_PAYMENT_LINK || site.squarePaymentLink;
  if (staticLink) {
    return NextResponse.json({
      url: staticLink,
      amountCarries: false,
      perBird: site.pricing.deposit,
      quantity,
    });
  }

  return NextResponse.json({ configured: false });
}
