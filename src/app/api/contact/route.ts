import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, isSupabaseConfigured } from "@/lib/supabase/admin";
import { getResend, isResendConfigured, FROM_EMAIL } from "@/lib/resend";
import { getAdminEmails } from "@/lib/admin";

const schema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email."),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required."),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON." },
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

  if (!isSupabaseConfigured()) {
    return NextResponse.json({
      ok: true,
      message: "Demo mode — message received (Supabase not configured).",
    });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
    read: false,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, message: error.message },
      { status: 500 },
    );
  }

  // Notify admin via email
  if (isResendConfigured()) {
    const admins = getAdminEmails();
    if (admins.length > 0) {
      try {
        await getResend().emails.send({
          from: FROM_EMAIL,
          to: admins[0],
          subject: `New contact: ${parsed.data.subject || "No subject"}`,
          html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#0a0a0a;color:#fafafa;">
            <h2 style="color:#a78bfa;">New Contact Message</h2>
            <p><strong>Name:</strong> ${parsed.data.name}</p>
            <p><strong>Email:</strong> ${parsed.data.email}</p>
            <p><strong>Subject:</strong> ${parsed.data.subject || "—"}</p>
            <hr style="border-color:#333;margin:16px 0;" />
            <p>${parsed.data.message.replace(/\n/g, "<br>")}</p>
          </div>`,
        });
      } catch (e) {
        console.error("Failed to send contact notification:", e);
      }
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Message sent successfully! We'll get back to you soon.",
  });
}
