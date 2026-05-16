import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(`${origin}/?subscribed=invalid`);
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/?subscribed=demo`);
  }
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("subscribers")
    .update({
      confirmed: true,
      confirmed_at: new Date().toISOString(),
      confirm_token: null,
    })
    .eq("confirm_token", token)
    .select("email")
    .maybeSingle();

  if (error || !data) {
    return NextResponse.redirect(`${origin}/?subscribed=invalid`);
  }
  return NextResponse.redirect(`${origin}/?subscribed=ok`);
}
