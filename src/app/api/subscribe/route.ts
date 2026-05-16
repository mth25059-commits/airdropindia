import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getResend, isResendConfigured, FROM_EMAIL } from "@/lib/resend";
import { randomToken, getSiteUrl } from "@/lib/utils";
import { ConfirmSubscriptionEmail } from "@/emails/ConfirmSubscription";

const schema = z.object({
  email: z.string().email(),
  chains: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body." },
      { status: 400 },
    );
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: parsed.error.errors[0]?.message ?? "Invalid input." },
      { status: 400 },
    );
  }
  const { email, chains } = parsed.data;

  if (!isSupabaseConfigured()) {
    // Pretend success in demo mode so the UX still works.
    return NextResponse.json({
      ok: true,
      message:
        "Demo mode — Supabase isn't configured yet, so we didn't actually save your email. The flow works once you add Supabase keys.",
    });
  }

  const supabase = createAdminClient();
  const confirmToken = randomToken(40);
  const unsubscribeToken = randomToken(40);

  // Upsert subscriber
  const { data, error } = await supabase
    .from("subscribers")
    .upsert(
      {
        email: email.toLowerCase().trim(),
        chains: chains ?? [],
        confirmed: false,
        confirm_token: confirmToken,
        unsubscribe_token: unsubscribeToken,
      },
      { onConflict: "email" },
    )
    .select("*")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 },
    );
  }
  if (data?.confirmed) {
    return NextResponse.json({
      ok: true,
      message: "You're already subscribed.",
    });
  }

  const confirmUrl = `${getSiteUrl()}/api/subscribe/confirm?token=${confirmToken}`;
  const unsubscribeUrl = `${getSiteUrl()}/api/subscribe/unsubscribe?token=${unsubscribeToken}`;

  if (isResendConfigured()) {
    try {
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Confirm your AirdropIndia subscription",
        react: ConfirmSubscriptionEmail({ confirmUrl, unsubscribeUrl }),
      });
    } catch (e) {
      console.error("Failed to send confirmation email:", e);
      // Still return success — DB row was created
    }
  }

  return NextResponse.json({
    ok: true,
    message: isResendConfigured()
      ? "Check your inbox to confirm your subscription."
      : "Subscribed. (Resend isn't configured yet, so confirmation email skipped.)",
  });
}
