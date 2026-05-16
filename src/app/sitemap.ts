import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/utils";
import { getAllPosts } from "@/lib/blog";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { DEMO_AIRDROPS } from "@/lib/demo-airdrops";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl().replace(/\/$/, "");
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1.0, lastModified: now },
    { url: `${base}/airdrops`, changeFrequency: "daily", priority: 0.9, lastModified: now },
    { url: `${base}/airdrops/submit`, changeFrequency: "monthly", priority: 0.3, lastModified: now },
    { url: `${base}/tax`, changeFrequency: "weekly", priority: 0.95, lastModified: now },
    { url: `${base}/tax/examples`, changeFrequency: "monthly", priority: 0.7, lastModified: now },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8, lastModified: now },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.2, lastModified: now },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.1, lastModified: now },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.1, lastModified: now },
    { url: `${base}/disclaimer`, changeFrequency: "yearly", priority: 0.1, lastModified: now },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllPosts().map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  let airdropRoutes: MetadataRoute.Sitemap = [];
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("airdrops")
        .select("slug, updated_at")
        .order("updated_at", { ascending: false })
        .limit(500);
      airdropRoutes = (data ?? []).map((row) => ({
        url: `${base}/airdrops/${row.slug}`,
        lastModified: row.updated_at ? new Date(row.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.75,
      }));
    } catch {
      // fall through to demo
    }
  }
  if (airdropRoutes.length === 0) {
    airdropRoutes = DEMO_AIRDROPS.map((a) => ({
      url: `${base}/airdrops/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  }

  return [...staticRoutes, ...airdropRoutes, ...blogRoutes];
}
