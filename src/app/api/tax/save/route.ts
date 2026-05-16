import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

const schema = z.object({
  asset_name: z.string().nullable().optional(),
  buy_price: z.number(),
  sell_price: z.number(),
  quantity: z.number(),
  buy_date: z.string(),
  sell_date: z.string(),
  total_buy: z.number(),
  total_sell: z.number(),
  profit_loss: z.number(),
  taxable_gain: z.number(),
  base_tax: z.number(),
  cess: z.number(),
  total_tax: z.number(),
  tds: z.number(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Supabase isn't configured." },
      { status: 503 },
    );
  }
  const supabase = createClient();
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    return NextResponse.json(
      { ok: false, message: "Login required." },
      { status: 401 },
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

  const { error } = await supabase.from("tax_calculations").insert({
    ...parsed.data,
    asset_name: parsed.data.asset_name ?? null,
    user_id: userData.user.id,
  });
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
