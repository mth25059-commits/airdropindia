"use client";

import * as React from "react";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CHAINS, DIFFICULTIES, STATUSES } from "@/lib/site";

export function AdminAirdropForm() {
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [steps, setSteps] = React.useState<Array<{ title: string; body: string }>>([]);
  const [body, setBody] = React.useState("");
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  // form refs
  const [name, setName] = React.useState("");
  const [chain, setChain] = React.useState("ethereum");
  const [description, setDescription] = React.useState("");
  const [officialUrl, setOfficialUrl] = React.useState("");
  const [estimatedValueUsd, setEstimatedValueUsd] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("easy");
  const [status, setStatus] = React.useState("active");

  async function generateGuide() {
    if (!name) {
      setAiError("Add a name first.");
      return;
    }
    setAiError(null);
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/generate-guide", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          chain,
          description: description || null,
          officialUrl: officialUrl || null,
          estimatedValueUsd: estimatedValueUsd ? Number(estimatedValueUsd) : null,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
        guide?: {
          title: string;
          excerpt: string;
          body: string;
          steps: Array<{ title: string; body: string }>;
        };
      };
      if (!res.ok || !data.ok || !data.guide) {
        setAiError(data.message ?? "AI generation failed.");
        return;
      }
      setSteps(data.guide.steps);
      setBody(data.guide.body);
    } catch {
      setAiError("Network error.");
    } finally {
      setAiLoading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/airdrops", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          chain,
          description: description || null,
          official_url: officialUrl || null,
          estimated_value_usd: estimatedValueUsd ? Number(estimatedValueUsd) : null,
          difficulty,
          status,
          steps,
          ai_generated_guide: steps.length > 0,
          blog_body: body || null,
        }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setMessage(data.message ?? "Could not save.");
        return;
      }
      setMessage("Saved.");
      setName("");
      setDescription("");
      setOfficialUrl("");
      setEstimatedValueUsd("");
      setSteps([]);
      setBody("");
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          required
          className="mt-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="chain">Chain</Label>
          <Select value={chain} onValueChange={setChain}>
            <SelectTrigger id="chain" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CHAINS.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger id="difficulty" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DIFFICULTIES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status" className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="value">Estimated value (USD)</Label>
          <Input
            id="value"
            type="number"
            inputMode="decimal"
            step="any"
            className="mt-1"
            value={estimatedValueUsd}
            onChange={(e) => setEstimatedValueUsd(e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="officialUrl">Official URL</Label>
        <Input
          id="officialUrl"
          type="url"
          className="mt-1"
          value={officialUrl}
          onChange={(e) => setOfficialUrl(e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={3}
          className="mt-1 flex min-h-[80px] w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={generateGuide}
          disabled={aiLoading}
        >
          {aiLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          AI generate guide
        </Button>
        {aiError && <p className="mt-2 text-xs text-rose-400">{aiError}</p>}
      </div>

      {steps.length > 0 && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-3 text-xs">
          <p className="font-medium text-emerald-300">
            Generated {steps.length} step{steps.length === 1 ? "" : "s"} + blog body.
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-zinc-300">
            {steps.map((s, i) => (
              <li key={i}>
                <strong>{s.title}</strong> — {s.body}
              </li>
            ))}
          </ol>
        </div>
      )}

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Save airdrop
      </Button>
      {message && <p className="text-xs text-zinc-400">{message}</p>}
    </form>
  );
}
