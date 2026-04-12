import type { Post } from "@/types/content";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default function ArticleCard({
  post,
  hasContext,
  children,
}: {
  post: Post;
  hasContext?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={hasContext
        ? "bg-bg-card border border-border rounded-b-lg px-5 py-5"
        : "py-6 border-t"
      }
      style={!hasContext ? { borderColor: "var(--bd-section)" } : undefined}
    >
      {children}

      <time dateTime={post.date} className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-faint block mb-3">
        {formatDate(post.date)}
      </time>

      {post.title && (
        <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight text-text mb-3">
          {post.title}
        </h3>
      )}

      <p className="font-body text-[16px] text-text-muted leading-relaxed mb-4 max-w-[600px]">
        {post.excerpt ?? post.body}
      </p>

      {post.slug && (
        <a
          href={`/feed/${post.slug}`}
          className="font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors"
        >
          Read &rarr;
        </a>
      )}
    </div>
  );
}
