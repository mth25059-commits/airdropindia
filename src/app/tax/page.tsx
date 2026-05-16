import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Receipt, ShieldCheck } from "lucide-react";
import { TaxCalculator } from "@/components/tax/TaxCalculator";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScrollFade } from "@/components/shared/ScrollFade";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Crypto Tax Calculator India — 30% + 1% TDS (Section 115BBH & 194S)",
  description:
    "Free crypto tax calculator for India. Computes 30% flat tax + 4% Health & Education cess + 1% TDS under Section 115BBH & 194S. AI explanations, PDF download, save to history.",
  alternates: { canonical: "/tax" },
  openGraph: {
    title: "Crypto Tax Calculator India",
    description: "Free 30% + 1% TDS calculator. India crypto tax done right.",
  },
};

export default async function TaxPage() {
  const supabase = createClient();
  const { data } = await supabase.auth.getUser();
  const isLoggedIn = Boolean(data.user);

  return (
    <div className="container py-12">
      <header className="mx-auto max-w-3xl text-center">
        <ScrollFade>
          <Badge variant="brand">
            <Receipt className="h-3 w-3" /> Section 115BBH + 194S coded
          </Badge>
        </ScrollFade>
        <ScrollFade delay={0.05}>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="gradient-text">Crypto tax calculator</span> for India
          </h1>
        </ScrollFade>
        <ScrollFade delay={0.1}>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            30% flat + 4% cess + 1% TDS — every rule from the Indian Income-tax
            Act, coded exactly. Free, private, instant.
          </p>
        </ScrollFade>
        <ScrollFade delay={0.15}>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <Button asChild size="sm" variant="secondary">
              <Link href="/tax/examples">
                <BookOpen className="h-4 w-4" /> See worked examples
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link href="/tax/history">
                <ShieldCheck className="h-4 w-4" /> My history
              </Link>
            </Button>
          </div>
        </ScrollFade>
      </header>

      <div className="mx-auto mt-12 max-w-5xl">
        <TaxCalculator isLoggedIn={isLoggedIn} />
      </div>

      <section className="mx-auto mt-16 max-w-3xl">
        <ScrollFade>
          <h2 className="text-2xl font-semibold tracking-tight">How this calculator works</h2>
        </ScrollFade>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Section 115BBH (30% flat)</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Profit from transfer of VDA is taxed at a flat 30%, regardless of
              your income slab. No deductions except cost of acquisition. Losses
              can&rsquo;t offset other income.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Section 194S (1% TDS)</h3>
            <p className="mt-2 text-sm text-zinc-400">
              The buyer or exchange withholds 1% TDS on sells &gt; ₹10,000 in a
              FY (₹50,000 for specified persons). Claim it back as TDS credit
              in your ITR.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Cess + Surcharge</h3>
            <p className="mt-2 text-sm text-zinc-400">
              4% Health &amp; Education cess on the tax. High-income filers add a
              10/15/25/37% surcharge based on slab.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Always-on disclaimer</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Informational only. Tax law evolves — always validate with a
              Chartered Accountant before filing.
            </p>
          </GlassCard>
        </div>

        <ScrollFade>
          <div className="mt-10 text-center">
            <Button asChild>
              <Link href="/blog/india-crypto-tax-2025">
                Read the full guide <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </ScrollFade>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "CryptoTaxIndia",
            operatingSystem: "Web",
            applicationCategory: "FinanceApplication",
            offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
            description:
              "Indian crypto tax calculator — 30% flat tax + 4% cess + 1% TDS under Section 115BBH and 194S.",
          }),
        }}
      />
    </div>
  );
}
