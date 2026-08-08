import "./globals.css";
import { Lora, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import MobileCTA from "@/components/MobileCTA";
import { site } from "@/lib/site";

const serif = Lora({
 subsets: ["latin"],
 weight: ["400", "500", "600", "700"],
 style: ["normal", "italic"],
 variable: "--font-serif",
 display: "swap",
});

const sans = Inter({
 subsets: ["latin"],
 variable: "--font-sans",
 display: "swap",
});

export const metadata = {
 metadataBase: new URL(site.url),
 title: {
 default: "Chism Chicken Ranch, Pasture-Raised Poultry in Marshall, Michigan",
 template: "%s · Chism Chicken Ranch",
 },
 description: site.description,
 applicationName: site.name,
 keywords: [
 "pasture raised chicken",
 "Marshall Michigan",
 "Battle Creek chicken farm",
 "farm to table poultry",
 "free range eggs Michigan",
 "non-GMO chicken",
 "wholesale pastured poultry",
 "Southwest Michigan farm",
 ],
 authors: [{ name: site.name }],
 creator: site.name,
 publisher: site.name,
 alternates: { canonical: "/" },
 robots: {
 index: true,
 follow: true,
 googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
 },
 openGraph: {
 type: "website",
 locale: "en_US",
 url: site.url,
 siteName: site.name,
 title: "Chism Chicken Ranch, Pasture-Raised Poultry in Marshall, MI",
 description: site.description,
 },
 twitter: {
 card: "summary_large_image",
 title: "Chism Chicken Ranch, Pasture-Raised Poultry in Marshall, MI",
 description: site.description,
 },
 icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/icon.svg" },
 category: "food",
};

export const viewport = { themeColor: "#FAF0E6", colorScheme: "light" };

const jsonLd = {
 "@context": "https://schema.org",
 "@type": ["LocalBusiness", "Farm"],
 "@id": `${site.url}/#business`,
 name: site.name,
 description: site.description,
 url: site.url,
 email: site.email,
 slogan: site.tagline,
 foundingDate: String(site.established),
 founder: site.founders.map((name) => ({ "@type": "Person", name })),
 address: {
 "@type": "PostalAddress",
 addressLocality: site.address.locality,
 addressRegion: site.address.region,
 postalCode: site.address.postalCode,
 addressCountry: site.address.country,
 },
 geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
 areaServed: site.areaServed.map((name) => ({ "@type": "AdministrativeArea", name })),
 memberOf: {
 "@type": "Organization",
 name: "American Pastured Poultry Producers Association (APPPA)",
 },
 sameAs: [site.socials.facebook, site.socials.instagram, site.socials.youtube],
};

export default function RootLayout({ children }) {
 return (
 <html lang="en" className={`${serif.variable} ${sans.variable}`}>
 <body className="font-sans">
 <script
 type="application/ld+json"
 dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
 />
 <Reveal />
 <Navbar />
 <main>{children}</main>
 <Footer />
 <MobileCTA />
 </body>
 </html>
 );
}
