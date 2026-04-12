import Link from "next/link";
import { Plus } from "lucide-react";
import { readPress } from "@/lib/content-writer";

export const dynamic = "force-dynamic";

export default async function PressPage() {
  const items = await readPress();

  return (
    <div className="p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-semibold text-text">Press</h1>
          <p className="text-text-muted font-body text-sm mt-0.5">{items.length} entries in press.json</p>
        </div>
        <Link
          href="/admin/press/new"
          className="flex items-center gap-2 bg-accent hover:bg-accent-hover text-bg font-body text-sm font-bold px-4 py-2 rounded transition-colors"
        >
          <Plus size={15} />
          New Entry
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-16 text-text-muted font-body text-sm">
          No press entries yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="bg-bg-card border border-border rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body text-sm font-medium text-text hover:text-accent transition-colors"
                  >
                    {item.title}
                  </a>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-body text-xs text-text-muted">{item.publication}</span>
                    {item.date && (
                      <>
                        <span className="text-text-faint text-xs">·</span>
                        <span className="font-mono text-xs text-text-faint">{item.date}</span>
                      </>
                    )}
                  </div>
                  {item.pullQuote && (
                    <p className="font-body text-xs text-text-muted italic mt-2 border-l-2 border-border pl-3">
                      &ldquo;{item.pullQuote}&rdquo;
                    </p>
                  )}
                </div>
                <Link
                  href={`/admin/press/new?id=${i}`}
                  className="font-body text-xs text-text-muted hover:text-accent transition-colors flex-shrink-0"
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
