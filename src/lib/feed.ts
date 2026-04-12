import { getAllReleases } from "./releases";
import { getAllShows } from "./shows";
import type {
  FeedItem,
  FeedRelease,
  FeedShow,
  FeedNote,
  FeedArticle,
} from "@/types/content";

const SAMPLE_NOTES: FeedNote[] = [
  {
    type: "note",
    date: "2026-04-10",
    data: {
      body: "Just finished a new sketch in the studio. Something different this time. Pushing the tempo, pushing the melody. Emotion first, details later.",
    },
  },
  {
    type: "note",
    date: "2026-03-15",
    data: {
      body: "Listening back to old Ozone tracks. The naivety in those productions is what made them work. You can't fake that energy.",
    },
  },
];

const SAMPLE_ARTICLES: FeedArticle[] = [
  {
    type: "article",
    date: "2026-02-10",
    data: {
      title: "People didn't fall in love with perfect production",
      excerpt:
        "An in-depth conversation with Beatportal about the return, the hiatus, and why melody still wins.",
      slug: "beatportal-interview-2026",
    },
  },
];

export async function getFeedItems(limit?: number): Promise<FeedItem[]> {
  const [releases, shows] = await Promise.all([getAllReleases(), getAllShows()]);

  const feedReleases: FeedRelease[] = releases.map((r) => ({
    type: "release",
    date: r.date,
    data: r,
  }));

  const feedShows: FeedShow[] = shows
    .filter((s) => s.date !== null)
    .map((s) => ({
      type: "show",
      date: s.date!,
      data: s,
    }));

  const allItems: FeedItem[] = [
    ...feedReleases,
    ...feedShows,
    ...SAMPLE_NOTES,
    ...SAMPLE_ARTICLES,
  ];

  allItems.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return limit ? allItems.slice(0, limit) : allItems;
}
