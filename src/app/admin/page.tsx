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
import { AdminDeleteButton } from "./AdminDeleteButton";
import type { AirdropRow, SubscriberRow, BlogPostRow, ContactMessageRow } from "@/lib/supabase/types";

export const metadata: Metadata = {
  title: "Admin Panel",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!isSupabaseConfigured()) {
    return (
      <Wrap>
        <GlassCard className="p-8 text-center">
          <h1 className="text-2xl font-semibold">Setup required</h1>
          <p className="mt-2 text-sm text-muted-foreground">
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
          <p className="mt-2 text-sm text-muted-foreground">
            Logged in as <strong>{userData.user.email}</strong>. Only the
            admin email(s) configured in <code>ADMIN_EMAILS</code> can see this page.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Currently configured admins: {getAdminEmails().join(", ") || "(none)"}.
          </p>
        </GlassCard>
      </Wrap>
    );
  }

  const [
    { data: airdrops },
    { data: subscribers },
    { data: blogPosts },
    { data: contactMessages },
  ] = await Promise.all([
    supabase.from("airdrops").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("subscribers").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("blog_posts").select("*").order("created_at", { ascending: false }).limit(20),
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(20),
  ]);

  const ads = (airdrops ?? []) as AirdropRow[];
  const subs = (subscribers ?? []) as SubscriberRow[];
  const blogs = (blogPosts ?? []) as BlogPostRow[];
  const contacts = (contactMessages ?? []) as ContactMessageRow[];

  return (
    <Wrap>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            <span className="gradient-text">Admin Panel</span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage airdrops, blogs, subscribers, and messages.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{userData.user.email}</span>
          <form action="/auth/signout" method="post">
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      {/* Stats */}
      <div className="mt-6 grid gap-3 sm:grid-cols-4">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold">{ads.length}</div>
          <div className="text-xs text-muted-foreground">Airdrops</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold">{blogs.length}</div>
          <div className="text-xs text-muted-foreground">Blog posts</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold">{subs.length}</div>
          <div className="text-xs text-muted-foreground">Subscribers</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold">{contacts.filter((c) => !c.read).length}</div>
          <div className="text-xs text-muted-foreground">Unread messages</div>
        </GlassCard>
      </div>

      {/* Airdrop management */}
      <section className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Add a new airdrop</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Optional: click &ldquo;AI generate guide&rdquo; to auto-fill steps via Groq.
          </p>
          <div className="mt-4">
            <AdminAirdropForm />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Recent airdrops</h2>
          <p className="mt-1 text-xs text-muted-foreground">Latest 20 in DB.</p>
          <ul className="mt-3 divide-y divide-border">
            {ads.length === 0 && (
              <li className="py-4 text-sm text-muted-foreground">
                None yet. Add one — or run the seed migration.
              </li>
            )}
            {ads.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2 text-sm">
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/airdrops/${a.slug}`}
                    className="font-medium hover:text-brand-glow"
                  >
                    {a.name}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {a.chain} · {a.status} · {a.difficulty ?? "—"}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(a.created_at).toLocaleDateString("en-IN")}
                  </span>
                  <AdminDeleteButton endpoint={`/api/admin/airdrops/${a.id}`} label={a.name} />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>

      {/* Blog management */}
      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Create a blog post</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Write in Markdown. Add SEO excerpt, category, and tags. Published immediately.
          </p>
          <div className="mt-4">
            <AdminBlogForm />
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Recent blog posts</h2>
          <p className="mt-1 text-xs text-muted-foreground">Latest 20 in DB.</p>
          <ul className="mt-3 divide-y divide-border">
            {blogs.length === 0 && (
              <li className="py-4 text-sm text-muted-foreground">No blog posts yet.</li>
            )}
            {blogs.map((b) => (
              <li key={b.id} className="flex items-center justify-between py-2 text-sm">
                <div className="min-w-0 flex-1">
                  <Link href={`/blog/${b.slug}`} className="font-medium hover:text-brand-glow">
                    {b.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    {b.category ?? "—"} · {b.published ? "Published" : "Draft"} · {b.views} views
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {new Date(b.created_at).toLocaleDateString("en-IN")}
                  </span>
                  <AdminDeleteButton endpoint={`/api/admin/blog/${b.id}`} label={b.title} />
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>

      {/* Contact messages */}
      <section className="mt-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Contact messages</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {contacts.filter((c) => !c.read).length} unread / {contacts.length} total shown.
          </p>
          <ul className="mt-3 divide-y divide-border">
            {contacts.length === 0 && (
              <li className="py-4 text-sm text-muted-foreground">No messages yet.</li>
            )}
            {contacts.map((c) => (
              <li key={c.id} className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{c.name}</span>
                      {!c.read && (
                        <span className="rounded-full bg-brand-purple/20 px-2 py-0.5 text-[10px] font-medium text-brand-purple">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{c.email}</div>
                    {c.subject && <div className="mt-1 text-sm font-medium">{c.subject}</div>}
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.message}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(c.created_at).toLocaleDateString("en-IN")}
                    </span>
                    <AdminDeleteButton endpoint={`/api/admin/contact/${c.id}`} label="message" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </GlassCard>
      </section>

      {/* Subscribers */}
      <section className="mt-6">
        <GlassCard className="p-6">
          <h2 className="text-lg font-semibold">Subscribers</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {subs.length} shown / latest first.
          </p>
          <ul className="mt-3 divide-y divide-border">
            {subs.length === 0 && (
              <li className="py-4 text-sm text-muted-foreground">No subscribers yet.</li>
            )}
            {subs.map((s) => (
              <li key={s.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div className="font-medium">{s.email}</div>
                  <div className="text-xs text-muted-foreground">
                    {s.confirmed ? "Confirmed" : "Pending"} ·{" "}
                    {s.chains.length ? s.chains.join(", ") : "all chains"}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
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
