import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getResend, isResendConfigured, FROM_EMAIL } from "@/lib/resend";
import { getAdminEmails } from "@/lib/admin";
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

  // Notify admin about new airdrop submission
  if (isResendConfigured()) {
    const admins = getAdminEmails();
    if (admins.length > 0) {
      try {
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: admins[0],
          subject: `New airdrop submission: ${parsed.data.name}`,
          html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fafafa;">
            <h2 style="color:#a78bfa;">New Airdrop Submission</h2>
            <p><strong>Name:</strong> ${parsed.data.name}</p>
            <p><strong>Chain:</strong> ${parsed.data.chain}</p>
            <p><strong>URL:</strong> <a href="${parsed.data.official_url}" style="color:#a78bfa;">${parsed.data.official_url}</a></p>
            <p><strong>Description:</strong> ${parsed.data.description || "—"}</p>
            <p><strong>Submitter:</strong> ${parsed.data.submitter_email || "Anonymous"}</p>
            <hr style="border-color:#333;margin:16px 0;" />
            <p style="color:#a1a1aa;font-size:13px;">Review this submission in your <a href="${process.env.NEXT_PUBLIC_SITE_URL || ""}/admin" style="color:#a78bfa;">admin panel</a>.</p>
          </div>`,
        });
      } catch (e) {
        console.error("Failed to send airdrop submission notification:", e);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Airdrop submitted successfully! It will be reviewed by our team.",
  });
}
