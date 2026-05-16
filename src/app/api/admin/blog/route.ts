import { NextResponse } from "next/server";
import { z } from "zod";
import { isCurrentUserAdmin } from "@/lib/admin";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { slugify } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1),
  excerpt: z.string().nullable().optional(),
  content: z.string().min(1),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  published: z.boolean().optional(),
});

export async function POST(request: Request) {
  if (!(await isCurrentUserAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Admin only." },
      { status: 403 },
    );
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
    return NextResponse.json(
      { ok: false, message: "Invalid JSON." },
      { status: 400 },
    );
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed.error.errors[0]?.message ?? "Invalid input.",
      },
      { status: 400 },
    );
  }

  const supabase = createAdminClient();
  const slug = `${slugify(parsed.data.title)}-${Date.now().toString(36).slice(-4)}`;

  const { error } = await supabase.from("blog_posts").insert({
    slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt ?? null,
    content: parsed.data.content,
    category: parsed.data.category ?? "guide",
    tags: parsed.data.tags ?? [],
    ai_generated: false,
    published: parsed.data.published ?? true,
    views: 0,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true, slug });
}
