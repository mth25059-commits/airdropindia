"use client";

import * as React from "react";
import { motion } from "framer-motion";
import {
  Calculator,
  Download,
  Loader2,
  Save,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  calculateTax,
  TAX_RATE,
  CESS_RATE,
  TDS_RATE,
  type TaxInput,
  type TaxResult,
  type SurchargeBracket,
} from "@/lib/tax/calculator";
import { formatINR } from "@/lib/utils";

interface Props {
  initialInputs?: Partial<TaxInput>;
  isLoggedIn?: boolean;
}

export function TaxCalculator({ initialInputs, isLoggedIn }: Props) {
  const today = new Date().toISOString().slice(0, 10);
  const [asset, setAsset] = React.useState(initialInputs?.assetName ?? "");
  const [buyPrice, setBuyPrice] = React.useState<string>(
    String(initialInputs?.buyPrice ?? "1000"),
  );
  const [sellPrice, setSellPrice] = React.useState<string>(
    String(initialInputs?.sellPrice ?? "2500"),
  );
  const [quantity, setQuantity] = React.useState<string>(
    String(initialInputs?.quantity ?? "100"),
  );
  const [buyDate, setBuyDate] = React.useState<string>(initialInputs?.buyDate ?? today);
  const [sellDate, setSellDate] = React.useState<string>(initialInputs?.sellDate ?? today);
  const [surcharge, setSurcharge] = React.useState<string>("0");
  const [specifiedPerson, setSpecifiedPerson] = React.useState(false);
  const [yearlyTotal, setYearlyTotal] = React.useState<string>("0");

  const [aiOpen, setAiOpen] = React.useState(false);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiText, setAiText] = React.useState<string>("");
  const [saving, setSaving] = React.useState(false);
  const [savedMessage, setSavedMessage] = React.useState<string | null>(null);

  const input: TaxInput = React.useMemo(
    () => ({
      assetName: asset || undefined,
      buyPrice: parseFloat(buyPrice) || 0,
      sellPrice: parseFloat(sellPrice) || 0,
      quantity: parseFloat(quantity) || 0,
      buyDate,
      sellDate,
      surchargeOverride: (parseFloat(surcharge) || 0) as SurchargeBracket,
      isSpecifiedPerson: specifiedPerson,
      yearlyTransferTotal: parseFloat(yearlyTotal) || undefined,
    }),
    [asset, buyPrice, sellPrice, quantity, buyDate, sellDate, surcharge, specifiedPerson, yearlyTotal],
  );

  const result: TaxResult = React.useMemo(() => calculateTax(input), [input]);

  async function explainWithAi() {
    setAiOpen(true);
    setAiLoading(true);
    setAiText("");
    try {
      const res = await fetch("/api/ai/explain-tax", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          buyPrice: input.buyPrice,
          sellPrice: input.sellPrice,
          quantity: input.quantity,
          profitLoss: result.profitLoss,
          taxableGain: result.taxableGain,
          totalTax: result.totalTax,
          tds: result.tds,
          asset: input.assetName ?? null,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        setAiText(data.message ?? "AI explanation isn't available right now. (Hook up your GROQ_API_KEY to enable this.)");
        return;
      }
      const data = (await res.json()) as { ok: boolean; explanation?: string };
      setAiText(data.explanation ?? "");
    } catch {
      setAiText("Could not fetch AI explanation — please try again.");
    } finally {
      setAiLoading(false);
    }
  }

  async function saveCalculation() {
    if (!isLoggedIn) {
      window.location.href = "/auth/login?redirect=/tax";
      return;
    }
    setSaving(true);
    setSavedMessage(null);
    try {
      const res = await fetch("/api/tax/save", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          asset_name: input.assetName ?? null,
          buy_price: input.buyPrice,
          sell_price: input.sellPrice,
          quantity: input.quantity,
          buy_date: input.buyDate,
          sell_date: input.sellDate,
          total_buy: result.totalBuy,
          total_sell: result.totalSell,
          profit_loss: result.profitLoss,
          taxable_gain: result.taxableGain,
          base_tax: result.baseTax,
          cess: result.cess,
          total_tax: result.totalTax,
          tds: result.tds,
        }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      setSavedMessage(data.ok ? "Saved to your history." : data.message ?? "Could not save.");
    } catch {
      setSavedMessage("Could not save — try again.");
    } finally {
      setSaving(false);
    }
  }

  function downloadPdf() {
    const params = new URLSearchParams({
      buyPrice: String(input.buyPrice),
      sellPrice: String(input.sellPrice),
      quantity: String(input.quantity),
      asset: input.assetName ?? "",
      buyDate: input.buyDate ?? "",
      sellDate: input.sellDate ?? "",
      surcharge: String(surcharge),
      specifiedPerson: specifiedPerson ? "1" : "0",
      yearlyTransferTotal: String(yearlyTotal),
    });
    window.open(`/api/tax/pdf?${params.toString()}`, "_blank");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* INPUTS */}
      <GlassCard className="p-6 sm:p-8">
        <header className="mb-4 flex items-center gap-2">
          <Calculator className="h-5 w-5 text-brand-glow" />
          <h2 className="text-lg font-semibold">Your trade</h2>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="asset">Asset (optional)</Label>
            <Input
              id="asset"
              placeholder="BTC, ETH, SOL…"
              className="mt-1"
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="buyPrice">Buy price (₹ per unit)</Label>
            <Input
              id="buyPrice"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              className="mt-1"
              value={buyPrice}
              onChange={(e) => setBuyPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sellPrice">Sell price (₹ per unit)</Label>
            <Input
              id="sellPrice"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              className="mt-1"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              className="mt-1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="surcharge">Surcharge bracket</Label>
            <Select value={surcharge} onValueChange={setSurcharge}>
              <SelectTrigger id="surcharge" className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (income under ₹50L)</SelectItem>
                <SelectItem value="0.1">10% (income ₹50L–1Cr)</SelectItem>
                <SelectItem value="0.15">15% (income ₹1Cr–2Cr)</SelectItem>
                <SelectItem value="0.25">25% (income ₹2Cr–5Cr)</SelectItem>
                <SelectItem value="0.37">37% (income over ₹5Cr)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="buyDate">Buy date</Label>
            <Input
              id="buyDate"
              type="date"
              className="mt-1"
              value={buyDate}
              onChange={(e) => setBuyDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sellDate">Sell date</Label>
            <Input
              id="sellDate"
              type="date"
              className="mt-1"
              value={sellDate}
              onChange={(e) => setSellDate(e.target.value)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="yearlyTotal">Total VDA sells this FY so far (optional)</Label>
            <Input
              id="yearlyTotal"
              type="number"
              inputMode="decimal"
              min={0}
              step="any"
              className="mt-1"
              value={yearlyTotal}
              onChange={(e) => setYearlyTotal(e.target.value)}
              placeholder="Leave 0 to use only this trade"
            />
            <p className="mt-1 text-xs text-zinc-500">
              Used to check the ₹10,000 / ₹50,000 TDS threshold under Section 194S.
            </p>
          </div>
          <div className="sm:col-span-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-white/[0.05] text-brand-purple"
                checked={specifiedPerson}
                onChange={(e) => setSpecifiedPerson(e.target.checked)}
              />
              I&rsquo;m a &ldquo;specified person&rdquo; (₹50,000 TDS threshold applies)
            </label>
          </div>
        </div>
      </GlassCard>

      {/* RESULTS */}
      <GlassCard intensity="strong" className="p-6 sm:p-8">
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your tax</h2>
          <span
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs ${
              result.isProfit
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-300"
            }`}
          >
            {result.isProfit ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {result.isProfit ? "Profit" : "Loss"}
          </span>
        </header>

        <div className="space-y-1.5">
          <Row label="Total buy value" value={formatINR(result.totalBuy)} />
          <Row label="Total sell value" value={formatINR(result.totalSell)} />
          <Row
            label={result.isProfit ? "Profit" : "Loss"}
            value={formatINR(result.profitLoss)}
            valueClass={result.isProfit ? "text-emerald-300" : "text-rose-300"}
          />
        </div>

        <hr className="my-5 border-white/[0.06]" />

        <div className="space-y-1.5">
          <Row
            label={`Base tax (${(TAX_RATE * 100).toFixed(0)}%)`}
            value={formatINR(result.baseTax)}
          />
          {result.surcharge > 0 && (
            <Row
              label={`Surcharge (${(result.surchargeRate * 100).toFixed(0)}%)`}
              value={formatINR(result.surcharge)}
            />
          )}
          <Row
            label={`Cess (${(CESS_RATE * 100).toFixed(0)}%)`}
            value={formatINR(result.cess)}
          />
          <Row
            label="Total tax payable"
            value={formatINR(result.totalTax)}
            valueClass="text-brand-glow font-semibold"
          />
          <Row
            label={`TDS u/s 194S (${(TDS_RATE * 100).toFixed(0)}%)`}
            value={formatINR(result.tds)}
          />
          <Row label="Effective rate" value={`${(result.effectiveRate * 100).toFixed(2)}%`} />
        </div>

        <hr className="my-5 border-white/[0.06]" />

        <motion.div
          key={result.netCashFromSale}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl bg-brand-gradient-soft p-4 text-center"
        >
          <p className="text-xs uppercase tracking-wider text-brand-glow">
            Net cash after tax + TDS
          </p>
          <p className="mt-1 text-2xl font-semibold">
            {formatINR(result.netCashFromSale)}
          </p>
        </motion.div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button onClick={explainWithAi} variant="secondary" size="sm">
            <Sparkles className="h-4 w-4" /> Explain with AI
          </Button>
          <Button onClick={downloadPdf} variant="secondary" size="sm">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
          <Button onClick={saveCalculation} variant="outline" size="sm" disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isLoggedIn ? "Save to history" : "Login to save"}
          </Button>
        </div>
        {savedMessage && (
          <p className="mt-2 text-xs text-zinc-400">{savedMessage}</p>
        )}

        {aiOpen && (
          <div className="mt-5 rounded-xl border border-brand-purple/30 bg-brand-gradient-soft p-4 text-sm text-zinc-200">
            <header className="mb-2 flex items-center gap-2 text-brand-glow">
              <Sparkles className="h-4 w-4" />
              <strong>AI explanation</strong>
            </header>
            {aiLoading ? (
              <p className="text-zinc-400">Generating explanation…</p>
            ) : (
              <p className="whitespace-pre-wrap text-zinc-300">{aiText}</p>
            )}
          </div>
        )}

        <details className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
          <summary className="cursor-pointer text-xs font-medium text-zinc-300">
            Show notes ({result.notes.length})
          </summary>
          <ul className="mt-2 space-y-1.5 text-xs text-zinc-400">
            {result.notes.map((n, i) => (
              <li key={i}>• {n}</li>
            ))}
          </ul>
        </details>
      </GlassCard>
    </div>
  );
}

function Row({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-400">{label}</span>
      <span className={`tabular-nums ${valueClass ?? "text-zinc-100"}`}>{value}</span>
    </div>
  );
}
