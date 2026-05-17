import type { Metadata } from "next";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "AirdropIndia terms of use — rules and conditions for using our platform.",
};

export default function TermsPage() {
  return (
    <div className="container py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          <span className="gradient-text">Terms of Use</span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: May 2026</p>

        <GlassCard className="mt-8 p-6">
          <h2 className="text-lg font-semibold">Acceptance of Terms</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            By accessing and using AirdropIndia / CryptoTaxIndia (&ldquo;the Site&rdquo;), you accept and agree
            to be bound by these Terms of Use. If you do not agree, please do not use the Site.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Informational Purpose Only</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            All content on this Site is for informational purposes only. Nothing on this Site constitutes
            financial, legal, tax, or investment advice. We make no warranty of any kind regarding the
            accuracy, completeness, or reliability of any information on the Site.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Tax Calculator</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            The tax calculator implements Sections 115BBH and 194S of the Income-tax Act, 1961 as we
            understand them. Tax law changes frequently. You are solely responsible for verifying tax
            calculations with a qualified Chartered Accountant before filing your ITR. We are not
            responsible for any errors, penalties, or losses arising from use of the calculator.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Airdrop Information</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Airdrops listed are aggregated from public sources. We do not endorse, sponsor, or guarantee any airdrop.</li>
            <li>• Connecting your wallet, signing transactions, and participating in airdrops is at your own risk.</li>
            <li>• Always verify the official URL of an airdrop before interacting with it.</li>
            <li>• Never share your private keys or seed phrase with anyone.</li>
            <li>• User-submitted airdrops are reviewed but we cannot guarantee their legitimacy.</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">User Accounts</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• You are responsible for maintaining the security of your account.</li>
            <li>• You must provide accurate information when creating an account or submitting forms.</li>
            <li>• We reserve the right to terminate accounts that violate these terms.</li>
            <li>• Do not use the Site for any unlawful purpose or to transmit harmful content.</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Limitation of Liability</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            To the maximum extent permitted by law, we shall not be liable for any indirect, incidental,
            special, consequential, or punitive damages, or any loss of profits, data, or goodwill,
            arising from your use of the Site, including but not limited to losses from crypto transactions,
            tax miscalculations, or participation in airdrops.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Changes to Terms</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            We may update these Terms at any time. Continued use of the Site after changes constitutes
            acceptance of the new Terms. We encourage you to review this page periodically.
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Contact</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Questions about these terms? Email us at{" "}
            <a href="mailto:dxruxx@gmail.com" className="text-brand-purple hover:underline">dxruxx@gmail.com</a>{" "}
            or use our <a href="/contact" className="text-brand-purple hover:underline">contact form</a>.
          </p>
        </GlassCard>
      </div>
    </div>
  );
}
