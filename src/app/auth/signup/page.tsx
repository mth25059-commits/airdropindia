import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LoginButtons } from "../login/LoginButtons";
import { GlassCard } from "@/components/shared/GlassCard";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your AirdropIndia account.",
  robots: { index: false, follow: false },
};

export default function SignupPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
  const redirectTo = searchParams.redirect ?? "/";
  const oauthError = searchParams.error;

  return (
    <div className="container py-16 sm:py-24">
      <GlassCard intensity="strong" className="mx-auto max-w-md p-8 text-center">
        <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient shadow-glow">
          <Sparkles className="h-6 w-6 text-white" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Sign up to track airdrops, calculate crypto tax, and get alerts.
        </p>

        {oauthError && (
          <p className="mt-4 rounded-lg bg-rose-500/10 px-4 py-2 text-xs text-rose-400">
            Sign up failed. Make sure Google OAuth is configured in your Supabase
            dashboard (Authentication &rarr; Providers &rarr; Google).
          </p>
        )}

        <div className="mt-6">
          <LoginButtons redirectTo={redirectTo} />
        </div>

        <p className="mt-6 text-sm text-zinc-400">
          Already have an account?{" "}
          <Link
            href={`/auth/login${redirectTo !== "/" ? `?redirect=${encodeURIComponent(redirectTo)}` : ""}`}
            className="font-medium text-brand-purple hover:underline"
          >
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-xs text-zinc-500">
          By signing up you agree to our{" "}
          <Link href="/terms" className="underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="underline">
            Privacy Policy
          </Link>
          .
        </p>
      </GlassCard>
    </div>
  );
}
