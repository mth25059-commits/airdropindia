"use client";

import * as React from "react";
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => null,
});

/**
 * Ambient 3D background — drifting particles + slow-rotating wireframe geometry.
 * Heavy lifting is lazy-loaded so first paint isn't blocked.
 * Falls back to a static CSS gradient on small screens, low-end devices,
 * or for users who prefer reduced motion.
 */
export function ParticleBackground() {
  const [mount, setMount] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.matchMedia("(max-width: 640px)").matches;
    const lowMem =
      // @ts-expect-error - deviceMemory is non-standard
      typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 2;
    if (reduced || small || lowMem) {
      setMount(false);
      return;
    }
    // Defer mount until after first paint
    const id = window.setTimeout(() => setMount(true), 80);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 -z-0">
      {/* Always-on base gradient (fallback + base layer for 3D scene) */}
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_-10%,rgba(139,92,246,0.15),transparent_60%),radial-gradient(60%_40%_at_90%_30%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(45%_30%_at_10%_70%,rgba(168,85,247,0.08),transparent_60%)]" />
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background to-transparent" />
      {mount && (
        <div className="absolute inset-0 opacity-60">
          <Scene />
        </div>
      )}
    </div>
  );
}
