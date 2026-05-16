import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScrollFade } from "@/components/shared/ScrollFade";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateTax } from "@/lib/tax/calculator";
import { formatINR } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Crypto Tax Examples for India — 3 Worked Scenarios",
  description:
    "Three real-world examples of Indian crypto tax: a profit, a loss, and a high-volume trade above the ₹10,000 TDS threshold. With full breakdown.",
  alternates: { canonical: "/tax/examples" },
};

const examples = [
  {
    title: "Example 1 — Small profit on Bitcoin",
    description:
      "Ravi buys 0.01 BTC at ₹40,00,000/BTC and sells later at ₹50,00,000/BTC. His annual VDA sells are well below ₹10,000, so no TDS this trade.",
    input: {
      buyPrice: 4_000_000,
      sellPrice: 5_000_000,
      quantity: 0.01,
      yearlyTransferTotal: 50_000,
    },
  },
  {
    title: "Example 2 — Loss on a memecoin",
    description:
      "Priya buys a memecoin at ₹2/token (50,000 tokens) and sells when it crashes to ₹0.50/token. Section 115BBH bars loss set-off — her loss is dead capital for tax.",
    input: {
      buyPrice: 2,
      sellPrice: 0.5,
      quantity: 50_000,
    },
  },
  {
    title: "Example 3 — Big trade with TDS",
    description:
      "Arun buys 5 ETH at ₹2,00,000 each and sells later at ₹2,50,000 each. His annual VDA transfer total of ₹12,50,000 crosses both the ₹10,000 and ₹50,000 thresholds — 1% TDS applies.",
    input: {
      buyPrice: 200_000,
      sellPrice: 250_000,
      quantity: 5,
      yearlyTransferTotal: 1_250_000,
    },
  },
];

export default function TaxExamplesPage() {
  return (
    <div className="container py-12">
      <header className="mx-auto max-w-3xl text-center">
        <Badge variant="brand">Worked examples</Badge>
        <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          See how <span className="gradient-text">115BBH + 194S</span> apply
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
          Three real scenarios with full math — profit, loss, and a high-volume
          trade. Tap any to compute it live.
        </p>
      </header>

      <div className="mx-auto mt-12 grid max-w-5xl gap-6">
        {examples.map((ex, i) => {
          const r = calculateTax(ex.input);
          return (
            <ScrollFade key={ex.title} delay={i * 0.05}>
              <GlassCard className="p-6 sm:p-8">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold">{ex.title}</h2>
                    <p className="mt-2 text-sm text-zinc-400">{ex.description}</p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
                      r.isProfit
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                    }`}
                  >
                    {r.isProfit ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {r.isProfit ? "Profit" : "Loss"}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Stat label="Buy total" value={formatINR(r.totalBuy)} />
                  <Stat label="Sell total" value={formatINR(r.totalSell)} />
                  <Stat
                    label="Profit / loss"
                    value={formatINR(r.profitLoss)}
                    accent={r.isProfit ? "emerald" : "rose"}
                  />
                  <Stat label="Tax (30% + cess)" value={formatINR(r.totalTax)} />
                  <Stat label="TDS (1%)" value={formatINR(r.tds)} />
                  <Stat
                    label="Net cash"
                    value={formatINR(r.netCashFromSale)}
                    accent="brand"
                  />
                </div>

                <ul className="mt-5 space-y-1.5 text-xs text-zinc-400">
                  {r.notes.map((n, j) => (
                    <li key={j}>• {n}</li>
                  ))}
                </ul>

                <div className="mt-5">
                  <Button asChild size="sm" variant="secondary">
                    <Link
                      href={`/tax?buyPrice=${ex.input.buyPrice}&sellPrice=${ex.input.sellPrice}&quantity=${ex.input.quantity}`}
                    >
                      Try this in the calculator <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </GlassCard>
            </ScrollFade>
          );
        })}
      </div>

      <section className="mx-auto mt-16 max-w-3xl text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Want a different scenario?</h2>
        <p className="mt-3 text-zinc-400">
          Punch your numbers into the live calculator and download a PDF.
        </p>
        <Button asChild className="mt-6">
          <Link href="/tax">Open the calculator</Link>
        </Button>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "emerald" | "rose" | "brand";
}) {
  const tone =
    accent === "emerald"
      ? "text-emerald-300"
      : accent === "rose"
        ? "text-rose-300"
        : accent === "brand"
          ? "text-brand-glow"
          : "text-zinc-100";
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 font-medium tabular-nums ${tone}`}>{value}</div>
    </div>
  );
}
