import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import type { MDXPage } from "@/types/content";

const PAGES_DIR = path.join(process.cwd(), "content/pages");

export async function getMDXPage(slug: string): Promise<MDXPage> {
  const filePath = path.join(PAGES_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(raw);
  return { content, frontmatter: data };
}

export async function renderMDXPage(slug: string) {
  const filePath = path.join(PAGES_DIR, `${slug}.mdx`);
  const raw = await fs.readFile(filePath, "utf-8");
  const { content, frontmatter } = await compileMDX<Record<string, unknown>>({
    source: raw,
    options: { parseFrontmatter: true },
  });
  return { content, frontmatter };
}
