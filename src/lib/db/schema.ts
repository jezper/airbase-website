import {
  pgTable,
  serial,
  text,
  integer,
  bigint,
  boolean,
  json,
  timestamp,
} from "drizzle-orm/pg-core";

export const releases = pgTable("releases", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  type: text("type").notNull(), // Single, Remix, Album
  label: text("label").notNull(),
  year: integer("year").notNull(),
  date: text("date").notNull(),
  artwork: text("artwork"),
  tracks: json("tracks").$type<string[]>().notNull().default([]),
  links: json("links").$type<Record<string, string>>().notNull().default({}),
  relatedRelease: text("related_release"),
  appearsOn: json("appears_on").$type<{ title: string; year: number; label?: string }[]>(),
  deezerTrackId: bigint("deezer_track_id", { mode: "number" }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // note, article
  date: text("date").notNull(),
  body: text("body").notNull(),
  title: text("title"),
  excerpt: text("excerpt"),
  slug: text("slug"),
  image: text("image"),
  link: text("link"),
  linkLabel: text("link_label"),
  releaseRef: text("release_ref"),
  showRef: text("show_ref"),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const shows = pgTable("shows", {
  id: serial("id").primaryKey(),
  venue: text("venue").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  date: text("date"),
  yearApprox: text("year_approx"),
  event: text("event"),
  notes: text("notes"),
  image: text("image"),
  ticketLink: text("ticket_link"),
  eventLink: text("event_link"),
  status: text("status").notNull().default("past"), // upcoming, past, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

export const pressEntries = pgTable("press_entries", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  publication: text("publication").notNull(),
  date: text("date"),
  url: text("url").notNull(),
  pullQuote: text("pull_quote"),
  context: text("context"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: json("value").notNull(),
});
