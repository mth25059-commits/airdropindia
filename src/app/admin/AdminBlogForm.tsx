"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function AdminBlogForm() {
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  const [title, setTitle] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [content, setContent] = React.useState("");
  const [category, setCategory] = React.useState("guide");
  const [tags, setTags] = React.useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title,
          excerpt: excerpt || null,
          content,
          category: category || "guide",
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          published: true,
        }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        message?: string;
        slug?: string;
      };
      if (!res.ok || !data.ok) {
        setMessage(data.message ?? "Could not save.");
        return;
      }
      setMessage(`Published at /blog/${data.slug}`);
      setTitle("");
      setExcerpt("");
      setContent("");
      setTags("");
    } catch {
      setMessage("Network error.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="space-y-3">
      <div>
        <Label htmlFor="blog-title">Title</Label>
        <Input
          id="blog-title"
          required
          className="mt-1"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="blog-excerpt">Excerpt (short summary for SEO)</Label>
        <Input
          id="blog-excerpt"
          className="mt-1"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <Label htmlFor="blog-category">Category</Label>
          <Input
            id="blog-category"
            className="mt-1"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="blog-tags">Tags (comma-separated)</Label>
          <Input
            id="blog-tags"
            className="mt-1"
            placeholder="crypto, tax, airdrop"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="blog-content">Content (Markdown)</Label>
        <textarea
          id="blog-content"
          required
          rows={10}
          className="mt-1 flex min-h-[200px] w-full rounded-xl border border-border bg-input px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-brand-purple/50 focus:outline-none focus:ring-2 focus:ring-brand-purple/30"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <CheckCircle2 className="h-4 w-4" />
        )}
        Publish blog post
      </Button>
      {message && <p className="text-xs text-muted-foreground">{message}</p>}
    </form>
  );
}
