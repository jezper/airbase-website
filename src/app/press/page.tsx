import type { Metadata } from "next";
import { getAllPress } from "@/lib/press";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Press",
  description: "Press features, interviews, and notable mentions.",
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function PressPage() {
  const press = await getAllPress();

  return (
    <div className="px-6 md:px-12 py-12 max-w-content mx-auto">
      <h1 className="font-display text-5xl md:text-6xl font-black leading-tight mb-2">
        Press
      </h1>
      <p className="font-body text-[15px] text-text-muted mb-12">
        Interviews, features, and mentions.
      </p>

      <div className="max-w-prose space-y-0">
        {press.map((item, i) => {
          const dateStr = formatDate(item.date);
          return (
            <article key={i} className="py-8 border-b border-border-section">
              <p className="font-mono text-[13px] uppercase tracking-[0.1em] text-text-faint mb-2">
                {item.publication}
                {dateStr && ` — ${dateStr}`}
              </p>
              <h2 className="font-display text-2xl sm:text-3xl font-black leading-tight text-text mb-3">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors inline-flex items-start gap-2"
                >
                  {item.title}
                  <ArrowUpRight
                    size={18}
                    className="shrink-0 mt-1.5 text-text-faint"
                    aria-hidden="true"
                  />
                </a>
              </h2>
              {item.pullQuote && (
                <blockquote
                  className="font-display text-lg italic text-text-muted leading-relaxed border-l-2 pl-5 mt-4"
                  style={{ borderColor: "var(--ac)" }}
                >
                  &ldquo;{item.pullQuote}&rdquo;
                </blockquote>
              )}
              {item.context && (
                <p className="font-body text-[14px] text-text-faint mt-3">
                  {item.context}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
