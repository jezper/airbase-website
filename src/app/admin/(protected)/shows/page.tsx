import { readShows } from "@/lib/content-writer";

export const dynamic = "force-dynamic";

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-accent/15 text-accent",
  past: "bg-bg-card text-text-muted",
  cancelled: "bg-red-500/15 text-red-400",
};

export default async function ShowsPage() {
  const shows = await readShows();

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-semibold text-text">Shows</h1>
        <p className="text-text-muted font-body text-sm mt-0.5">{shows.length} entries in shows.json</p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-bg-card">
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Date</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Venue</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Location</th>
              <th className="text-left font-body text-xs font-semibold text-text-faint uppercase tracking-wider px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {shows.map((s, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-bg-card/50 transition-colors">
                <td className="px-4 py-2.5">
                  <span className="font-mono text-xs text-text-muted">{s.date ?? s.year_approx ?? "TBC"}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className="font-body text-sm text-text">{s.venue}</span>
                  {s.event && s.event !== s.venue && (
                    <p className="font-body text-xs text-text-muted mt-0.5">{s.event}</p>
                  )}
                </td>
                <td className="px-4 py-2.5 hidden sm:table-cell">
                  <span className="font-body text-xs text-text-muted">{s.city}, {s.country}</span>
                </td>
                <td className="px-4 py-2.5">
                  <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded capitalize ${STATUS_COLORS[s.status] ?? "bg-bg-card text-text-muted"}`}>
                    {s.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
