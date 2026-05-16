import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AirdropIndia · CryptoTaxIndia",
    short_name: "AirdropIndia",
    description:
      "Crypto airdrops for India + 30% / 1% TDS crypto tax calculator.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#8b5cf6",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
    ],
  };
}
