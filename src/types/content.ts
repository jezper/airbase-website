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
  image?: string | null;
  ticketLink?: string | null;
  eventLink?: string | null;
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

/* ── Post (authored feed content) ── */

export type PostType = "note" | "article";

export interface Post {
  type: PostType;
  date: string;
  body: string;
  title?: string;        // articles have titles
  excerpt?: string;      // articles have excerpts
  slug?: string;         // articles have slugs for URLs
  image?: string;        // optional image
  link?: string;         // optional external link
  linkLabel?: string;    // label for the link
  releaseRef?: string;   // slug of a referenced release (enriches the card)
  showRef?: string;      // slug of a referenced show (enriches the card)
  featured?: boolean;    // true = big artwork/context card. default = subtle inline tag.
}

/* ── Feed Item (post + resolved references) ── */

export interface FeedItem {
  post: Post;
  release?: Release;     // resolved from releaseRef
  show?: Show;           // resolved from showRef
}
