import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "AirdropIndia terms of use.",
};

export default function TermsPage() {
  return (
    <article className="container-prose py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Terms of Use</h1>
      <p className="mt-4 text-zinc-400">
        By using AirdropIndia / CryptoTaxIndia you agree that everything on the
        site is informational only. We make no warranty of any kind. You are
        solely responsible for your crypto, your wallets, your taxes, and your
        ITR filing. Always cross-check with a CA.
      </p>
      <p className="mt-4 text-zinc-400">
        Airdrops shown here are aggregated from public sources. We do not
        endorse, sponsor, or guarantee any specific airdrop. Connecting your
        wallet, signing transactions, and any losses are your own risk.
      </p>
    </article>
  );
}
