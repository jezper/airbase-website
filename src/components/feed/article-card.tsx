import Link from "next/link";
import type { Post } from "@/types/content";
import { formatDate } from "@/lib/format-date";
import { postPermalink } from "@/lib/post-utils";

export default function ArticleCard({
  post,
  hasContext,
  featured,
  children,
}: {
  post: Post;
  hasContext?: boolean;
  featured?: boolean;
  children?: React.ReactNode;
}) {
  const bodyIsHtml = post.body.includes("<");
  const permalink = postPermalink(post);

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
        <h3 className={`font-display font-black leading-tight mb-3 ${
          featured ? "text-3xl sm:text-4xl md:text-5xl" : "text-2xl sm:text-3xl"
        }`}>
          <Link href={permalink} className="text-text hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h3>
      )}

      {bodyIsHtml ? (
        <div
          className={`font-body text-text leading-relaxed mb-4 prose prose-invert max-w-none ${
            featured ? "text-[18px]" : "text-[16px]"
          }`}
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      ) : (
        <p className={`font-body text-text leading-relaxed mb-4 ${
          featured ? "text-[18px]" : "text-[16px]"
        }`}>
          {post.body}
        </p>
      )}
    </div>
  );
}
