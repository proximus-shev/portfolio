import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://proximus-shev-portfolio.vercel.app/sitemap.xml",
  };
}
