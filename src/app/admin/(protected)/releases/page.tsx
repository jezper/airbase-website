import Link from "next/link";
import { Plus } from "lucide-react";
import { readReleases } from "@/lib/content-writer";
import { releaseSlug } from "@/lib/release-utils";
import { DeleteReleaseButton } from "@/components/admin/delete-release-button";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const releases = await readReleases();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Releases</h1>
          <p className="text-text-muted font-body text-sm mt-0.5">
            {releases.length} entries in discography.json
          </p>
        </div>
        <Link
          href="/admin/releases/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-body text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          <Plus size={15} />
          New Release
        </Link>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-card">
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Year</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Artist</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Title</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3 hidden md:table-cell">Label</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Type</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {releases.map((r, i) => {
              const isUpcoming = r.date > new Date().toISOString().slice(0, 10);
              return (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors">
                <td className="px-4 py-2.5">
                  <span className="font-mono text-xs text-text-muted">{r.year}</span>
                  {isUpcoming && (
                    <span className="ml-1.5 font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(196,168,124,0.15)", color: "var(--gd)" }}>
                      upcoming
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <span className="font-body text-sm text-text">{r.artist}</span>
                </td>
                <td className="px-4 py-2.5">
                  <div>
                    <span className="font-body text-sm text-text">{r.title}</span>
                    <p className="font-mono text-[10px] text-text-faint mt-0.5">{releaseSlug(r)}</p>
                  </div>
                </td>
                <td className="px-4 py-2.5 hidden md:table-cell">
                  <span className="font-body text-xs text-text-muted">{r.label}</span>
                </td>
                <td className="px-4 py-2.5 hidden sm:table-cell">
                  <span className="font-mono text-[10px] text-gold bg-gold/10 px-1.5 py-0.5 rounded">{r.type}</span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link
                      href={`/admin/releases/new?id=${i}`}
                      className="font-body text-xs text-text-muted hover:text-accent transition-colors"
                    >
                      Edit
                    </Link>
                    <DeleteReleaseButton
                      index={i}
                      label={`${r.artist} — ${r.title}`}
                    />
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
