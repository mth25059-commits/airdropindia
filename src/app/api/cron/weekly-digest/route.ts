import { NextResponse, type NextRequest } from "next/server";
import { renderAsync } from "@react-email/render";
import { verifyCronSecret } from "@/lib/admin";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getResend, isResendConfigured, FROM_EMAIL } from "@/lib/resend";
import { WeeklyDigestEmail } from "@/emails/WeeklyDigest";
import { getSiteUrl } from "@/lib/utils";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }
  if (!isSupabaseConfigured() || !isResendConfigured()) {
    return NextResponse.json(
      { ok: false, message: "Supabase or Resend isn't configured." },
      { status: 503 },
    );
  }
  const supabase = createAdminClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: airdrops } = await supabase
    .from("airdrops")
    .select("name, slug, chain")
    .gte("created_at", since)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(8);
  if (!airdrops || airdrops.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "Nothing new this week." });
  }

  const { data: subs } = await supabase
    .from("subscribers")
    .select("email, unsubscribe_token")
    .eq("confirmed", true)
    .limit(2000);
  if (!subs || subs.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "No subscribers." });
  }

  const base = getSiteUrl();
  const items = airdrops.map((a) => ({
    name: a.name,
    chain: a.chain,
    url: `${base}/airdrops/${a.slug}`,
  }));
  const resend = getResend();

  let sent = 0;
  for (const s of subs) {
    try {
      const html = await renderAsync(
        WeeklyDigestEmail({
          airdrops: items,
          digestUrl: `${base}/airdrops`,
          unsubscribeUrl: `${base}/api/subscribe/unsubscribe?token=${s.unsubscribe_token}`,
        }),
      );
      await resend.emails.send({
        from: FROM_EMAIL,
        to: s.email,
        subject: `Weekly airdrops digest — ${airdrops.length} new this week`,
        html,
      });
      sent += 1;
    } catch (e) {
      console.error("Digest send failed for", s.email, e);
    }
  }

  return NextResponse.json({ ok: true, sent });
}
