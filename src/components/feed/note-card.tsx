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
      className="border-l-2 pl-5 py-2"
      style={{ borderColor: "var(--ac)" }}
      aria-label="Note"
    >
      <p className="font-body text-[16px] leading-relaxed text-text">
        {body}
      </p>

      {image && (
        <img
          src={image}
          alt=""
          className="mt-3 rounded-md w-full object-cover max-h-48"
          loading="lazy"
        />
      )}

      {link && (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 font-body text-[13px] font-bold uppercase tracking-[0.08em] text-accent hover:text-accent-hover transition-colors duration-150"
        >
          {linkLabel ?? "Read more"} &rarr;
        </a>
      )}

      <time
        dateTime={date}
        className="font-mono text-[10px] uppercase tracking-[0.1em] text-text-faint block mt-3"
      >
        {formatDisplayDate(date)}
      </time>
    </article>
  );
}
