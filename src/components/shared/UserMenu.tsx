"use client";

import * as React from "react";
import { LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function UserMenu() {
  const [user, setUser] = React.useState<SupabaseUser | null>(null);

  React.useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (!user) return null;

  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:bg-white/[0.08] hover:text-white"
        title={user.email ?? "Sign out"}
      >
        <User className="h-3.5 w-3.5" />
        <span className="hidden sm:inline max-w-[120px] truncate">
          {user.email}
        </span>
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </form>
  );
}
