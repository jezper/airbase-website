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
          <div className="flex flex-col sm:flex-row gap-5 mb-5">
            <div className="shrink-0">
              <Image
                src={post.image}
                alt={post.title ?? ""}
                width={200}
                height={200}
                className="rounded-lg object-cover w-full sm:w-48 aspect-square"
                sizes="(max-width: 640px) 100vw, 200px"
                unoptimized={post.image.startsWith("http")}
              />
            </div>
            <div className="flex-1 min-w-0">
              {children}
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
            {children}
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
      </div>
    );
  }

  // Non-featured
  return (
    <div>
      {children}

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

      {post.image && (
        <div className="mb-4">
          <Image
            src={post.image}
            alt={post.title ?? ""}
            width={200}
            height={200}
            className="rounded-md object-cover w-32 aspect-square"
            sizes="128px"
            unoptimized={post.image.startsWith("http")}
          />
        </div>
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
    </div>
  );
}
