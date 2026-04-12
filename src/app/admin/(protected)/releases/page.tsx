import { readReleases } from "@/lib/content-writer";
import { releaseSlug } from "@/lib/release-utils";

export const dynamic = "force-dynamic";

export default async function ReleasesPage() {
  const releases = await readReleases();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-text">Releases</h1>
        <p className="text-text-muted font-body text-sm mt-0.5">
          {releases.length} entries in discography.json
        </p>
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
            </tr>
          </thead>
          <tbody>
            {releases.slice(0, 50).map((r, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors">
                <td className="px-4 py-2.5">
                  <span className="font-mono text-xs text-text-muted">{r.year}</span>
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
              </tr>
            ))}
          </tbody>
        </table>
        {releases.length > 50 && (
          <div className="px-4 py-3 bg-bg-card border-t border-border text-center text-text-faint font-body text-xs">
            Showing 50 of {releases.length} releases
          </div>
        )}
      </div>
    </div>
  );
}
