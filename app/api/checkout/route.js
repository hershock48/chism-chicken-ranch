import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { site } from "@/lib/site";

// Starts a Square-hosted checkout for the reservation deposit.
// TWO ways to enable it (pick one), set in Vercel env vars:
//
// EASY (no code / no developer account): create a Payment Link in the normal
// Square dashboard (Payments > Payment links) for a $6.50 "Reservation deposit"
// item with customer-chosen quantity, then set:
// SQUARE_PAYMENT_LINK = the link URL
//
// ADVANCED (fully dynamic amount via API), from the Square Developer Dashboard:
// SQUARE_ACCESS_TOKEN – Square access token (production or sandbox)
// SQUARE_LOCATION_ID – your Square location ID
// SQUARE_ENV – "production" (default) or "sandbox"
// SQUARE_VERSION – optional API version override
//
// With neither set, the endpoint returns { configured: false } and the site
// falls back gracefully (message + Venmo) instead of erroring.

const DEPOSIT_CENTS = 650; // $6.50 per bird
const OPTIONS = { Broiler: "3–5 lb", Roaster: "5–7 lb" };

export async function POST(request) {
 let body;
 try {
 body = await request.json();
 } catch {
 return NextResponse.json({ error: "Invalid request." }, { status: 400 });
 }

 const optionName = String(body?.optionName || "");
 const quantity = Math.round(Number(body?.quantity));

 if (!OPTIONS[optionName]) {
 return NextResponse.json({ error: "Choose a bird type." }, { status: 400 });
 }
 if (!Number.isFinite(quantity) || quantity < 1 || quantity > 50) {
 return NextResponse.json({ error: "Choose a quantity between 1 and 50." }, { status: 400 });
 }

 // Easiest path: a Square-hosted Payment Link created in the normal Square
 // dashboard (no developer account or token needed). If set, just use it —
 // the buyer picks quantity on Square's page.
 const staticLink = process.env.SQUARE_PAYMENT_LINK || site.squarePaymentLink;
 if (staticLink) {
 return NextResponse.json({ url: staticLink });
 }

 const token = process.env.SQUARE_ACCESS_TOKEN;
 const locationId = process.env.SQUARE_LOCATION_ID;

 if (!token || !locationId) {
 // Not configured yet, let the client fall back to Venmo / contact.
 return NextResponse.json({ configured: false });
 }

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
 name: `Reservation deposit, ${quantity} × ${optionName} chicken (${OPTIONS[optionName]})`,
 price_money: { amount: DEPOSIT_CENTS * quantity, currency: "USD" },
 location_id: locationId,
 },
 checkout_options: {
 redirect_url: `${origin}/reserve?status=success`,
 ask_for_shipping_address: false,
 },
 description: `Non-refundable $6.50/bird deposit to reserve ${quantity} pasture-raised ${optionName} chicken(s).`,
 }),
 });

 const data = await res.json();
 if (!res.ok) {
 console.error("Square error:", JSON.stringify(data));
 return NextResponse.json(
 { error: "We couldn't start Square checkout. Please try again or use Venmo." },
 { status: 502 }
 );
 }

 return NextResponse.json({ url: data.payment_link?.url });
 } catch (err) {
 console.error("Checkout failed:", err);
 return NextResponse.json(
 { error: "Network error starting checkout. Please try again." },
 { status: 502 }
 );
 }
}
