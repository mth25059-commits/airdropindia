"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
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
import { CHAINS } from "@/lib/site";

export default function SubmitAirdropPage() {
  const [state, setState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get("name"),
      chain: formData.get("chain"),
      description: formData.get("description"),
      official_url: formData.get("official_url"),
      submitter_email: formData.get("submitter_email"),
    };
    try {
      const res = await fetch("/api/airdrops/submit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.message ?? "Submission failed.");
        return;
      }
      setState("success");
      setMessage(
        "Got it — we'll review and publish within 24h. You'll be credited on the post.",
      );
      e.currentTarget.reset();
    } catch {
      setState("error");
      setMessage("Network error — try again.");
    }
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
          Submit an <span className="gradient-text">airdrop</span>
        </h1>
        <p className="mt-3 text-muted-foreground">
          Spotted a fresh airdrop? Tell us — we&apos;ll review and publish a guide.
        </p>

        <GlassCard className="mt-8 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Airdrop name</Label>
              <Input id="name" name="name" required className="mt-1" placeholder="e.g. Berachain Genesis" />
            </div>
            <div>
              <Label htmlFor="chain">Chain</Label>
              <Select name="chain" defaultValue="ethereum">
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select chain" />
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
              <Label htmlFor="description">What is it?</Label>
              <textarea
                id="description"
                name="description"
                rows={4}
                className="mt-1 flex min-h-[100px] w-full rounded-xl border border-border bg-input px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                placeholder="Tell us what it is, how to qualify, link to the announcement…"
              />
            </div>
            <div>
              <Label htmlFor="official_url">Official URL</Label>
              <Input
                id="official_url"
                name="official_url"
                type="url"
                required
                className="mt-1"
                placeholder="https://…"
              />
            </div>
            <div>
              <Label htmlFor="submitter_email">Your email (optional, for credit)</Label>
              <Input
                id="submitter_email"
                name="submitter_email"
                type="email"
                className="mt-1"
                placeholder="you@example.com"
              />
            </div>

            <Button type="submit" className="w-full" disabled={state === "loading"}>
              {state === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : state === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Submitted
                </>
              ) : (
                "Submit airdrop"
              )}
            </Button>

            {message && (
              <p
                className={`text-xs ${
                  state === "error" ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                {message}
              </p>
            )}
          </form>
        </GlassCard>

        <p className="mt-6 text-xs text-muted-foreground">
          We review every submission manually. No spam, no rug-pulls, no
          obvious scams.
        </p>
      </div>
    </div>
  );
}
