import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { GlassCard } from "@/components/shared/GlassCard";
import { Button } from "@/components/ui/button";
import { isCurrentUserAdmin, getAdminEmails } from "@/lib/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import { AdminAirdropForm } from "./AdminAirdropForm";
import { AdminBlogForm } from "./AdminBlogForm";
import type { AirdropRow, SubscriberRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Wrap>
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-semibold">Setup required</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Configure Supabase env vars to enable the admin panel.
          </p>
        </GlassCard>
      </Wrap>
    );
  }

  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    redirect("/auth/login?redirect=/admin");
  }
  if (!(await isCurrentUserAdmin())) {
    return (
      <Wrap>
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-semibold">Not authorised</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Logged in as <strong>{userData.user.email}</strong>. Only the
            admin email(s) configured in <code>ADMIN_EMAIL</code> /{" "}
            <code>ADMIN_EMAILS</code> can see this page.
          </p>
          <p className="mt-2 text-xs text-zinc-500">
            Currently configured admins: {getAdminEmails().join(", ") || "(none)"}.
          </p>
        </GlassCard>
      </Wrap>
    );
  }

  const [{ data: airdrops }, { data: subscribers }] = await Promise.all([
    supabase
      .from("airdrops")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("subscribers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const ads = (airdrops ?? []) as AirdropRow[];
  const subs = (subscribers ?? []) as SubscriberRow[];

  return (
    <Wrap>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="gradient-text">Admin</span>
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Add airdrops, generate AI guides, manage subscribers.
          </p>
        </div>
        <form action="/auth/signout" method="post">
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Add a new airdrop</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Optional: click &ldquo;AI generate guide&rdquo; to auto-fill steps via Groq.
          </p>
          <div className="mt-4">
            <AdminAirdropForm />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Recent airdrops</h2>
          <p className="mt-1 text-xs text-zinc-500">Latest 20 in DB.</p>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {ads.length === 0 && (
              <li className="py-4 text-sm text-zinc-400">
                None yet. Add one — or run the seed migration.
              </li>
            )}
            {ads.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <Link
                    href={`/airdrops/${a.slug}`}
                    className="font-medium hover:text-brand-glow"
                  >
                    {a.name}
                  </Link>
                  <div className="text-xs text-zinc-500">
                    {a.chain} · {a.status} · {a.difficulty ?? "—"}
                  </div>
                </div>
                <span className="text-xs text-zinc-500">
                  {new Date(a.created_at).toLocaleDateString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>

      <section className="mt-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Create a blog post</h2>
          <p className="mt-1 text-xs text-zinc-500">
            Write a standalone blog post (Markdown). Published immediately.
          </p>
          <div className="mt-4">
            <AdminBlogForm />
          </div>
        </GlassCard>
      </section>

      <section className="mt-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Subscribers</h2>
          <p className="mt-1 text-xs text-zinc-500">
            {subs.length} shown / latest first.
          </p>
          <ul className="mt-3 divide-y divide-white/[0.05]">
            {subs.length === 0 && (
              <li className="py-4 text-sm text-zinc-400">No subscribers yet.</li>
            )}
            {subs.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div className="font-medium">{s.email}</div>
                  <div className="text-xs text-zinc-500">
                    {s.confirmed ? "✓ confirmed" : "pending"} ·{" "}
                    {s.chains.length ? s.chains.join(", ") : "all chains"}
                  </div>
                </div>
                <span className="text-xs text-zinc-500">
                  {new Date(s.created_at).toLocaleDateString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>
    </Wrap>
  );
}

function Wrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl">{children}</div>
    </div>
  );
}
