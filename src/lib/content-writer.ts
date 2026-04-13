"use server";

import { db, schema } from "./db";
import { desc, eq } from "drizzle-orm";
import type { Post, Release, Show, PressFeature } from "@/types/content";

/* ── Posts ── */

export async function readPosts(): Promise<Post[]> {
  const rows = await db.select().from(schema.posts).orderBy(desc(schema.posts.date));
  return rows.map((r) => ({
    type: r.type as Post["type"],
    date: r.date,
    body: r.body,
    ...(r.title && { title: r.title }),
    ...(r.excerpt && { excerpt: r.excerpt }),
    ...(r.slug && { slug: r.slug }),
    ...(r.image && { image: r.image }),
    ...(r.link && { link: r.link }),
    ...(r.linkLabel && { linkLabel: r.linkLabel }),
    ...(r.releaseRef && { releaseRef: r.releaseRef }),
    ...(r.showRef && { showRef: r.showRef }),
    ...(r.featured && { featured: r.featured }),
  }));
}

export async function writePosts(posts: Post[]): Promise<void> {
  await db.delete(schema.posts);
  for (const p of posts) {
    await db.insert(schema.posts).values({
      type: p.type,
      date: p.date,
      body: p.body,
      title: p.title ?? null,
      excerpt: p.excerpt ?? null,
      slug: p.slug ?? null,
      image: p.image ?? null,
      link: p.link ?? null,
      linkLabel: p.linkLabel ?? null,
      releaseRef: p.releaseRef ?? null,
      showRef: p.showRef ?? null,
      featured: p.featured ?? false,
    });
  }
}

export async function createPost(post: Post): Promise<void> {
  await db.insert(schema.posts).values({
    type: post.type,
    date: post.date,
    body: post.body,
    title: post.title ?? null,
    excerpt: post.excerpt ?? null,
    slug: post.slug ?? null,
    image: post.image ?? null,
    link: post.link ?? null,
    linkLabel: post.linkLabel ?? null,
    releaseRef: post.releaseRef ?? null,
    showRef: post.showRef ?? null,
    featured: post.featured ?? false,
  });
}

export async function updatePost(index: number, post: Post): Promise<void> {
  const rows = await db.select({ id: schema.posts.id }).from(schema.posts).orderBy(desc(schema.posts.date));
  const row = rows[index];
  if (!row) throw new Error("Post not found");
  await db.update(schema.posts).set({
    type: post.type,
    date: post.date,
    body: post.body,
    title: post.title ?? null,
    excerpt: post.excerpt ?? null,
    slug: post.slug ?? null,
    image: post.image ?? null,
    link: post.link ?? null,
    linkLabel: post.linkLabel ?? null,
    releaseRef: post.releaseRef ?? null,
    showRef: post.showRef ?? null,
    featured: post.featured ?? false,
  }).where(eq(schema.posts.id, row.id));
}

export async function deletePost(index: number): Promise<void> {
  const rows = await db.select({ id: schema.posts.id }).from(schema.posts).orderBy(desc(schema.posts.date));
  const row = rows[index];
  if (!row) throw new Error("Post not found");
  await db.delete(schema.posts).where(eq(schema.posts.id, row.id));
}

/* ── Releases ── */

export async function readReleases(): Promise<Release[]> {
  const rows = await db.select().from(schema.releases).orderBy(desc(schema.releases.date));
  return rows.map((r) => ({
    title: r.title,
    artist: r.artist,
    type: r.type as Release["type"],
    label: r.label,
    year: r.year,
    date: r.date,
    artwork: r.artwork ?? null,
    tracks: (r.tracks as string[]) ?? [],
    links: (r.links as Record<string, string>) ?? {},
    ...(r.relatedRelease && { relatedRelease: r.relatedRelease }),
    ...(r.appearsOn && { appearsOn: r.appearsOn as Release["appearsOn"] }),
    ...(r.deezerTrackId && { deezerTrackId: r.deezerTrackId }),
  }));
}

