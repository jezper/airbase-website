import Image from "next/image";
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

  // Featured articles get a card treatment
  if (featured) {
    return (
      <div className="bg-bg-card border border-border rounded-lg overflow-hidden">
        {/* Image at natural size, not forced full-width */}
        {post.image && (
          <div className="px-5 pt-5">
            <Image
              src={post.image}
              alt={post.title ?? ""}
              width={600}
              height={400}
              className="rounded-lg object-cover w-full max-h-64"
              sizes="(max-width: 768px) 100vw, 600px"
              unoptimized={post.image.startsWith("http")}
            />
          </div>
        )}

        <div className="px-5 py-5">
          {children}

          <time dateTime={post.date} className="font-mono text-[13px] uppercase tracking-[0.12em] text-text-muted block mb-3">
            {formatDate(post.date)}
          </time>

          {post.title && (
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-4">
              <Link href={permalink} className="text-text hover:text-accent transition-colors">
                {post.title}
              </Link>
            </h3>
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
      </div>
    );
  }

  // Non-featured: simple layout
  return (
    <div className={hasContext ? "bg-bg-card border border-border rounded-b-lg px-5 py-5" : ""}>
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
            width={600}
            height={300}
            className="rounded-md object-cover max-h-48"
            sizes="(max-width: 768px) 100vw, 600px"
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
