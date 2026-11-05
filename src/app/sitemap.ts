import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://proximus-shev-portfolio.vercel.app";
  return [
    { url: base, priority: 1 },
    { url: `${base}/projects`, priority: .9 },
    ...projects.map((project) => ({ url: `${base}/projects/${project.slug}`, priority: .7 })),
  ];
}
