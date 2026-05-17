import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Calculator, History, Mail } from "lucide-react";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { isCurrentUserAdmin } from "@/lib/admin";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your saved tax calculations and subscription preferences.",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="container py-16">
        <GlassCard className="mx-auto max-w-2xl p-8 text-center">
          <h1 className="text-2xl font-semibold">Setup required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Configure Supabase env vars to enable the dashboard.
          </p>
        </GlassCard>
      </div>
    );
  }
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/auth/login?redirect=/dashboard");
  }
  const isAdmin = await isCurrentUserAdmin();

  const { count: calcCount } = await supabase
    .from("tax_calculations")
    .select("id", { count: "exact", head: true });

  return (
    <div className="container py-12">
      <header className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          <span className="gradient-text">My Dashboard</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {userData.user.email}
        </p>
      </header>

      <div className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          icon={Calculator}
          title="New tax calculation"
          body="Compute 30% + 1% TDS in seconds."
          href="/tax"
        />
        <Card
          icon={History}
          title="My tax history"
          body={`${calcCount ?? 0} saved calculations.`}
          href="/tax/history"
        />
        <Card
          icon={Mail}
          title="Airdrop alerts"
          body="Subscribe to email alerts for new airdrops."
          href="/airdrops"
        />
        {isAdmin && (
          <Card
            icon={Calculator}
            title="Admin panel"
            body="Add airdrops, generate AI guides."
            href="/admin"
          />
        )}
      </div>

      <div className="mx-auto mt-8 max-w-5xl">
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  body,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <GlassCard className="h-full p-5">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient-soft text-brand-glow ring-1 ring-brand-purple/20">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{body}</p>
      </GlassCard>
    </Link>
  );
}
