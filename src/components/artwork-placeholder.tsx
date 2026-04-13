/**
 * Deterministic placeholder for releases without artwork.
 * Generates a unique dark gradient from the title string.
 */
export function ArtworkPlaceholder({
  artist,
  title,
  className = "",
}: {
  artist?: string;
  title: string;
  className?: string;
}) {
  const initial = title.charAt(0).toUpperCase();
  const hue =
    Array.from(title).reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 360;
  const gradient = `linear-gradient(135deg, hsl(${hue}, 18%, 14%) 0%, hsl(${(hue + 40) % 360}, 14%, 10%) 100%)`;

  return (
    <div
      className={`w-full aspect-square flex items-center justify-center select-none ${className}`}
      style={{ background: gradient }}
      aria-hidden="true"
      {...(artist && { title: `${artist} - ${title}` })}
    >
      <span
        className="font-display font-black text-white/10 leading-none"
        style={{ fontSize: "clamp(3rem, 30%, 5rem)" }}
      >
        {initial}
      </span>
    </div>
  );
}
