import type { Post } from "@/types/content";
import { formatDate } from "@/lib/format-date";

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
        : "py-6 border-t border-border"
      }
    >
      {children}

      <time dateTime={post.date} className="font-mono text-[13px] uppercase tracking-[0.12em] text-text-muted block mb-3">
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
