import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { History, TrendingDown, TrendingUp } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { formatINR } from "@/lib/utils";
import type { TaxCalculationRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "My Tax History",
  description: "Your saved crypto tax calculations.",
  robots: { index: false, follow: false },
};

export default async function TaxHistoryPage() {
  if (!isSupabaseConfigured()) {
    return (
      <EmptyState
        title="Setup required"
        body="Connect Supabase to enable saving calculations to your history."
      />
    );
  }
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/auth/login?redirect=/tax/history");
  }

  const { data: rows, error } = await supabase
    .from("tax_calculations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return <EmptyState title="Something went wrong" body={error.message} />;
  }
  const calcs: TaxCalculationRow[] = rows ?? [];

  if (calcs.length === 0) {
    return (
      <div className="container py-12">
        <header className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            <span className="gradient-text">My Tax History</span>
          </h1>
          <p className="mt-3 text-zinc-400">
            Nothing here yet. Run a calculation and click &ldquo;Save to history&rdquo;.
          </p>
          <Button asChild className="mt-6">
            <Link href="/tax">Open calculator</Link>
          </Button>
        </header>
      </div>
    );
  }

  const totalTax = calcs.reduce((s, r) => s + (r.total_tax || 0), 0);
  const totalTds = calcs.reduce((s, r) => s + (r.tds || 0), 0);
  const totalPnL = calcs.reduce((s, r) => s + (r.profit_loss || 0), 0);

  return (
    <div className="container py-12">
      <header className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              <span className="gradient-text">My Tax History</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              {calcs.length} saved {calcs.length === 1 ? "calculation" : "calculations"}.
            </p>
          </div>
          <Button asChild size="sm" variant="secondary">
            <Link href="/tax">New calculation</Link>
          </Button>
        </div>
      </header>

      <div className="mx-auto mt-6 grid max-w-5xl gap-3 sm:grid-cols-3">
        <Stat label="Total tax payable" value={formatINR(totalTax)} accent="brand" />
        <Stat label="TDS this year" value={formatINR(totalTds)} accent="emerald" />
        <Stat
          label={totalPnL >= 0 ? "Net profit" : "Net loss"}
          value={formatINR(totalPnL)}
          accent={totalPnL >= 0 ? "emerald" : "rose"}
        />
      </div>

      <div className="mx-auto mt-6 max-w-5xl">
        <GlassCard className="overflow-hidden p-0">
          <ul className="divide-y divide-white/[0.05]">
            {calcs.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 px-5 py-4">
                <div>
                  <div className="text-sm font-medium">
                    {c.asset_name ?? "Crypto"} · {new Intl.DateTimeFormat("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }).format(new Date(c.created_at))}
                  </div>
                  <div className="mt-0.5 text-xs text-zinc-400">
                    {c.quantity} × ₹{c.buy_price} → ₹{c.sell_price}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-right">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">P/L</div>
                    <div
                      className={`text-sm font-medium ${
                        c.profit_loss >= 0 ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {c.profit_loss >= 0 ? (
                        <TrendingUp className="inline h-3 w-3" />
                      ) : (
                        <TrendingDown className="inline h-3 w-3" />
                      )}{" "}
                      {formatINR(c.profit_loss)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-zinc-500">Tax</div>
                    <div className="text-sm font-medium text-brand-glow">{formatINR(c.total_tax)}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="container py-16">
      <GlassCard className="mx-auto max-w-2xl p-8 text-center">
        <History className="mx-auto h-8 w-8 text-zinc-500" />
        <h1 className="mt-3 text-xl font-semibold">{title}</h1>
        <p className="mt-2 text-sm text-zinc-400">{body}</p>
      </GlassCard>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: "brand" | "emerald" | "rose";
}) {
  const tone =
    accent === "emerald"
      ? "text-emerald-300"
      : accent === "rose"
        ? "text-rose-300"
        : "text-brand-glow";
  return (
    <GlassCard className="p-4">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-1 text-xl font-semibold tabular-nums ${tone}`}>{value}</div>
    </GlassCard>
  );
}
