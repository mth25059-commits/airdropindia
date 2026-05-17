"use client";

import * as React from "react";
import { Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/shared/GlassCard";

export default function ContactPage() {
  const [state, setState] = React.useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = React.useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    setMessage("");
    const fd = new FormData(e.currentTarget);
    const payload = {
      name: fd.get("name"),
      email: fd.get("email"),
      subject: fd.get("subject") || undefined,
      message: fd.get("message"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.message ?? "Failed to send message.");
        return;
      }
      setState("success");
      setMessage(data.message ?? "Message sent successfully!");
      e.currentTarget.reset();
    } catch {
      setState("error");
      setMessage("Network error — please try again.");
    }
  }

  return (
    <div className="container py-16 sm:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
            <Mail className="h-6 w-6 text-white" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              <span className="gradient-text">Contact us</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Got a question, suggestion, or found a bug? Drop us a message.
            </p>
          </div>
        </div>

        <GlassCard className="mt-8 p-6 sm:p-8">
          {state === "success" ? (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </span>
              <h2 className="mt-4 text-xl font-semibold">Message sent!</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Thanks for reaching out. We&apos;ll get back to you as soon as possible.
              </p>
              <Button
                className="mt-6"
                variant="secondary"
                onClick={() => { setState("idle"); setMessage(""); }}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required className="mt-1" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required className="mt-1" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <Label htmlFor="subject">Subject (optional)</Label>
                <Input id="subject" name="subject" className="mt-1" placeholder="What is this about?" />
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  className="mt-1 flex min-h-[120px] w-full rounded-xl border border-border bg-input px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
                  placeholder="Tell us what's on your mind..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={state === "loading"}>
                {state === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </Button>

              {state === "error" && message && (
                <p className="text-xs text-rose-400">{message}</p>
              )}
            </form>
          )}
        </GlassCard>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Email us directly</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              dxruxx@gmail.com
            </p>
          </GlassCard>
          <GlassCard className="p-5">
            <h3 className="text-sm font-semibold">Response time</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We usually reply within 24 hours.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
