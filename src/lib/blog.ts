import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { isSupabaseConfigured } from "@/lib/supabase/admin";
import type { BlogPostRow } from "@/lib/supabase/types";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  date: string;
  readingTime: number;
  content: string;
  aiGenerated?: boolean;
  source: "markdown" | "supabase";
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readWordsPerMinute(text: string): number {
  const words = text.split(/\s+/g).length;
  return Math.max(1, Math.round(words / 220));
}

let _cache: BlogPost[] | null = null;

export function getMarkdownPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.md$/, "");
    return {
      slug,
      title: String(data.title ?? slug),
      excerpt: String(data.excerpt ?? ""),
      category: String(data.category ?? "guide"),
      tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
      date: String(data.date ?? new Date().toISOString().slice(0, 10)),
      readingTime: readWordsPerMinute(content),
      content,
      aiGenerated: Boolean(data.aiGenerated ?? false),
      source: "markdown" as const,
    };
  });
}

export function supabaseRowToPost(row: BlogPostRow): BlogPost {
  const content = row.content ?? "";
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt ?? "",
    category: row.category ?? "guide",
    tags: row.tags ?? [],
    date: row.created_at.slice(0, 10),
    readingTime: readWordsPerMinute(content),
    content,
    aiGenerated: row.ai_generated,
    source: "supabase" as const,
  };
}

export function getAllPosts(): BlogPost[] {
  if (_cache && process.env.NODE_ENV === "production") return _cache;
  const posts = getMarkdownPosts();
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  _cache = posts;
  return posts;
}

export async function getAllPostsWithSupabase(): Promise<BlogPost[]> {
  const mdPosts = getMarkdownPosts();

  if (!isSupabaseConfigured()) {
    mdPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
    return mdPosts;
  }

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const supabase = createAdminClient();
    const { data: dbPosts } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false });

    const supabasePosts = (dbPosts ?? []).map(supabaseRowToPost);
    const mdSlugs = new Set(mdPosts.map((p) => p.slug));
    const merged = [
      ...mdPosts,
      ...supabasePosts.filter((p) => !mdSlugs.has(p.slug)),
    ];
    merged.sort((a, b) => (a.date < b.date ? 1 : -1));
    return merged;
  } catch {
    mdPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
    return mdPosts;
  }
}

export async function getPostBySlugWithSupabase(
  slug: string,
): Promise<BlogPost | null> {
  const allPosts = await getAllPostsWithSupabase();
  return allPosts.find((p) => p.slug === slug) ?? null;
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
