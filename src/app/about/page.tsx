import type { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `About ${SITE.name} — free crypto airdrop tracker and tax calculator for Indian users, built by Dhruv.`,
};

const SOCIAL_LINKS = [
  { key: "NEXT_PUBLIC_LINKEDIN_URL", label: "LinkedIn", fallback: "#" },
  { key: "NEXT_PUBLIC_INSTAGRAM_URL", label: "Instagram", fallback: "#" },
  { key: "NEXT_PUBLIC_GITHUB_URL", label: "GitHub", fallback: "#" },
  { key: "NEXT_PUBLIC_TELEGRAM_URL", label: "Telegram", fallback: "#" },
];

function getSocialUrl(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

export default function AboutPage() {
  const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || "Dhruv";
  const ownerEmail = process.env.NEXT_PUBLIC_OWNER_EMAIL || "dxruxx@gmail.com";

  return (
    <div className="container py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          About <span className="gradient-text">AirdropIndia</span>
        </h1>
        <p className="mt-4 text-muted-foreground">
          AirdropIndia + CryptoTaxIndia are two free tools built for Indian
          crypto users. We&rsquo;re tired of clunky tax calculators that get
          Section 115BBH wrong and shady airdrop sites that link to phishing
          pages. So we built this.
        </p>

        <GlassCard className="mt-8 p-6">
          <h2 className="text-lg font-semibold">Built by {ownerName}</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Crypto enthusiast from India, passionate about making crypto
            accessible and safe for everyone. Building free tools that Indian
            crypto users actually need — no scams, no paywalls, no BS.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((s) => {
              const url = getSocialUrl(s.key, s.fallback);
              if (url === "#") return null;
              return (
                <a
                  key={s.key}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  {s.label}
                </a>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Contact: <a href={`mailto:${ownerEmail}`} className="text-brand-purple hover:underline">{ownerEmail}</a>
          </p>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">What we believe</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Tools should be free. Forever.</li>
            <li>• Every airdrop should have a safety guide.</li>
            <li>• Indian tax rules are strict — calculators must be exact.</li>
            <li>• No phishing, no scams, no &ldquo;sponsored&rdquo; airdrops.</li>
            <li>• Mobile-first. Most Indian crypto users are on phones.</li>
          </ul>
        </GlassCard>

        <GlassCard className="mt-4 p-6">
          <h2 className="text-lg font-semibold">Disclaimer</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Everything on this site is for informational purposes only and is
            not financial, legal, or tax advice. Always consult a Chartered
            Accountant for filing your ITR. Airdrops carry risk — never connect
            your main wallet, never sign suspicious transactions.
          </p>
        </GlassCard>

        <div className="mt-6 text-center">
          <Link href="/contact" className="text-sm text-brand-purple hover:underline">
            Have a question? Contact us &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
