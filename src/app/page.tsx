import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  Coins,
  Lock,
  Mail,
  Search,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScrollFade } from "@/components/shared/ScrollFade";
import { SITE } from "@/lib/site";

const features = [
  {
    icon: Coins,
    title: "Curated airdrops",
    desc: "Only legit, India-friendly airdrops. Filter by chain, difficulty, and reward size.",
  },
  {
    icon: Search,
    title: "Step-by-step guides",
    desc: "Every airdrop has a no-fluff claim guide. AI-written, human-reviewed.",
  },
  {
    icon: Calculator,
    title: "Indian tax calculator",
    desc: "30% + 4% cess + 1% TDS — auto-computed. Save reports as PDF.",
  },
  {
    icon: Mail,
    title: "Email alerts",
    desc: "Get notified when fresh airdrops drop. Pick your chains. Unsubscribe anytime.",
  },
  {
    icon: TrendingUp,
    title: "Track history",
    desc: "Save every calculation in your dashboard. Export at year-end for your CA.",
  },
  {
    icon: Lock,
    title: "Private & free",
    desc: "Google login optional. Calculator works without signup. Always free.",
  },
];

const stats = [
  { label: "Active airdrops", value: "20+" },
  { label: "Chains tracked", value: "7" },
  { label: "Tax rules coded", value: "115BBH + 194S" },
  { label: "Cost to you", value: "₹0" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div className="container pt-16 pb-12 sm:pt-24 sm:pb-20">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollFade>
              <Badge variant="brand" className="inline-flex">
                <Sparkles className="h-3 w-3" /> Built for Indian crypto users
              </Badge>
            </ScrollFade>
            <ScrollFade delay={0.05}>
              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Free crypto airdrops.{" "}
                <span className="gradient-text">Indian crypto tax.</span>
                <br />
                One clean dashboard.
              </h1>
            </ScrollFade>
            <ScrollFade delay={0.1}>
              <p className="mx-auto mt-5 max-w-2xl text-balance text-base text-muted-foreground sm:text-lg">
                {SITE.description}
              </p>
            </ScrollFade>
            <ScrollFade delay={0.15}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Button asChild size="lg">
                  <Link href="/airdrops">
                    Browse airdrops <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/tax">
                    <Calculator className="h-4 w-4" /> Calculate my tax
                  </Link>
                </Button>
              </div>
            </ScrollFade>
            <ScrollFade delay={0.2}>
              <p className="mt-4 text-xs text-muted-foreground">
                No signup required. Calculator runs in your browser.
              </p>
            </ScrollFade>
          </div>

          {/* Stats strip */}
          <ScrollFade delay={0.25}>
            <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
              {stats.map((s) => (
                <GlassCard key={s.label} className="px-4 py-5 text-center">
                  <div className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {s.value}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
                </GlassCard>
              ))}
            </div>
          </ScrollFade>
        </div>
      </section>

      {/* PRODUCT CARDS */}
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <ScrollFade>
            <GlassCard className="h-full p-6 sm:p-8">
              <Badge variant="brand">
                <Coins className="h-3 w-3" /> AirdropIndia
              </Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Find airdrops worth your time.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Active airdrops on Ethereum, Solana, BNB, Polygon, Arbitrum &
                Base. Search, filter, and follow the step-by-step claim guide.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-glow" />
                  Filters: chain · difficulty · reward size · deadline
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-glow" />
                  Email alerts when new drops appear
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-glow" />
                  Safety guide on every airdrop page
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/airdrops">
                    Open the tracker <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </ScrollFade>

          <ScrollFade delay={0.05}>
            <GlassCard className="h-full p-6 sm:p-8">
              <Badge variant="brand">
                <Calculator className="h-3 w-3" /> CryptoTaxIndia
              </Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Calculate your 30% + 1% TDS — in seconds.
              </h2>
              <p className="mt-3 text-sm text-muted-foreground sm:text-base">
                Section 115BBH & 194S coded exactly. 4% cess, optional
                surcharge, AI explanation, downloadable PDF.
              </p>
              <ul className="mt-5 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-glow" />
                  30% flat + 4% cess (= 31.2%) auto-applied
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-glow" />
                  1% TDS threshold checks (₹10k / ₹50k)
                </li>
                <li className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-glow" />
                  Save to dashboard · download PDF · AI explainer
                </li>
              </ul>
              <div className="mt-6">
                <Button asChild>
                  <Link href="/tax">
                    Open the calculator <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </GlassCard>
          </ScrollFade>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="container py-16">
        <ScrollFade>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need.{" "}
              <span className="gradient-text">Nothing you don&apos;t.</span>
            </h2>
            <p className="mt-3 text-muted-foreground">
              No ads, no popups, no upsell. We make money later — for now we
              just want this to be the best Indian crypto tool on the web.
            </p>
          </div>
        </ScrollFade>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <ScrollFade key={f.title} delay={i * 0.04}>
              <GlassCard className="h-full p-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-glow ring-1 ring-brand-purple/20">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </GlassCard>
            </ScrollFade>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24 pt-10">
        <ScrollFade>
          <GlassCard intensity="strong" className="overflow-hidden p-8 text-center sm:p-12">
            <div className="absolute inset-0 -z-10 opacity-50 [background:radial-gradient(60%_60%_at_50%_0%,rgba(139,92,246,0.25),transparent_70%)]" />
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Start with whichever feels easier.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Browse active airdrops or run a tax calculation in 10 seconds.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg">
                <Link href="/airdrops">Browse airdrops</Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/tax">Tax calculator</Link>
              </Button>
            </div>
          </GlassCard>
        </ScrollFade>
      </section>
    </>
  );
}
