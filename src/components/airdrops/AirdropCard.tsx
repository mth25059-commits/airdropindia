"use client";

import Link from "next/link";
import { ArrowRight, Clock, Coins, Target } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Badge } from "@/components/ui/badge";
import { getChain, getDifficultyColor } from "@/lib/site";
import { formatUSD, formatRelative } from "@/lib/utils";
import type { AirdropRow } from "@/lib/supabase/types";

export function AirdropCard({ airdrop }: { airdrop: AirdropRow }) {
  const chain = getChain(airdrop.chain);
  const deadline = airdrop.deadline ? new Date(airdrop.deadline) : null;
  const expired = deadline ? deadline.getTime() < Date.now() : false;

  return (
    <Link href={`/airdrops/${airdrop.slug}`} className="block">
      <GlassCard className="h-full p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-sm font-semibold"
              style={chain ? { borderColor: `${chain.color}40` } : undefined}
            >
              {airdrop.name.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h3 className="text-base font-semibold leading-tight">
                {airdrop.name}
              </h3>
              <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-400">
                {chain && (
                  <span
                    className="inline-flex items-center gap-1"
                    style={{ color: chain.color }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: chain.color }}
                    />
                    {chain.label}
                  </span>
                )}
                {airdrop.status === "upcoming" && (
                  <Badge variant="brand">Upcoming</Badge>
                )}
                {airdrop.status === "ended" && (
                  <Badge variant="default">Ended</Badge>
                )}
              </div>
            </div>
          </div>
          {airdrop.difficulty && (
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${getDifficultyColor(
                airdrop.difficulty,
              )}`}
            >
              {airdrop.difficulty}
            </span>
          )}
        </div>

        {airdrop.description && (
          <p className="mt-3 line-clamp-2 text-sm text-zinc-400">
            {airdrop.description}
          </p>
        )}

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-2">
            <Coins className="h-3.5 w-3.5 text-brand-glow" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                Est. value
              </div>
              <div className="font-medium text-zinc-200">
                {airdrop.estimated_value_usd
                  ? formatUSD(airdrop.estimated_value_usd)
                  : "TBD"}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-white/5 bg-white/[0.02] px-2.5 py-2">
            <Clock className="h-3.5 w-3.5 text-brand-glow" />
            <div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                Deadline
              </div>
              <div className="font-medium text-zinc-200">
                {deadline
                  ? expired
                    ? "Ended"
                    : formatRelative(deadline)
                  : "Open"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-400">
            <Target className="h-3.5 w-3.5" />
            {airdrop.steps?.length ?? 0} steps
          </div>
          <span className="inline-flex items-center gap-1 text-brand-glow group-hover:gap-1.5 transition-all">
            Read guide <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}
