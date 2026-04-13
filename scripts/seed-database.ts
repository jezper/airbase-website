/**
 * Seed the Vercel Postgres database from local JSON content files.
 *
 * Usage:
 *   npx tsx scripts/seed-database.ts
 *
 * Requires POSTGRES_URL in .env.local (pulled from Vercel after creating the database).
 * Run `npx vercel env pull .env.local` to get the database URL.
 *
 * This script:
 * 1. Creates tables if they don't exist
 * 2. Clears existing data
 * 3. Inserts all content from JSON files
 *
 * Safe to re-run: it replaces all data each time.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import { readFileSync } from "fs";
import { join } from "path";
import * as schema from "../src/lib/db/schema";

const db = drizzle(sql, { schema });

const CONTENT_DIR = join(process.cwd(), "content");

async function createTables() {
  console.log("Dropping and recreating tables...");

  await sql`DROP TABLE IF EXISTS releases`;
  await sql`DROP TABLE IF EXISTS posts`;
  await sql`DROP TABLE IF EXISTS shows`;
  await sql`DROP TABLE IF EXISTS site_config`;

  await sql`
    CREATE TABLE IF NOT EXISTS releases (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      artist TEXT NOT NULL,
      type TEXT NOT NULL,
      label TEXT NOT NULL,
      year INTEGER NOT NULL,
      date TEXT NOT NULL,
      artwork TEXT,
      tracks JSONB NOT NULL DEFAULT '[]',
      links JSONB NOT NULL DEFAULT '{}',
      related_release TEXT,
      appears_on JSONB,
      deezer_track_id BIGINT,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      type TEXT NOT NULL,
      date TEXT NOT NULL,
      body TEXT NOT NULL,
      title TEXT,
      excerpt TEXT,
      slug TEXT,
      image TEXT,
      link TEXT,
      link_label TEXT,
      release_ref TEXT,
      show_ref TEXT,
      featured BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS shows (
      id SERIAL PRIMARY KEY,
      venue TEXT NOT NULL,
      city TEXT NOT NULL,
      country TEXT NOT NULL,
      date TEXT,
      year_approx TEXT,
      event TEXT,
      notes TEXT,
      image TEXT,
      ticket_link TEXT,
      event_link TEXT,
      status TEXT NOT NULL DEFAULT 'past',
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS site_config (
      id SERIAL PRIMARY KEY,
      key TEXT NOT NULL UNIQUE,
      value JSONB NOT NULL
    )
  `;

  console.log("Tables created.");
}

async function seedReleases() {
  const data = JSON.parse(readFileSync(join(CONTENT_DIR, "releases/discography.json"), "utf-8"));
  await sql`DELETE FROM releases`;

  for (const r of data) {
    await db.insert(schema.releases).values({
      title: r.title,
      artist: r.artist,
      type: r.type,
      label: r.label,
      year: r.year,
      date: r.date,
      artwork: r.artwork ?? null,
      tracks: r.tracks ?? [],
      links: r.links ?? {},
      relatedRelease: r.relatedRelease ?? null,
      appearsOn: r.appearsOn ?? null,
      deezerTrackId: r.deezerTrackId ?? null,
    });
  }
  console.log(`Seeded ${data.length} releases`);
}

async function seedPosts() {
  const data = JSON.parse(readFileSync(join(CONTENT_DIR, "posts/posts.json"), "utf-8"));
  await sql`DELETE FROM posts`;

  for (const p of data) {
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
  console.log(`Seeded ${data.length} posts`);
}

async function seedShows() {
  const data = JSON.parse(readFileSync(join(CONTENT_DIR, "shows/shows.json"), "utf-8"));
  await sql`DELETE FROM shows`;

  for (const s of data) {
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
  console.log(`Seeded ${data.length} shows`);
}

async function seedSiteConfig() {
  const data = JSON.parse(readFileSync(join(CONTENT_DIR, "site-config.json"), "utf-8"));
  await sql`DELETE FROM site_config`;

  await db.insert(schema.siteConfig).values({
    key: "hero",
    value: data.hero,
  });
  console.log("Seeded site config");
}

async function main() {
  console.log("=== Seeding Database ===\n");
  await createTables();
  await seedReleases();
  await seedPosts();
  await seedShows();
  await seedSiteConfig();
  console.log("\n=== Done ===");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
