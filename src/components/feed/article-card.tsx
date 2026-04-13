import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/content";
import { formatDate } from "@/lib/format-date";
import { postPermalink } from "@/lib/post-utils";

export default function ArticleCard({
  post,
  featured,
  children,
}: {
  post: Post;
  featured?: boolean;
  children?: React.ReactNode;
}) {
  const bodyIsHtml = post.body.includes("<");
  const permalink = postPermalink(post);

  if (featured) {
    return (
      <div className="bg-bg-card border border-border rounded-lg overflow-hidden p-5">
        {/* Two-column: artwork left, meta + title right */}
        {post.image ? (
          <div className="flex flex-col sm:flex-row gap-6 mb-5">
            <div className="shrink-0">
              <Image
                src={post.image}
                alt={post.title ?? ""}
                width={280}
                height={280}
                className="rounded-lg object-cover w-full sm:w-64 aspect-square"
                sizes="(max-width: 640px) 100vw, 260px"
                unoptimized={post.image.startsWith("http")}
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <time dateTime={post.date} className="font-mono text-[13px] uppercase tracking-[0.12em] text-text-muted block mb-3">
                {formatDate(post.date)}
              </time>
              {post.title && (
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-black leading-tight">
                  <Link href={permalink} className="text-text hover:text-accent transition-colors">
                    {post.title}
                  </Link>
                </h3>
              )}
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <time dateTime={post.date} className="font-mono text-[13px] uppercase tracking-[0.12em] text-text-muted block mb-3">
              {formatDate(post.date)}
            </time>
            {post.title && (
              <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
                <Link href={permalink} className="text-text hover:text-accent transition-colors">
                  {post.title}
                </Link>
              </h3>
            )}
          </div>
        )}

        {bodyIsHtml ? (
          <div
            className="font-body text-[18px] text-text leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        ) : (
          <p className="font-body text-[18px] text-text leading-relaxed">
            {post.body}
          </p>
        )}

        {children && <div className="mt-4 pt-4 border-t border-border">{children}</div>}
      </div>
    );
  }

  // Non-featured
  return (
    <div>
      <time dateTime={post.date} className="font-mono text-[13px] uppercase tracking-[0.12em] text-text-muted block mb-3">
        {formatDate(post.date)}
      </time>

      {post.title && (
        <h3 className="font-display text-2xl sm:text-3xl font-black leading-tight mb-3">
          <Link href={permalink} className="text-text hover:text-accent transition-colors">
            {post.title}
          </Link>
        </h3>
      )}

      {bodyIsHtml ? (
        <div
          className="font-body text-[16px] text-text leading-relaxed prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.body }}
        />
      ) : (
        <p className="font-body text-[16px] text-text leading-relaxed">
          {post.body}
        </p>
      )}

      {children && <div className="mt-3">{children}</div>}
    </div>
  );
}
