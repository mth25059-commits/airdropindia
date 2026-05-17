import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ExternalLink, FileText, HelpCircle, Receipt, ShieldCheck } from "lucide-react";
import { TaxCalculator } from "@/components/tax/TaxCalculator";
import { GlassCard } from "@/components/shared/GlassCard";
import { ScrollFade } from "@/components/shared/ScrollFade";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

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
  let isLoggedIn = false;
  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    isLoggedIn = Boolean(data.user);
  }

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
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
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

      {/* HOW TO USE */}
      <section className="mx-auto mt-16 max-w-3xl">
        <ScrollFade>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-glow" />
            <h2 className="text-2xl font-semibold tracking-tight">How to use this calculator</h2>
          </div>
        </ScrollFade>
        <div className="mt-4 space-y-3">
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Asset (optional)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the name of the crypto you traded (BTC, ETH, SOL, etc.). This is for your own reference in saved reports and PDF downloads.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Buy price &amp; Sell price (₹ per unit)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the price per token at which you bought and sold. The calculator multiplies by quantity to get total buy/sell values.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Quantity</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Number of tokens/coins you traded. Supports decimals (e.g. 0.01 BTC).
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Surcharge bracket</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Select based on your total annual income: 0% (under ₹50L), 10% (₹50L–1Cr), 15% (₹1Cr–2Cr), 25% (₹2Cr–5Cr), or 37% (above ₹5Cr). Most people use 0%.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Buy date &amp; Sell date</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              For your records and PDF report. Does not affect the tax calculation since India has no short/long-term distinction for VDA.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Total VDA sells this FY (optional)</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your total crypto sell value for the financial year so far. Used to check if you cross the ₹10,000 TDS threshold (₹50,000 for specified persons). Leave at 0 to use only this trade.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Specified person checkbox</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Check this if you are a &ldquo;specified person&rdquo; under Section 194S (individual/HUF with turnover under ₹1Cr or profession under ₹50L). This raises the TDS threshold from ₹10,000 to ₹50,000.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Actions: AI Explain · Download PDF · Save</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              <strong>Explain with AI</strong> generates a plain-English breakdown of your tax. <strong>Download PDF</strong> saves a formatted tax summary. <strong>Save to history</strong> stores the calculation in your dashboard (requires login).
            </p>
          </GlassCard>
        </div>
      </section>

      {/* HOW TAX WORKS */}
      <section className="mx-auto mt-16 max-w-3xl">
        <ScrollFade>
          <h2 className="text-2xl font-semibold tracking-tight">How Indian crypto tax works</h2>
        </ScrollFade>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Section 115BBH (30% flat)</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Profit from transfer of VDA is taxed at a flat 30%, regardless of
              your income slab. No deductions except cost of acquisition. Losses
              can&rsquo;t offset other income.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Section 194S (1% TDS)</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The buyer or exchange withholds 1% TDS on sells &gt; ₹10,000 in a
              FY (₹50,000 for specified persons). Claim it back as TDS credit
              in your ITR.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Cess + Surcharge</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              4% Health &amp; Education cess on the tax. High-income filers add a
              10/15/25/37% surcharge based on slab.
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Always-on disclaimer</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Informational only. Tax law evolves — always validate with a
              Chartered Accountant before filing.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* OFFICIAL GOVERNMENT RESOURCES */}
      <section className="mx-auto mt-16 max-w-3xl">
        <ScrollFade>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-brand-glow" />
            <h2 className="text-2xl font-semibold tracking-tight">Official government resources</h2>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Read the actual law and CBDT guidelines directly from government sources.
          </p>
        </ScrollFade>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Section 115BBH — Income-tax Act</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              30% flat tax on income from transfer of Virtual Digital Assets. Inserted by Finance Act 2022.
            </p>
            <a
              href="https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-brand-glow hover:underline"
            >
              Income Tax Act on incometaxindia.gov.in <ExternalLink className="h-3 w-3" />
            </a>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Section 194S — TDS on VDA</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              1% TDS on transfer of VDA when consideration exceeds ₹10,000 (₹50,000 for specified persons) in a FY.
            </p>
            <a
              href="https://incometaxindia.gov.in/pages/acts/income-tax-act.aspx"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-brand-glow hover:underline"
            >
              Income Tax Act on incometaxindia.gov.in <ExternalLink className="h-3 w-3" />
            </a>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">CBDT Circular on VDA taxation</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Guidelines and FAQs from the Central Board of Direct Taxes on how crypto/VDA is taxed in India.
            </p>
            <a
              href="https://www.incometaxindia.gov.in/communications/circular/circular-no-13-2022.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-brand-glow hover:underline"
            >
              CBDT Circular No. 13/2022 (PDF) <ExternalLink className="h-3 w-3" />
            </a>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Finance Act 2022 — Full text</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The act that introduced Section 115BBH and 194S for Virtual Digital Assets in India.
            </p>
            <a
              href="https://egazette.gov.in/WriteReadData/2022/234919.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-brand-glow hover:underline"
            >
              Finance Act 2022 on egazette.gov.in (PDF) <ExternalLink className="h-3 w-3" />
            </a>
          </GlassCard>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-3xl">
        <ScrollFade>
          <div className="text-center">
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
