import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostByPermalink, readPosts } from "@/lib/content-writer";
import { postPermalink } from "@/lib/post-utils";
import { getReleaseBySlug } from "@/lib/releases";
import { releaseSlug } from "@/lib/release-utils";
import { formatDate } from "@/lib/format-date";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await readPosts();
  return posts.map((p) => ({
    slug: p.slug ?? `${p.date}-${p.id}`,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostByPermalink(slug);
  if (!post) return { title: "Post Not Found" };

  const title = post.title ?? post.body.replace(/<[^>]*>/g, "").slice(0, 60);
  const description = post.body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 155);

  return {
    title,
    description,
    openGraph: { title: `${title} | Airbase`, description },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostByPermalink(slug);
  if (!post) notFound();

  const release = post.releaseRef ? await getReleaseBySlug(post.releaseRef) : null;

  const bodyIsHtml = post.body.includes("<");

  return (
    <div className="px-6 md:px-12 py-12 max-w-content mx-auto">
      <Link
        href="/"
        className="font-mono text-[13px] uppercase tracking-[0.1em] text-text-faint hover:text-accent transition-colors inline-block mb-10"
      >
        &larr; Feed
      </Link>

      {/* Header: artwork left, date + title right */}
      {post.image ? (
        <div className="flex flex-col sm:flex-row gap-6 mb-8">
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
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-text">
                {post.title}
              </h1>
            )}
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <time dateTime={post.date} className="font-mono text-[13px] uppercase tracking-[0.12em] text-text-muted block mb-4">
            {formatDate(post.date)}
          </time>
          {post.title && (
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-text">
              {post.title}
            </h1>
          )}
        </div>
      )}

      {/* Body */}
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

      {post.link && (
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-6 font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors"
        >
          {post.linkLabel ?? "Read more"} &rarr;
        </a>
      )}

      {/* Release reference */}
      {release && (
        <div className="mt-8 pt-6 border-t border-border">
          <Link href={`/discography/${releaseSlug(release)}`} className="flex items-center gap-3 group">
            {release.artwork && (
              <img src={release.artwork} alt="" className="w-10 h-10 rounded object-cover" />
            )}
            <div>
              <p className="font-display text-sm font-bold text-text-muted group-hover:text-accent transition-colors">
                {release.artist} &ndash; {release.title}
              </p>
              <p className="font-mono text-[12px] text-text-faint">{release.type} &middot; {release.label}</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
