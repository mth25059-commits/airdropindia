export const SITE = {
  name: "AirdropIndia",
  longName: "AirdropIndia + CryptoTaxIndia",
  tagline: "Free crypto airdrops · Indian crypto tax calculator",
  description:
    "AirdropIndia tracks the best crypto airdrops for Indian users with step-by-step claim guides. CryptoTaxIndia calculates your 30% + 1% TDS crypto tax (Section 115BBH & 194S) — with downloadable PDF and AI explanations.",
  keywords: [
    "crypto airdrop India",
    "crypto airdrop India 2025",
    "free crypto airdrop list",
    "best airdrops this week",
    "crypto tax India calculator",
    "30% crypto tax India",
    "1% TDS crypto India",
    "Section 115BBH calculator",
    "Section 194S TDS",
    "crypto tax calculator India 2025",
    "VDA tax India",
  ],
  twitter: "@airdropindia",
  ogImage: "/og-image.png",
  author: "AirdropIndia",
  emailFrom: "alerts@airdropindia.in",
};

export const CHAINS = [
  { id: "ethereum", label: "Ethereum", color: "#627eea" },
  { id: "solana", label: "Solana", color: "#9945ff" },
  { id: "bnb", label: "BNB", color: "#f0b90b" },
  { id: "polygon", label: "Polygon", color: "#8247e5" },
  { id: "arbitrum", label: "Arbitrum", color: "#28a0f0" },
  { id: "base", label: "Base", color: "#0052ff" },
  { id: "optimism", label: "Optimism", color: "#ff0420" },
] as const;

export type ChainId = (typeof CHAINS)[number]["id"];

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export const STATUSES = ["active", "upcoming", "ended"] as const;
export type Status = (typeof STATUSES)[number];

export function getChain(id: string) {
  return CHAINS.find((c) => c.id === id);
}

export function getDifficultyColor(d: Difficulty | string): string {
  switch (d) {
    case "easy":
      return "text-emerald-300 bg-emerald-500/10 border-emerald-500/20";
    case "medium":
      return "text-amber-300 bg-amber-500/10 border-amber-500/20";
    case "hard":
      return "text-rose-300 bg-rose-500/10 border-rose-500/20";
    default:
      return "text-muted-foreground bg-white/5 border-border";
  }
}
