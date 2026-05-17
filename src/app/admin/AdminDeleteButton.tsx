"use client";

import * as React from "react";
import { Trash2, Loader2 } from "lucide-react";

export function AdminDeleteButton({
  endpoint,
  label,
  onDeleted,
}: {
  endpoint: string;
  label: string;
  onDeleted?: () => void;
}) {
  const [loading, setLoading] = React.useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setLoading(true);
    try {
      const res = await fetch(endpoint, { method: "DELETE" });
      const data = (await res.json()) as { ok: boolean; message?: string };
      if (!res.ok || !data.ok) {
        alert(data.message ?? "Delete failed.");
        return;
      }
      onDeleted?.();
      window.location.reload();
    } catch {
      alert("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-rose-400 transition-colors hover:bg-rose-500/10 disabled:opacity-50"
      title={`Delete ${label}`}
    >
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
    </button>
  );
}
