import { site } from "@/lib/site";

export default function manifest() {
  return {
    name: site.name,
    short_name: site.short,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#F5EDDC",
    theme_color: "#2A2015",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
