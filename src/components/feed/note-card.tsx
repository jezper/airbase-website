import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/types/content";
import { formatDate } from "@/lib/format-date";
import { postPermalink } from "@/lib/post-utils";

export default function NoteCard({
  post,
  children,
}: {
  post: Post;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="border-l-2 border-t-0 border-r-0 border-b-0 pl-5 py-2"
      style={{ borderLeftColor: "var(--ac)" }}
    >
      {children}

      <p className="font-body text-[16px] leading-relaxed text-text">
        {post.body}
      </p>

      {post.image && (
        <Image src={post.image} alt="" className="mt-3 rounded-md w-full object-cover max-h-48"
          width={600} height={192} sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized={post.image.startsWith("http")} />
      )}

      {post.link && (
        <a
          href={post.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors"
        >
          {post.linkLabel ?? "Read more"} &rarr;
        </a>
      )}

      <Link href={postPermalink(post)} className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-muted hover:text-accent transition-colors block mt-3">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
      </Link>
    </div>
  );
}
