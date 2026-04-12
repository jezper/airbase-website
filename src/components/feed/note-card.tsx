interface NoteData {
  body: string;
  image?: string;
  link?: string;
  linkLabel?: string;
}

interface NoteCardProps {
  date: string;
  data: NoteData;
}

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function NoteCard({ date, data }: NoteCardProps) {
  const { body, image, link, linkLabel } = data;

  return (
    <article
      className="bg-bg-card rounded-lg border border-border hover:border-border-hover hover:-translate-y-px transition-all duration-150 p-5"
      aria-label="Note"
    >
      {/* Date */}
      <time
        dateTime={date}
        className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint block mb-3"
      >
        {formatDisplayDate(date)}
      </time>

      {/* Body */}
      <p className="font-body text-[16px] leading-relaxed text-text">
        {body}
      </p>

      {/* Optional image */}
      {image && (
        <img
          src={image}
          alt=""
          className="mt-4 rounded-md w-full object-cover max-h-60"
          loading="lazy"
        />
      )}

      {/* Optional link */}
      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-3 font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors duration-150"
        >
          {linkLabel ?? "Read more"} &rarr;
        </a>
      )}
    </article>
  );
}
