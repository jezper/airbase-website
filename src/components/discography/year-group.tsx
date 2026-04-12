import type { Release } from "@/types/content";
import ReleaseGridCard from "./release-grid-card";

interface YearGroupProps {
  year: number;
  releases: Release[];
}

export default function YearGroup({ year, releases }: YearGroupProps) {
  return (
    <section aria-label={`Releases from ${year}`}>
      <h2
        className="font-display text-5xl md:text-6xl font-black text-text-faint mb-6 leading-none"
        style={{ fontVariationSettings: "'opsz' 144" }}
      >
        {year}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {releases.map((release) => (
          <ReleaseGridCard key={`${release.year}-${release.artist}-${release.title}`} release={release} />
        ))}
      </div>
    </section>
  );
}
