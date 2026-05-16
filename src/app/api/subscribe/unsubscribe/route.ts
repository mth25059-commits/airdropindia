import { NextResponse, type NextRequest } from "next/server";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.redirect(`${origin}/?unsubscribed=invalid`);
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/?unsubscribed=demo`);
  }
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("subscribers")
    .delete()
    .eq("unsubscribe_token", token);
  if (error) {
    return NextResponse.redirect(`${origin}/?unsubscribed=invalid`);
  }
  return NextResponse.redirect(`${origin}/?unsubscribed=ok`);
}
