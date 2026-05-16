import { NextResponse } from "next/server";
import { z } from "zod";
import { generateAirdropGuide, isGroqConfigured } from "@/lib/groq";
import { isCurrentUserAdmin } from "@/lib/admin";

const schema = z.object({
  name: z.string().min(1),
  chain: z.string().min(1),
  description: z.string().optional().nullable(),
  officialUrl: z.string().url().optional().nullable(),
  estimatedValueUsd: z.number().optional().nullable(),
});

export async function POST(request: Request) {
  if (!(await isCurrentUserAdmin())) {
    return NextResponse.json(
      { ok: false, message: "Admin only." },
      { status: 403 },
    );
  }
  if (!isGroqConfigured()) {
    return NextResponse.json(
      { ok: false, message: "GROQ_API_KEY isn't configured." },
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
  try {
    const guide = await generateAirdropGuide(parsed.data);
    return NextResponse.json({ ok: true, guide });
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI request failed.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
