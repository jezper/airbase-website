"use client";

const SOCIAL_LINKS = [
  {
    label: "Spotify",
    href: "https://open.spotify.com/artist/0DgL6pCI4mC68FVMPlzx3L",
  },
  { label: "Apple Music", href: "https://music.apple.com/artist/airbase" },
  {
    label: "Beatport",
    href: "https://www.beatport.com/artist/airbase/8317",
  },
  { label: "SoundCloud", href: "https://soundcloud.com/airbasemusic" },
  { label: "YouTube", href: "https://youtube.com/@airbasemusic" },
  { label: "Instagram", href: "https://instagram.com/airbasemusic" },
  { label: "X", href: "https://x.com/airbasemusic" },
  { label: "Facebook", href: "https://facebook.com/airbasemusic" },
];

export function ContactForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-16">
      {/* Form */}
      <form
        className="space-y-5"
        onSubmit={(e) => e.preventDefault()}
        aria-label="Contact form"
        noValidate
      >
        <div>
          <label
            htmlFor="name"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint block mb-2"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            autoComplete="name"
            className="w-full bg-bg-card border border-border rounded-lg px-4 py-3 font-body text-[15px] text-text placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors"
            placeholder="Your name"
          />
        </div>
        <div>
          <label
            htmlFor="email"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint block mb-2"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className="w-full bg-bg-card border border-border rounded-lg px-4 py-3 font-body text-[15px] text-text placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label
            htmlFor="subject"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint block mb-2"
          >
            Subject
          </label>
          <input
            id="subject"
            type="text"
            required
            className="w-full bg-bg-card border border-border rounded-lg px-4 py-3 font-body text-[15px] text-text placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors"
            placeholder="What's this about?"
          />
        </div>
        <div>
          <label
            htmlFor="message"
            className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint block mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            required
            rows={6}
            className="w-full bg-bg-card border border-border rounded-lg px-4 py-3 font-body text-[15px] text-text placeholder:text-text-faint focus:outline-none focus:border-accent transition-colors resize-y"
            placeholder="Your message..."
          />
        </div>
        <button
          type="submit"
          className="bg-accent text-bg font-body text-[13px] font-bold uppercase tracking-[0.1em] px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
        >
          Send Message
        </button>
      </form>

      {/* Contact info */}
      <div className="space-y-10">
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint mb-3">
            Booking
          </h2>
          <a
            href="mailto:dj@airbasemusic.com"
            className="font-body text-lg text-accent hover:text-accent-hover transition-colors"
          >
            dj@airbasemusic.com
          </a>
        </div>
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint mb-3">
            General
          </h2>
          <a
            href="mailto:jezper@airbasemusic.com"
            className="font-body text-lg text-accent hover:text-accent-hover transition-colors"
          >
            jezper@airbasemusic.com
          </a>
        </div>
        <div>
          <h2 className="font-mono text-[11px] uppercase tracking-[0.1em] text-text-faint mb-3">
            Social
          </h2>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[12px] font-semibold uppercase tracking-[0.08em] text-text-faint hover:text-accent transition-colors px-3 py-1.5 border border-border rounded-full hover:border-border-hover"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
