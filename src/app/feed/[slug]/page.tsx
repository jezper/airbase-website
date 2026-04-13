import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostByPermalink, readPosts } from "@/lib/content-writer";
import { postPermalink } from "@/lib/post-utils";
import { getReleaseBySlug } from "@/lib/releases";
import { getShowBySlug } from "@/lib/shows";
import { releaseSlug } from "@/lib/release-utils";
import { formatDate } from "@/lib/format-date";
import ReleaseContext from "@/components/feed/release-context";
import ShowContext from "@/components/feed/show-context";

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
  const relatedRelease = release?.relatedRelease ? await getReleaseBySlug(release.relatedRelease) : null;
  const show = post.showRef ? await getShowBySlug(post.showRef) : null;

  const bodyIsHtml = post.body.includes("<");

  return (
    <div className="px-6 md:px-12 py-12 max-w-content mx-auto">
      <Link
        href="/"
        className="font-mono text-[13px] uppercase tracking-[0.1em] text-text-faint hover:text-accent transition-colors inline-block mb-10"
      >
        &larr; Feed
      </Link>

      {/* Release/show context */}
      {post.featured && release && (
        <div className="mb-6">
          <ReleaseContext release={release} relatedRelease={relatedRelease ?? undefined} />
        </div>
      )}
      {post.featured && show && (
        <div className="mb-6">
          <ShowContext show={show} />
        </div>
      )}

      {/* Release tag for non-featured */}
      {!post.featured && release && (
        <p className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-faint mb-4">
          About{" "}
          <Link href={`/discography/${releaseSlug(release)}`} className="text-text-muted hover:text-accent transition-colors">
            {release.artist} &ndash; {release.title}
          </Link>
        </p>
      )}

      <time dateTime={post.date} className="font-mono text-[13px] uppercase tracking-[0.12em] text-text-muted block mb-4">
        {formatDate(post.date)}
      </time>

      {post.title && (
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-text mb-6">
          {post.title}
        </h1>
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

      {post.image && (
        <div className="mt-6">
          <img src={post.image} alt="" className="rounded-lg max-w-full" />
        </div>
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
    </div>
  );
}
