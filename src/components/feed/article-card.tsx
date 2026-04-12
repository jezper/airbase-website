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
      className="bg-bg-card rounded-lg border border-border hover:border-border-hover hover:-translate-y-1 transition-all duration-150 overflow-hidden group"
      aria-label={`Article: ${title}`}
    >
      {/* Optional cover image */}
      {coverImage && (
        <img
          src={coverImage}
          alt=""
          className="w-full h-40 object-cover"
          loading="lazy"
        />
      )}

      <div className="p-5 space-y-3">
        {/* Date */}
        <time
          dateTime={date}
          className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint block"
        >
          {formatDisplayDate(date)}
        </time>

        {/* Title */}
        <h3 className="font-display text-xl font-bold leading-tight text-text group-hover:text-accent transition-colors duration-150">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="font-body text-[15px] text-text-muted leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        {/* Read link */}
        <a
          href={`/feed/${slug}`}
          className="inline-block font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors duration-150"
          aria-label={`Read full article: ${title}`}
        >
          Read more &rarr;
        </a>
      </div>
    </article>
  );
}
