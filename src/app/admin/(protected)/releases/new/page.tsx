import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { readReleases } from "@/lib/content-writer";
import { ReleaseForm } from "@/components/admin/release-form";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function NewReleasePage({ searchParams }: Props) {
  const params = await searchParams;
  const editIndex = params.id !== undefined ? parseInt(params.id, 10) : undefined;

  const releases = await readReleases();
  const initialRelease = editIndex !== undefined ? releases[editIndex] : undefined;
  const isEdit = editIndex !== undefined && initialRelease !== undefined;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/releases"
          className="inline-flex items-center gap-1.5 font-body text-sm text-text-muted hover:text-text transition-colors mb-4"
        >
          <ChevronLeft size={14} />
          Back to releases
        </Link>
        <h1 className="font-display text-2xl font-semibold text-text">
          {isEdit ? "Edit release" : "New release"}
        </h1>
      </div>

      <ReleaseForm initialRelease={initialRelease} editIndex={editIndex} />
    </div>
  );
}
