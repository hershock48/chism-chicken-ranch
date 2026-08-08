import { site } from "@/lib/site";

export default function sitemap() {
  const now = new Date();
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" },
    { path: "/reserve", priority: 0.95, changeFrequency: "weekly" },
    { path: "/products", priority: 0.9, changeFrequency: "monthly" },
    { path: "/how-it-works", priority: 0.8, changeFrequency: "monthly" },
    { path: "/about", priority: 0.7, changeFrequency: "yearly" },
    { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
    { path: "/wholesale", priority: 0.8, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.9, changeFrequency: "monthly" },
  ];

  return routes.map((r) => ({
    url: `${site.url}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));
}
