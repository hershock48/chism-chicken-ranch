import { NextResponse } from "next/server";

// Contact / reservation handler.
// To enable real emails, set these environment variables in Vercel:
// RESEND_API_KEY – your Resend API key (https://resend.com)
// CONTACT_TO – the inbox that should receive inquiries
// CONTACT_FROM – a verified sender, e.g. "Chism Chicken Ranch <hello@yourdomain.com>"
// Without a key the form still "works" (it logs the submission) so the site
// never errors in demo/preview, just no email is sent.

export async function POST(request) {
 let body;
 try {
 body = await request.json();
 } catch {
 return NextResponse.json({ error: "Invalid request." }, { status: 400 });
 }

 const {
 name,
 email,
 phone,
 interest,
 birds,
 message,
 consent,
 business,
 operationType,
 volume,
 timeline,
 } = body || {};

 if (!name || !email || !phone || !message) {
 return NextResponse.json(
 { error: "Please fill out all required fields." },
 { status: 400 }
 );
 }
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
 return NextResponse.json(
 { error: "Please enter a valid email address." },
 { status: 400 }
 );
 }

 const isWholesale =
 Boolean(business || operationType || volume || timeline) ||
 /wholesale/i.test(interest || "");

 const summary = [
 `New ${isWholesale ? "WHOLESALE " : ""}inquiry from ${name}`,
 business ? `Business: ${business}` : null,
 operationType ? `Operation type: ${operationType}` : null,
 `Email: ${email}`,
 `Phone: ${phone}`,
 interest ? `Interested in: ${interest}` : null,
 volume ? `Estimated volume: ${volume}` : null,
 timeline ? `Timeline: ${timeline}` : null,
 birds ? `Birds: ${birds}` : null,
 `Marketing consent: ${consent ? "yes" : "no"}`,
 "",
 message,
 ]
 .filter(Boolean)
 .join("\n");

 const apiKey = process.env.RESEND_API_KEY;
 const to = process.env.CONTACT_TO;
 const from =
 process.env.CONTACT_FROM || "Chism Chicken Ranch <onboarding@resend.dev>";

 if (apiKey && to) {
 try {
 const res = await fetch("https://api.resend.com/emails", {
 method: "POST",
 headers: {
 Authorization: `Bearer ${apiKey}`,
 "Content-Type": "application/json",
 },
 body: JSON.stringify({
 from,
 to: [to],
 reply_to: email,
 subject: `🐓 New reservation inquiry, ${name}`,
 text: summary,
 }),
 });
 if (!res.ok) {
 const detail = await res.text();
 console.error("Resend error:", detail);
 return NextResponse.json(
 { error: "We couldn't send your message. Please try again or use Venmo / social media." },
 { status: 502 }
 );
 }
 } catch (err) {
 console.error("Email send failed:", err);
 return NextResponse.json(
 { error: "Network error sending your message. Please try again." },
 { status: 502 }
 );
 }
 } else {
 // No email provider configured, log so nothing is lost in preview.
 console.log("[contact] (no email provider configured)\n" + summary);
 }

 return NextResponse.json({ ok: true });
}
