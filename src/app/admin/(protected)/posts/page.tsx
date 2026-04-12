import Link from "next/link";
import { Plus, FileText, AlignLeft } from "lucide-react";
import { readPosts, readSiteConfig } from "@/lib/content-writer";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { SetHeroButton } from "@/components/admin/set-hero-button";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<string, string> = {
  note: "Note",
  article: "Article",
};

const TYPE_COLORS: Record<string, string> = {
  note: "bg-gold/15 text-gold",
  article: "bg-accent/15 text-accent",
};

function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max).trimEnd() + "…";
}

export default async function PostsPage() {
  const [posts, siteConfig] = await Promise.all([readPosts(), readSiteConfig()]);
  const heroPostIndex = siteConfig.hero.type === "post" ? (siteConfig.hero.postIndex ?? -1) : -1;

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Posts</h1>
          <p className="text-text-muted font-body text-sm mt-0.5">{posts.length} total</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-body text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          <Plus size={15} />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-text-muted font-body text-sm">
          No posts yet. Create your first one.
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-bg-card">
                <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Type</th>
                <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Content</th>
                <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Date</th>
                <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3 hidden md:table-cell">Refs</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr
                  key={i}
                  className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[10px] font-medium ${TYPE_COLORS[post.type] ?? "bg-bg-card text-text-muted"}`}>
                      {post.type === "note" ? <AlignLeft size={10} /> : <FileText size={10} />}
                      {TYPE_LABELS[post.type] ?? post.type}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {post.title ? (
                      <div>
                        <p className="font-body text-sm font-medium text-text">{truncate(post.title, 60)}</p>
                        {post.excerpt && <p className="font-body text-xs text-text-muted mt-0.5">{truncate(post.excerpt, 60)}</p>}
                      </div>
                    ) : (
                      <p className="font-body text-sm text-text">{truncate(post.body, 80)}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="font-mono text-xs text-text-muted">{post.date}</span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex flex-col gap-0.5">
                      {post.releaseRef && (
                        <span className="font-mono text-[10px] text-accent-hover" title="Release ref">
                          R: {post.releaseRef}
                        </span>
                      )}
                      {post.showRef && (
                        <span className="font-mono text-[10px] text-gold" title="Show ref">
                          S: {post.showRef}
                        </span>
                      )}
                      {post.featured && (
                        <span className="font-mono text-[10px] text-text-faint">featured</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <SetHeroButton type="post" index={i} isCurrentHero={heroPostIndex === i} />
                      <Link
                        href={`/admin/posts/new?id=${i}`}
                        className="font-body text-xs text-text-muted hover:text-accent transition-colors"
                      >
                        Edit
                      </Link>
                      <DeletePostButton
                        index={i}
                        label={post.title ?? post.body.slice(0, 40)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
