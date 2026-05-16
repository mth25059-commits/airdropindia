import { NextResponse } from "next/server";
import { z } from "zod";
import { isCurrentUserAdmin } from "@/lib/admin";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getResend, isResendConfigured, FROM_EMAIL } from "@/lib/resend";
import { slugify, getSiteUrl } from "@/lib/utils";
import { NewAirdropEmail } from "@/emails/NewAirdrop";

const stepSchema = z.object({ title: z.string(), body: z.string() });

const schema = z.object({
  name: z.string().min(1),
  chain: z.string().min(1),
  description: z.string().nullable().optional(),
  official_url: z.string().url().nullable().optional(),
  estimated_value_usd: z.number().nullable().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  status: z.enum(["active", "upcoming", "ended"]).optional(),
  steps: z.array(stepSchema).optional(),
  ai_generated_guide: z.boolean().optional(),
  blog_body: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  if (!(await isCurrentUserAdmin())) {
    return NextResponse.json({ ok: false, message: "Admin only." }, { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Supabase isn't configured." },
      { status: 503 },
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON." }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.errors[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }
  const supabase = createAdminClient();
  const slug = `${slugify(parsed.data.name)}-${Date.now().toString(36).slice(-4)}`;
  const inrFromUsd = parsed.data.estimated_value_usd
    ? Math.round(parsed.data.estimated_value_usd * 83)
    : null;

  const { data: inserted, error } = await supabase
    .from("airdrops")
    .insert({
      slug,
      name: parsed.data.name,
      chain: parsed.data.chain,
      description: parsed.data.description ?? null,
      official_url: parsed.data.official_url ?? null,
      estimated_value_usd: parsed.data.estimated_value_usd ?? null,
      estimated_value_inr: inrFromUsd,
      difficulty: parsed.data.difficulty ?? "easy",
      status: parsed.data.status ?? "active",
      steps: parsed.data.steps ?? [],
      ai_generated_guide: parsed.data.ai_generated_guide ?? false,
      views: 0,
    })
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 },
    );
  }

  // Auto-create a blog post if we have a body
  if (parsed.data.blog_body) {
    await supabase.from("blog_posts").insert({
      slug,
      title: `How to Claim ${parsed.data.name} Airdrop — Step-by-Step Guide (India)`,
      excerpt: parsed.data.description ?? null,
      content: parsed.data.blog_body,
      category: "airdrop-guide",
      tags: [parsed.data.chain, "airdrop"],
      related_airdrop_id: inserted?.id ?? null,
      ai_generated: parsed.data.ai_generated_guide ?? false,
      published: true,
      views: 0,
    });
  }

  // Fire-and-forget email to all confirmed subscribers
  if (isResendConfigured() && inserted) {
    try {
      const { data: subs } = await supabase
        .from("subscribers")
        .select("email, unsubscribe_token, chains")
        .eq("confirmed", true);
      const filtered = (subs ?? []).filter(
        (s) =>
          !s.chains ||
          s.chains.length === 0 ||
          s.chains.includes(parsed.data.chain),
      );
      const url = `${getSiteUrl()}/airdrops/${slug}`;
      const resend = getResend();
      await Promise.all(
        filtered.slice(0, 100).map(async (s) => {
          try {
            await resend.emails.send({
              from: FROM_EMAIL,
              to: s.email,
              subject: `New airdrop: ${parsed.data.name}`,
              react: NewAirdropEmail({
                airdropName: parsed.data.name,
                airdropUrl: url,
                chain: parsed.data.chain,
                description: parsed.data.description ?? null,
                unsubscribeUrl: `${getSiteUrl()}/api/subscribe/unsubscribe?token=${s.unsubscribe_token}`,
              }),
            });
          } catch (e) {
            console.error("Failed to send to", s.email, e);
          }
        }),
      );
    } catch (e) {
      console.error("Subscriber email blast failed:", e);
    }
  }

  return NextResponse.json({ ok: true, slug });
}
