import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { readShows } from "@/lib/content-writer";
import { ShowForm } from "@/components/admin/show-form";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function NewShowPage({ searchParams }: Props) {
  const params = await searchParams;
  const editIndex = params.id !== undefined ? parseInt(params.id, 10) : undefined;

  const shows = await readShows();
  const initialShow = editIndex !== undefined ? shows[editIndex] : undefined;
  const isEdit = editIndex !== undefined && initialShow !== undefined;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/shows"
          className="inline-flex items-center gap-1.5 font-body text-sm text-text-muted hover:text-text transition-colors mb-4"
        >
          <ChevronLeft size={14} />
          Back to shows
        </Link>
        <h1 className="font-display text-2xl font-semibold text-text">
          {isEdit ? "Edit show" : "New show"}
        </h1>
      </div>

      <ShowForm initialShow={initialShow} editIndex={editIndex} />
    </div>
  );
}
