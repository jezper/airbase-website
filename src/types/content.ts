/* ── Release (Discography) ── */

export type ReleaseType = "Single" | "Remix" | "Album";

export interface ReleaseLinks {
  spotify?: string;
  beatport?: string;
  youtube?: string;
  soundcloud?: string;
  apple?: string;
  smartlink?: string;
  [key: string]: string | undefined;
}

export interface Release {
  year: number;
  artist: string;
  title: string;
  type: ReleaseType;
  label: string;
  tracks: string[];
  links: ReleaseLinks;
  date: string;
  artwork: string | null;
}

/* ── Show ── */

export type ShowStatus = "upcoming" | "past" | "cancelled";

export interface Show {
  venue: string;
  city: string;
  country: string;
  date: string | null;
  year_approx: string | null;
  event: string | null;
  notes: string | null;
  status: ShowStatus;
}

/* ── Press ── */

export interface PressFeature {
  title: string;
  publication: string;
  date: string | null;
  url: string;
  pullQuote: string | null;
  context: string | null;
}

/* ── MDX Page ── */

export interface MDXPage {
  content: string;
  frontmatter: Record<string, unknown>;
}

/* ── Feed Post Types (for Phase 3) ── */

export type PostType = "note" | "article" | "release" | "show" | "mix";

export interface FeedPost {
  type: PostType;
  date: string;
  slug: string;
}
