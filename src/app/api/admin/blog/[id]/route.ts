import { NextResponse } from "next/server";
import { isCurrentUserAdmin } from "@/lib/admin";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } },
) {
  if (!(await isCurrentUserAdmin())) {
    return NextResponse.json({ ok: false, message: "Admin only." }, { status: 403 });
  }
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ ok: false, message: "Supabase not configured." }, { status: 503 });
  }
  const supabase = createAdminClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", params.id);
  if (error) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