export async function writeReleases(releases: Release[]): Promise<void> {
  await db.delete(schema.releases);
  for (const r of releases) {
    // Strip undefined values from links for JSON storage
    const cleanLinks: Record<string, string> = {};
    for (const [k, v] of Object.entries(r.links)) {
      if (v) cleanLinks[k] = v;
    }
    await db.insert(schema.releases).values({
      title: r.title,
      artist: r.artist,
      type: r.type,
      label: r.label,
      year: r.year,
      date: r.date,
      artwork: r.artwork ?? null,
      tracks: r.tracks ?? [],
      links: cleanLinks,
      relatedRelease: r.relatedRelease ?? null,
      appearsOn: r.appearsOn ?? null,
      deezerTrackId: r.deezerTrackId ?? null,
    });
  }
}

/* ── Shows ── */

export async function readShows(): Promise<Show[]> {
  const rows = await db.select().from(schema.shows);
  return rows.map((r) => ({
    venue: r.venue,
    city: r.city,
    country: r.country,
    date: r.date ?? null,
    year_approx: r.yearApprox ?? null,
    event: r.event ?? null,
    notes: r.notes ?? null,
    image: r.image ?? null,
    ticketLink: r.ticketLink ?? null,
    eventLink: r.eventLink ?? null,
    status: r.status as Show["status"],
  }));
}

export async function writeShows(shows: Show[]): Promise<void> {
  await db.delete(schema.shows);
  for (const s of shows) {
    await db.insert(schema.shows).values({
      venue: s.venue,
      city: s.city,
      country: s.country,
      date: s.date ?? null,
      yearApprox: s.year_approx ?? null,
      event: s.event ?? null,
      notes: s.notes ?? null,
      image: s.image ?? null,
      ticketLink: s.ticketLink ?? null,
      eventLink: s.eventLink ?? null,
      status: s.status ?? "past",
    });
  }
}

/* ── Press ── */

export async function readPress(): Promise<PressFeature[]> {
  const rows = await db.select().from(schema.pressEntries);
  return rows.map((r) => ({
    title: r.title,
    publication: r.publication,
    date: r.date ?? null,
    url: r.url,
    pullQuote: r.pullQuote ?? null,
    context: r.context ?? null,
  }));
}

export async function writePress(items: PressFeature[]): Promise<void> {
  await db.delete(schema.pressEntries);
  for (const p of items) {
    await db.insert(schema.pressEntries).values({
      title: p.title,
      publication: p.publication,
      date: p.date ?? null,
      url: p.url,
      pullQuote: p.pullQuote ?? null,
      context: p.context ?? null,
    });
  }
}

/* ── Site Config ── */

export interface HeroConfig {
  type: "release" | "post" | "show" | "custom";
  releaseIndex?: number;
  postIndex?: number;
  showIndex?: number;
  title?: string;
  subtitle?: string;
  image?: string;
}

export interface SiteConfig {
  hero: HeroConfig;
}

const DEFAULT_SITE_CONFIG: SiteConfig = {
  hero: {
    type: "release",
    releaseIndex: 0,
  },
};

export async function readSiteConfig(): Promise<SiteConfig> {
  const rows = await db.select().from(schema.siteConfig).where(eq(schema.siteConfig.key, "hero"));
  if (rows.length === 0) return DEFAULT_SITE_CONFIG;
  return { hero: rows[0].value as HeroConfig };
}

export async function writeSiteConfig(config: SiteConfig): Promise<void> {
  const existing = await db.select().from(schema.siteConfig).where(eq(schema.siteConfig.key, "hero"));
  if (existing.length > 0) {
    await db.update(schema.siteConfig).set({ value: config.hero }).where(eq(schema.siteConfig.key, "hero"));
  } else {
    await db.insert(schema.siteConfig).values({ key: "hero", value: config.hero });
  }
}
