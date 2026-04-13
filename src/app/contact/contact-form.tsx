"use client";

import { SOCIAL_LINKS } from "@/lib/constants";

export function ContactForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] gap-12 md:gap-16">
      {/* Direct contact */}
      <div className="space-y-6">
        <p className="font-body text-[15px] text-text-muted max-w-md">
          For bookings, press inquiries, or anything else, reach out directly via email.
        </p>
      </div>

      {/* Contact info */}
      <div className="space-y-10">
        <div>
          <h2 className="font-mono text-[13px] uppercase tracking-[0.1em] text-text-faint mb-3">
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
          <h2 className="font-mono text-[13px] uppercase tracking-[0.1em] text-text-faint mb-3">
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
          <h2 className="font-mono text-[13px] uppercase tracking-[0.1em] text-text-faint mb-3">
            Social
          </h2>
          <div className="flex flex-wrap gap-3">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm font-semibold uppercase tracking-[0.08em] text-text-faint hover:text-accent transition-colors px-3 py-1.5 border border-border rounded-full hover:border-border-hover"
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
