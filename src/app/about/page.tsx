import type { Metadata } from "next";
import { GlassCard } from "@/components/shared/GlassCard";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name} — built for Indian crypto users.`,
};

export default function AboutPage() {
  return (
    <div className="container py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          About <span className="gradient-text">AirdropIndia</span>
        </h1>
        <p className="mt-4 text-zinc-400">
          AirdropIndia + CryptoTaxIndia are two free tools built for Indian
          crypto users. We&rsquo;re tired of clunky tax calculators that get
          Section 115BBH wrong and shady airdrop sites that link to phishing
          pages. So we built this.
        </p>

        <GlassCard className="mt-8 p-6">
          <h2 className="text-lg font-semibold">What we believe</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300">
            <li>• Tools should be free. Forever.</li>
            <li>• Every airdrop should have a safety guide.</li>
            <li>• Indian tax rules are strict — calculators must be exact.</li>
            <li>• No phishing, no scams, no &ldquo;sponsored&rdquo; airdrops.</li>
            <li>• Mobile-first. Most Indian crypto users are on phones.</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Disclaimer</h2>
          <p className="mt-3 text-sm text-zinc-400">
            Everything on this site is for informational purposes only and is
            not financial, legal, or tax advice. Always consult a Chartered
            Accountant for filing your ITR. Airdrops carry risk — never connect
            your main wallet, never sign suspicious transactions.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
