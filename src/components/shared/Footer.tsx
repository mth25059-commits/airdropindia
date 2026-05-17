import Link from "next/link";
import { Sparkles, Github, Twitter } from "lucide-react";
import { SITE } from "@/lib/site";

const cols = [
  {
    title: "Products",
    links: [
      { href: "/airdrops", label: "Airdrop Tracker" },
      { href: "/tax", label: "Tax Calculator" },
      { href: "/tax/examples", label: "Tax Examples" },
      { href: "/airdrops/submit", label: "Submit Airdrop" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/blog/india-crypto-tax-2025", label: "India Crypto Tax 2025" },
      { href: "/blog/how-to-claim-airdrops-safely", label: "Stay Safe" },
      { href: "/blog/section-115bbh-vs-194s", label: "115BBH vs 194S" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="container py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient shadow-glow">
                <Sparkles className="h-4 w-4 text-white" />
              </span>
              <span className="text-base font-semibold tracking-tight">
                <span className="gradient-text">AirdropIndia</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              {SITE.description}
            </p>
            <div className="mt-4 flex gap-2">
              <a
                href="https://twitter.com"
                aria-label="Twitter"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                aria-label="GitHub"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="mb-3 text-sm font-semibold text-foreground">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Built for Indian crypto
            users.
          </p>
          <p className="text-center sm:text-right">
            Not tax advice. Always consult a CA before filing.
          </p>
        </div>
      </div>
    </footer>
  );
}
