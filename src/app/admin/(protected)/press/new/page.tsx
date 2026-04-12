import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { readPress } from "@/lib/content-writer";
import { PressForm } from "@/components/admin/press-form";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function NewPressPage({ searchParams }: Props) {
  const params = await searchParams;
  const editIndex = params.id !== undefined ? parseInt(params.id, 10) : undefined;

  const items = await readPress();
  const initialEntry = editIndex !== undefined ? items[editIndex] : undefined;
  const isEdit = editIndex !== undefined && initialEntry !== undefined;

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <Link
          href="/admin/press"
          className="inline-flex items-center gap-1.5 font-body text-sm text-text-muted hover:text-text transition-colors mb-4"
        >
          <ChevronLeft size={14} />
          Back to press
        </Link>
        <h1 className="font-display text-2xl font-semibold text-text">
          {isEdit ? "Edit press entry" : "New press entry"}
        </h1>
      </div>

      <PressForm initialEntry={initialEntry} editIndex={editIndex} />
    </div>
  );
}
