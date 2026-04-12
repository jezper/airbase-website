"use client";

import { useEffect } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
  pathname: string;
}

export function MobileMenu({ open, onClose, links, pathname }: MobileMenuProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-bg flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div className="flex justify-end px-6 py-5">
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center text-text-faint hover:text-text transition-colors"
          aria-label="Close menu"
        >
          <X size={22} />
        </button>
      </div>
      <nav className="flex-1 flex flex-col items-center justify-center gap-8">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={`font-body text-3xl font-bold uppercase tracking-[0.08em] transition-colors ${
              pathname === link.href
                ? "text-accent"
                : "text-text hover:text-accent"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
