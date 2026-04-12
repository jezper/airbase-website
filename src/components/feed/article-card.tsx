interface ArticleData {
  title: string;
  excerpt: string;
  slug: string;
  coverImage?: string;
}

interface ArticleCardProps {
  date: string;
  data: ArticleData;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function ArticleCard({ date, data }: ArticleCardProps) {
  const { title, excerpt, slug, coverImage } = data;

  return (
    <article
      className="py-6 border-t group"
      style={{ borderColor: "var(--bd-section)" }}
      aria-label={`Article: ${title}`}
    >
      <time
        dateTime={date}
        className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint block mb-3"
      >
        {formatDisplayDate(date)}
      </time>

      <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight text-text group-hover:text-accent transition-colors duration-150 mb-3">
        {title}
      </h3>

      <p className="font-body text-[16px] text-text-muted leading-relaxed mb-4 max-w-[600px]">
        {excerpt}
      </p>

      <a
        href={`/feed/${slug}`}
        className="font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors duration-150"
        aria-label={`Read full article: ${title}`}
      >
        Read &rarr;
      </a>
    </article>
  );
}
