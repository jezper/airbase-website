"use server";

import { promises as fs } from "fs";
import path from "path";
import type { Post, Release, Show, PressFeature } from "@/types/content";

const CONTENT_DIR = path.join(process.cwd(), "content");

/* ── Posts ── */

export async function readPosts(): Promise<Post[]> {
  const filePath = path.join(CONTENT_DIR, "posts/posts.json");
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Post[];
  } catch {
    return [];
  }
}

export async function writePosts(posts: Post[]): Promise<void> {
  const filePath = path.join(CONTENT_DIR, "posts/posts.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(posts, null, 2) + "\n");
}

export async function createPost(post: Post): Promise<void> {
  const posts = await readPosts();
  posts.unshift(post);
  await writePosts(posts);
}

export async function updatePost(index: number, post: Post): Promise<void> {
  const posts = await readPosts();
  if (index < 0 || index >= posts.length) throw new Error("Post index out of range");
  posts[index] = post;
  await writePosts(posts);
}

export async function deletePost(index: number): Promise<void> {
  const posts = await readPosts();
  if (index < 0 || index >= posts.length) throw new Error("Post index out of range");
  posts.splice(index, 1);
  await writePosts(posts);
}

/* ── Releases ── */

export async function readReleases(): Promise<Release[]> {
  const filePath = path.join(CONTENT_DIR, "releases/discography.json");
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(raw) as Release[];
    return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch {
    return [];
  }
}

export async function writeReleases(releases: Release[]): Promise<void> {
  const filePath = path.join(CONTENT_DIR, "releases/discography.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(releases, null, 2) + "\n");
}

/* ── Shows ── */

export async function readShows(): Promise<Show[]> {
  const filePath = path.join(CONTENT_DIR, "shows/shows.json");
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Show[];
  } catch {
    return [];
  }
}

export async function writeShows(shows: Show[]): Promise<void> {
  const filePath = path.join(CONTENT_DIR, "shows/shows.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(shows, null, 2) + "\n");
}

/* ── Press ── */

export async function readPress(): Promise<PressFeature[]> {
  const filePath = path.join(CONTENT_DIR, "press/press.json");
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as PressFeature[];
  } catch {
    return [];
  }
}

export async function writePress(items: PressFeature[]): Promise<void> {
  const filePath = path.join(CONTENT_DIR, "press/press.json");
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(items, null, 2) + "\n");
}
