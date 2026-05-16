import { NextResponse } from "next/server";
import { z } from "zod";
import { explainTax, isGroqConfigured } from "@/lib/groq";

const schema = z.object({
  buyPrice: z.number(),
  sellPrice: z.number(),
  quantity: z.number(),
  profitLoss: z.number(),
  taxableGain: z.number(),
  totalTax: z.number(),
  tds: z.number(),
  asset: z.string().nullable().optional(),
  language: z.enum(["en", "hinglish"]).optional(),
});

export async function POST(request: Request) {
  if (!isGroqConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "AI explanations aren't configured yet — add GROQ_API_KEY in your env vars.",
      },
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
    const explanation = await explainTax(parsed.data);
    return NextResponse.json({ ok: true, explanation });
  } catch (e) {
    const message = e instanceof Error ? e.message : "AI request failed.";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
