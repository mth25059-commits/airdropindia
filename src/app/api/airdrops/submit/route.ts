import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(1),
  chain: z.string().min(1),
  description: z.string().optional().nullable(),
  official_url: z.string().url(),
  submitter_email: z.string().email().optional().or(z.literal("")),
});

export async function POST(request: Request) {
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

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      message:
        "Demo mode — Supabase isn't configured yet. In production this would queue your submission for review.",
    });
  }

  const supabase = createAdminClient();
  const slug = `${slugify(parsed.data.name)}-${Date.now().toString(36).slice(-4)}`;
  const { error } = await supabase.from("airdrops").insert({
    slug,
    name: parsed.data.name,
    chain: parsed.data.chain,
    description: parsed.data.description ?? null,
    official_url: parsed.data.official_url,
    status: "upcoming",
    ai_generated_guide: false,
    views: 0,
    tags: parsed.data.submitter_email
      ? [`submitter:${parsed.data.submitter_email}`]
      : null,
  });
  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}
