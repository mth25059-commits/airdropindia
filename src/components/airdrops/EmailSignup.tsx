"use client";

import * as React from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";

export function EmailSignup() {
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = React.useState<string>("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setState("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.message ?? "Could not subscribe — try again.");
        return;
      }
      setState("success");
      setMessage(
        data.message ??
          "Check your inbox to confirm your subscription.",
      );
      setEmail("");
    } catch {
      setState("error");
      setMessage("Network error — try again.");
    }
  }

  return (
    <GlassCard intensity="strong" className="p-6 sm:p-8">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-glow ring-1 ring-brand-purple/20">
          <Mail className="h-5 w-5" />
        </span>
        <div>
          <h3 className="text-lg font-semibold">Get alerts for new airdrops</h3>
          <p className="mt-1 text-sm text-zinc-400">
            One-line emails when a new airdrop lands. Unsubscribe anytime.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="sm:flex-1"
          disabled={state === "loading"}
        />
        <Button type="submit" disabled={state === "loading"}>
          {state === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subscribing…
            </>
          ) : state === "success" ? (
            <>
              <CheckCircle2 className="h-4 w-4" /> Subscribed
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </form>
      {message && (
        <p
          className={`mt-3 text-xs ${
            state === "error" ? "text-rose-400" : "text-emerald-400"
          }`}
        >
          {message}
        </p>
      )}
    </GlassCard>
  );
}
