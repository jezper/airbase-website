import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { readPosts, readReleases, readShows } from "@/lib/content-writer";
import { PostForm } from "@/components/admin/post-form";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function NewPostPage({ searchParams }: Props) {
  const params = await searchParams;
  const editIndex = params.id !== undefined ? parseInt(params.id, 10) : undefined;

  const [posts, releases, shows] = await Promise.all([
    readPosts(),
    readReleases(),
    readShows(),
  ]);

  const initialPost = editIndex !== undefined ? posts[editIndex] : undefined;
  const isEdit = editIndex !== undefined && initialPost !== undefined;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-1.5 font-body text-sm text-text-muted hover:text-text transition-colors mb-4"
        >
          <ChevronLeft size={14} />
          Back to posts
        </Link>
        <h1 className="font-display text-2xl font-semibold text-text">
          {isEdit ? "Edit post" : "New post"}
        </h1>
      </div>

      <PostForm
        releases={releases}
        shows={shows}
        initialPost={initialPost}
        editIndex={editIndex}
      />
    </div>
  );
}
