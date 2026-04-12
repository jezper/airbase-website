"use server";

import { revalidatePath } from "next/cache";
import { readPosts, writePosts } from "@/lib/content-writer";
import type { Post } from "@/types/content";

export async function savePost(post: Post, editIndex?: number): Promise<{ success: boolean; error?: string }> {
  try {
    const posts = await readPosts();

    if (editIndex !== undefined && editIndex >= 0) {
      posts[editIndex] = post;
    } else {
      posts.unshift(post);
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    await writePosts(posts);
    revalidatePath("/");
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

export async function deletePost(index: number): Promise<{ success: boolean; error?: string }> {
  try {
    const posts = await readPosts();
    if (index < 0 || index >= posts.length) {
      return { success: false, error: "Post not found." };
    }
    posts.splice(index, 1);
    await writePosts(posts);
    revalidatePath("/");
    revalidatePath("/admin/posts");
    return { success: true };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
