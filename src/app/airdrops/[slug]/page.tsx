import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  Calculator,
  Clock,
  ExternalLink,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScrollFade } from "@/components/shared/ScrollFade";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { DEMO_AIRDROPS } from "@/lib/demo-airdrops";
import { getChain, getDifficultyColor } from "@/lib/site";
import { formatUSD, formatINR } from "@/lib/utils";
import type { AirdropRow } from "@/lib/supabase/types";

export const revalidate = 600;

async function getAirdrop(slug: string): Promise<AirdropRow | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      const { data } = await supabase
        .from("airdrops")
        .select("*")
        .eq("slug", slug)
        .maybeSingle();
      if (data) return data;
    } catch {
      // fall through
    }
  }
  return DEMO_AIRDROPS.find((a) => a.slug === slug) ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const a = await getAirdrop(params.slug);
  if (!a) return { title: "Airdrop not found" };
  const title = `How to Claim ${a.name} Airdrop — Step-by-Step Guide (India)`;
  const description =
    a.description ??
    `Step-by-step guide to claim the ${a.name} airdrop, with Indian tax implications.`;
  return {
    title,
    description,
    alternates: { canonical: `/airdrops/${a.slug}` },
    openGraph: { title, description, type: "article" },
    twitter: { title, description, card: "summary_large_image" },
  };
}

export default async function AirdropDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const a = await getAirdrop(params.slug);
  if (!a) notFound();

  const chain = getChain(a.chain);
  const deadline = a.deadline ? new Date(a.deadline) : null;

  return (
    <article className="container py-10">
      <Link
        href="/airdrops"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to airdrops
      </Link>

      <header className="mt-6 grid gap-6 lg:grid-cols-[1fr,320px]">
        <div>
          <ScrollFade>
            <div className="flex flex-wrap items-center gap-2">
              {chain && (
                <Badge style={{ color: chain.color, borderColor: `${chain.color}40` }}>
                  {chain.label}
                </Badge>
              )}
              {a.difficulty && (
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${getDifficultyColor(a.difficulty)}`}
                >
                  {a.difficulty}
                </span>
              )}
              <Badge variant={a.status === "active" ? "success" : "default"}>
                {a.status}
              </Badge>
            </div>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              How to Claim the{" "}
              <span className="gradient-text">{a.name}</span> Airdrop
            </h1>
            {a.description && (
              <p className="mt-3 max-w-2xl text-muted-foreground">{a.description}</p>
            )}
          </ScrollFade>

          <ScrollFade delay={0.05}>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {a.official_url && (
                <Button asChild>
                  <a href={a.official_url} target="_blank" rel="noopener noreferrer">
                    Go to official site <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button asChild variant="secondary">
                <Link href="/tax">
                  <Calculator className="h-4 w-4" /> Estimate tax on this drop
                </Link>
              </Button>
            </div>
          </ScrollFade>
        </div>

        <ScrollFade delay={0.05}>
          <GlassCard className="p-5">
            <h3 className="text-xs uppercase tracking-wider text-muted-foreground">
              Quick info
            </h3>
            <div className="mt-3 space-y-3 text-sm">
              <Row label="Estimated value" value={a.estimated_value_usd ? formatUSD(a.estimated_value_usd) : "TBD"} />
              <Row
                label="INR equivalent"
                value={a.estimated_value_inr ? formatINR(a.estimated_value_inr) : "TBD"}
              />
              <Row
                label="Deadline"
                value={
                  deadline ? (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {deadline.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  ) : (
                    "Open"
                  )
                }
              />
              {chain && <Row label="Chain" value={chain.label} />}
              <Row label="Difficulty" value={a.difficulty ?? "—"} />
            </div>
          </GlassCard>
        </ScrollFade>
      </header>

      {/* SAFETY BANNER */}
      <ScrollFade delay={0.1}>
        <div className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04] p-4 text-sm text-amber-200">
          <Shield className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <strong className="text-amber-100">Safety first.</strong> Only use
            the official URL above. Never sign &ldquo;set approval for all&rdquo;
            on unknown contracts. Consider a burner wallet with limited funds.
          </div>
        </div>
      </ScrollFade>

      {/* STEPS */}
      <section className="mt-10">
        <ScrollFade>
          <h2 className="text-2xl font-semibold tracking-tight">Step-by-step guide</h2>
        </ScrollFade>
        <div className="mt-6 grid gap-4">
          {(a.steps ?? []).map((step, i) => (
            <ScrollFade key={i} delay={i * 0.04}>
              <GlassCard className="flex gap-4 p-5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-sm font-semibold text-white shadow-glow">
                  {i + 1}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </GlassCard>
            </ScrollFade>
          ))}
          {(!a.steps || a.steps.length === 0) && (
            <GlassCard className="p-5 text-sm text-muted-foreground">
              Guide coming soon. Subscribe to email alerts to get it the moment
              it&rsquo;s published.
            </GlassCard>
          )}
        </div>
      </section>

      {/* INDIAN TAX NOTE */}
      <ScrollFade>
        <GlassCard className="mt-10 p-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-300" />
            <div>
              <h3 className="text-base font-semibold">Indian tax note</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                When you sell tokens received from this airdrop in INR (or swap
                them for another crypto), the profit is taxed under{" "}
                <strong className="text-foreground">Section 115BBH</strong> at a
                flat 30% + 4% cess (<strong>31.2%</strong>). If the sale value
                exceeds ₹10,000 in a financial year,{" "}
                <strong>Section 194S</strong> 1% TDS also applies.
              </p>
              <Button asChild variant="secondary" size="sm" className="mt-4">
                <Link href="/tax">
                  Estimate tax now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </GlassCard>
      </ScrollFade>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `How to Claim ${a.name} Airdrop`,
            description: a.description ?? undefined,
            step: (a.steps ?? []).map((s, i) => ({
              "@type": "HowToStep",
              position: i + 1,
              name: s.title,
              text: s.body,
            })),
          }),
        }}
      />
    </article>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}
