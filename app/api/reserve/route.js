import { NextResponse } from "next/server";
import { site, reserveOptions, round, estimate } from "@/lib/site";

/**
 * Records a reservation with the farm BEFORE the customer is handed to Square.
 *
 * There was no order record anywhere. The only trace a reservation left was a
 * Square payment, and on the static-link path that payment arrived with no bird
 * size, no quantity that matched what the customer chose on this site, and no
 * phone number. Derek could see that money came in and not what it was for.
 *
 * That is not survivable for this particular product. The birds are picked up
 * eight weeks later, on a date that is not fixed yet, which means the farm has
 * to be able to telephone every person who pre-ordered. A checkout that takes a
 * deposit without capturing a way to reach the customer has sold something it
 * cannot deliver.
 *
 * So: this runs first, and the handoff to payment happens after. If mail is not
 * configured the submission is logged in full and the customer still proceeds.
 * A reservation must never be lost because of an unset environment variable, and
 * the visitor must never be shown an error for an operator's problem. The
 * failure belongs in the log where Kevin can see it.
 *
 * Set in the Vercel dashboard:
 *   RESEND_API_KEY, CONTACT_TO, CONTACT_FROM
 */

const clean = (v, max = 200) => String(v ?? "").trim().slice(0, max);

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = clean(body?.name, 120);
  const phone = clean(body?.phone, 40);
  const email = clean(body?.email, 160);
  const notes = clean(body?.notes, 1000);
  const quantity = Math.round(Number(body?.quantity));
  const option = reserveOptions.find(
    (o) => o.id === body?.optionId || o.name === body?.optionName
  );

  if (!name || !phone) {
    return NextResponse.json(
      { error: "Please add your name and a phone number so we can reach you about pickup." },
      { status: 400 }
    );
  }
  if (!option || !Number.isFinite(quantity) || quantity < 1 || quantity > 50) {
    return NextResponse.json({ error: "Choose a bird size and quantity." }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "That email address does not look right." }, { status: 400 });
  }

  const est = estimate(option, quantity);
  const usd = (n) => `$${n.toFixed(2)}`;

  const summary = [
    `RESERVATION, round ${round.number}`,
    ``,
    `${quantity} × ${option.name} (${option.weight} dressed)`,
    `Deposit due: ${usd(est.depositDue)}`,
    `Est. weight: ${est.weight.min} to ${est.weight.max} lb`,
    `Est. total:  ${usd(est.total.min)} to ${usd(est.total.max)} at ${usd(site.pricing.perPound)}/lb`,
    `Balance at pickup: ${usd(est.balance.min)} to ${usd(est.balance.max)}, by actual weight`,
    ``,
    `Name:  ${name}`,
    `Phone: ${phone}`,
    email ? `Email: ${email}` : `Email: not given`,
    notes ? `\nNotes: ${notes}` : null,
    ``,
    `Pickup window quoted to them: ${round.pickupWindow}` +
      (round.pickupConfirmed ? "" : " (told them it is not confirmed yet)"),
    ``,
    `Sent when they clicked through to pay. Check Square for the payment itself.`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  const from = process.env.CONTACT_FROM || "Chism Chicken Ranch <onboarding@resend.dev>";

  if (apiKey && to) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from,
          to: [to],
          ...(email ? { reply_to: email } : {}),
          subject: `🐓 Reservation, ${quantity} × ${option.name}, ${name}`,
          text: summary,
        }),
      });
      if (!res.ok) {
        // Logged, not surfaced. The customer carries on to payment.
        console.error("[reserve] Resend rejected the send:", await res.text());
        console.log("[reserve] UNSENT RESERVATION\n" + summary);
      }
    } catch (err) {
      console.error("[reserve] send failed:", err);
      console.log("[reserve] UNSENT RESERVATION\n" + summary);
    }
  } else {
    console.log("[reserve] (no email provider configured)\n" + summary);
  }

  return NextResponse.json({ ok: true });
}
