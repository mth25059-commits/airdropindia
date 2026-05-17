import type { Metadata } from "next";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "AirdropIndia disclaimer — important information about crypto risks, tax calculations, and airdrops.",
};

export default function DisclaimerPage() {
  return (
    <div className="container py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="gradient-text">Disclaimer</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: May 2026</p>

        <GlassCard className="mt-8 p-6">
          <h2 className="text-lg font-semibold">No Financial Advice</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything on this site is for informational and educational purposes only. We do not
            provide financial, legal, investment, or tax advice. Any decisions you make based on
            information found on this site are made at your own risk. Always do your own research (DYOR)
            and consult qualified professionals before making financial decisions.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Tax Calculator Disclaimer</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• The tax calculator implements Sections 115BBH and 194S of the Income-tax Act, 1961 as we understand them for FY 2025-26.</li>
            <li>• Tax law changes frequently. Calculations may not reflect the latest amendments.</li>
            <li>• Always verify calculations with a qualified Chartered Accountant before filing your ITR.</li>
            <li>• We are not responsible for any errors, penalties, interest, or losses arising from reliance on our calculator.</li>
            <li>• The calculator does not account for all possible scenarios (e.g., mining, staking rewards, DeFi yield, NFTs with special treatment).</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Airdrop Risks</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Airdrops listed on this site are aggregated from publicly available sources. We do not endorse or guarantee any airdrop.</li>
            <li>• Many airdrop scams exist. Never share your private keys, seed phrases, or passwords.</li>
            <li>• Use a dedicated wallet for airdrops — never use your main holdings wallet.</li>
            <li>• Be cautious of phishing sites that mimic legitimate airdrop pages.</li>
            <li>• We do not custody any funds or handle any crypto transactions on your behalf.</li>
            <li>• Participating in airdrops may have tax implications. Consult a CA for guidance.</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">No Warranty</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            This site and its content are provided &ldquo;as is&rdquo; without warranty of any kind,
            express or implied. We do not guarantee the accuracy, completeness, reliability, or timeliness
            of any information on this site. Links to third-party websites are provided for convenience
            and do not imply endorsement.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            If you have concerns or find inaccurate information, please contact us at{" "}
            <a href="mailto:dxruxx@gmail.com" className="text-brand-purple hover:underline">dxruxx@gmail.com</a>{" "}
            or use our <a href="/contact" className="text-brand-purple hover:underline">contact form</a>.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
