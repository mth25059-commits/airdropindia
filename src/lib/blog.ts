import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

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
}

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

function readWordsPerMinute(text: string): number {
  const words = text.split(/\s+/g).length;
  return Math.max(1, Math.round(words / 220));
}

let _cache: BlogPost[] | null = null;

export function getAllPosts(): BlogPost[] {
  if (_cache && process.env.NODE_ENV === "production") return _cache;
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md"));
  const posts = files.map((file) => {
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
    } satisfies BlogPost;
  });
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  _cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): BlogPost | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
