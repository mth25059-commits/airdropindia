import type { Metadata } from "next";
import { Suspense } from "react";
import { AirdropCard } from "@/components/airdrops/AirdropCard";
import { AirdropFilters } from "@/components/airdrops/AirdropFilters";
import { EmailSignup } from "@/components/airdrops/EmailSignup";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScrollFade } from "@/components/shared/ScrollFade";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { DEMO_AIRDROPS } from "@/lib/demo-airdrops";
import type { AirdropRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Active Crypto Airdrops India 2025 — AirdropIndia",
  description:
    "Curated, India-friendly crypto airdrops on Ethereum, Solana, BNB, Polygon, Arbitrum & Base. Filter by chain, difficulty, deadline. Step-by-step claim guides.",
  alternates: { canonical: "/airdrops" },
  openGraph: {
    title: "Active Crypto Airdrops India 2025",
    description:
      "Curated crypto airdrops with step-by-step claim guides for Indian users.",
  },
};

export const revalidate = 300; // 5 min ISR

interface PageProps {
  searchParams: { q?: string; chain?: string; difficulty?: string };
}

async function fetchAirdrops(params: PageProps["searchParams"]): Promise<AirdropRow[]> {
  if (!isSupabaseConfigured()) {
    return filterDemo(params);
  }
  try {
    const supabase = createClient();
    let q = supabase
      .from("airdrops")
      .select("*")
      .order("created_at", { ascending: false });
    if (params.chain) q = q.eq("chain", params.chain);
    if (params.difficulty) q = q.eq("difficulty", params.difficulty);
    if (params.q) q = q.ilike("name", `%${params.q}%`);
    const { data, error } = await q;
    if (error || !data || data.length === 0) {
      return filterDemo(params);
    }
    return data;
  } catch {
    return filterDemo(params);
  }
}

function filterDemo(p: PageProps["searchParams"]): AirdropRow[] {
  return DEMO_AIRDROPS.filter((a) => {
    if (p.chain && a.chain !== p.chain) return false;
    if (p.difficulty && a.difficulty !== p.difficulty) return false;
    if (p.q && !a.name.toLowerCase().includes(p.q.toLowerCase())) return false;
    return true;
  });
}

export default async function AirdropsPage({ searchParams }: PageProps) {
  const airdrops = await fetchAirdrops(searchParams);

  return (
    <div className="container py-12">
      <header className="mx-auto max-w-3xl text-center">
        <ScrollFade>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Active <span className="gradient-text">crypto airdrops</span> for
            Indian users
          </h1>
        </ScrollFade>
        <ScrollFade delay={0.05}>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Hand-picked airdrops with step-by-step claim guides. Always check
            the official URL before connecting your wallet.
          </p>
        </ScrollFade>
      </header>

      <div className="mx-auto mt-10 max-w-5xl">
        <Suspense fallback={null}>
          <AirdropFilters />
        </Suspense>
      </div>

      <div className="mx-auto mt-8 max-w-6xl">
        {airdrops.length === 0 ? (
          <GlassCard className="p-10 text-center">
            <h3 className="text-lg font-semibold">No airdrops match your filters.</h3>
            <p className="mt-2 text-sm text-zinc-400">Try clearing filters or check back tomorrow — new drops are added daily.</p>
          </GlassCard>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {airdrops.map((a, i) => (
              <ScrollFade key={a.id} delay={Math.min(i * 0.03, 0.2)}>
                <AirdropCard airdrop={a} />
              </ScrollFade>
            ))}
          </div>
        )}
      </div>

      <div className="mx-auto mt-16 max-w-3xl">
        <ScrollFade>
          <EmailSignup />
        </ScrollFade>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Active Crypto Airdrops India 2025",
            itemListElement: airdrops.slice(0, 10).map((a, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `/airdrops/${a.slug}`,
              name: a.name,
            })),
          }),
        }}
      />
    </div>
  );
}
