import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getResend, isResendConfigured, FROM_EMAIL } from "@/lib/resend";
import { randomToken, getSiteUrl } from "@/lib/utils";
import { ConfirmSubscriptionEmail } from "@/emails/ConfirmSubscription";
import { renderAsync } from "@react-email/render";

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
  const normalizedEmail = email.toLowerCase().trim();

  // First check whether this subscriber already exists. We must NOT blindly
  // upsert with `confirmed: false`, because that would (a) let any visitor
  // un-confirm an already-confirmed subscriber and (b) rotate the
  // unsubscribe_token, breaking unsubscribe links in old emails.
  const { data: existing, error: lookupError } = await supabase
    .from("subscribers")
    .select("id, confirmed, unsubscribe_token")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { ok: false, message: lookupError.message },
      { status: 500 },
    );
  }

  if (existing?.confirmed) {
    return NextResponse.json({
      ok: true,
      message: "You're already subscribed.",
    });
  }

  const confirmToken = randomToken(40);
  // Preserve the existing unsubscribe token if we have one so previously
  // emailed unsubscribe links keep working. Only mint a new one for brand
  // new rows.
  const unsubscribeToken = existing?.unsubscribe_token ?? randomToken(40);

  let upsertError: { message: string } | null = null;
  if (existing) {
    const { error } = await supabase
      .from("subscribers")
      .update({
        chains: chains ?? [],
        confirm_token: confirmToken,
        unsubscribe_token: unsubscribeToken,
      })
      .eq("id", existing.id);
    upsertError = error;
  } else {
    const { error } = await supabase.from("subscribers").insert({
      email: normalizedEmail,
      chains: chains ?? [],
      confirmed: false,
      confirm_token: confirmToken,
      unsubscribe_token: unsubscribeToken,
    });
    upsertError = error;
  }

  if (upsertError) {
    return NextResponse.json(
      { ok: false, message: upsertError.message },
      { status: 500 },
    );
  }

  const confirmUrl = `${getSiteUrl()}/api/subscribe/confirm?token=${confirmToken}`;
  const unsubscribeUrl = `${getSiteUrl()}/api/subscribe/unsubscribe?token=${unsubscribeToken}`;

  if (isResendConfigured()) {
    try {
      const html = await renderAsync(
        ConfirmSubscriptionEmail({ confirmUrl, unsubscribeUrl }),
      );
      await getResend().emails.send({
        from: FROM_EMAIL,
        to: email,
        subject: "Confirm your AirdropIndia subscription",
        html,
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
