import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScrollFade } from "@/components/shared/ScrollFade";
import { Badge } from "@/components/ui/badge";
import { getAllPostsWithSupabase } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Indian Crypto Tax & Airdrop Guides",
  description:
    "Plain-English guides on Indian crypto tax (Section 115BBH + 194S), how to claim airdrops safely, and the latest crypto news for India.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getAllPostsWithSupabase();

  return (
    <div className="container py-12">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          The <span className="gradient-text">Blog</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          No-fluff guides on Indian crypto tax and how to claim airdrops
          safely. Written by humans, occasionally co-written with AI.
        </p>
      </header>

      <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => (
          <ScrollFade key={p.slug} delay={Math.min(i * 0.04, 0.2)}>
            <Link href={`/blog/${p.slug}`}>
              <GlassCard className="h-full p-5">
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <Badge>{p.category}</Badge>
                  <span>{p.readingTime} min read</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold leading-snug">
                  {p.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                  {p.excerpt}
                </p>
                <div className="mt-4 inline-flex items-center gap-1 text-xs text-brand-glow">
                  Read more <ArrowRight className="h-3 w-3" />
                </div>
              </GlassCard>
            </Link>
          </ScrollFade>
        ))}
        {posts.length === 0 && (
          <GlassCard className="col-span-full p-8 text-center">
            <p className="text-zinc-400">No posts yet. Coming soon.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
