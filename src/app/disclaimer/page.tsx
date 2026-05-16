import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "AirdropIndia tax & financial disclaimer.",
};

export default function DisclaimerPage() {
  return (
    <article className="container-prose py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Disclaimer</h1>
      <p className="mt-4 text-zinc-400">
        The tax calculator on this site implements Sections 115BBH and 194S of
        the Income-tax Act, 1961 as we understand them for FY 2025-26. Tax law
        changes frequently — verify the rules with a Chartered Accountant
        before filing your ITR.
      </p>
      <p className="mt-4 text-zinc-400">
        We do not offer any kind of legal, financial, or tax advice. We do not
        custody your funds. We do not handle airdrops. Connecting your wallet
        to any third-party site is at your own risk. Always verify the official
        URL of an airdrop and never sign suspicious transactions.
      </p>
    </article>
  );
}
