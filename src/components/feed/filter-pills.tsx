"use client";

export type FilterType = "all" | "release" | "show" | "note" | "article";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "release", label: "Releases" },
  { value: "show", label: "Shows" },
  { value: "note", label: "Notes" },
  { value: "article", label: "Articles" },
];

interface FilterPillsProps {
  active: FilterType;
  onChange: (filter: FilterType) => void;
  counts?: Partial<Record<FilterType, number>>;
}

export default function FilterPills({ active, onChange, counts }: FilterPillsProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="group"
      aria-label="Filter feed by content type"
    >
      {FILTERS.map(({ value, label }) => {
        const isActive = active === value;
        const count = counts?.[value];

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            aria-pressed={isActive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm font-mono text-[11px] uppercase tracking-[0.06em] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={
              isActive
                ? {
                    backgroundColor: "rgba(232,93,38,0.12)",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "rgba(232,93,38,0.3)",
                    color: "var(--ac)",
                    // focus ring color matches accent
                    outlineColor: "var(--ac)",
                  }
                : {
                    backgroundColor: "transparent",
                    borderWidth: "1px",
                    borderStyle: "solid",
                    borderColor: "var(--bd)",
                    color: "var(--tx-faint)",
                  }
            }
          >
            {label}
            {count !== undefined && (
              <span
                className="font-mono text-[10px]"
                style={{ opacity: 0.7 }}
                aria-label={`${count} items`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
