"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { MobileMenu } from "./mobile-menu";

const NAV_LINKS = [
  { href: "/", label: "Feed" },
  { href: "/discography", label: "Discography" },
  { href: "/shows", label: "Shows" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Nav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-border-section"
        aria-label="Main navigation"
      >
        <Link href="/" aria-label="Airbase home">
          <Logo className="h-5 text-text" />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-body text-[13px] font-bold uppercase tracking-[0.12em] transition-colors duration-150 ${
                pathname === link.href
                  ? "text-text"
                  : "text-text-faint hover:text-text"
              }`}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen(true)}
            className="w-10 h-10 flex items-center justify-center text-text-faint hover:text-text transition-colors"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        links={NAV_LINKS}
        pathname={pathname}
      />
    </>
  );
}
