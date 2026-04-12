import type { Post } from "@/types/content";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

export default function NoteCard({
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
      className={`px-5 py-4 ${
        hasContext
          ? "bg-bg-card border border-border rounded-b-lg"
          : "border-l-2 border-t-0 border-r-0 border-b-0 pl-5 py-2"
      }`}
      style={!hasContext ? { borderLeftColor: "var(--ac)" } : undefined}
    >
      {children}

      <p className="font-body text-[16px] leading-relaxed text-text">
        {post.body}
      </p>

      {post.image && (
        <img src={post.image} alt="" className="mt-3 rounded-md w-full object-cover max-h-48" loading="lazy" />
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

      <time dateTime={post.date} className="font-mono text-[12px] uppercase tracking-[0.1em] text-text-muted block mt-3">
        {formatDate(post.date)}
      </time>
    </div>
  );
}
