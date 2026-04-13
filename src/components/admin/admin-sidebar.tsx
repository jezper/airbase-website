"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { FileText, Disc3, Calendar, Newspaper, Settings, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";

const NAV_LINKS = [
  { href: "/admin/posts", label: "Posts", icon: FileText },
  { href: "/admin/releases", label: "Releases", icon: Disc3 },
  { href: "/admin/shows", label: "Shows", icon: Calendar },
  { href: "/admin/press", label: "Press", icon: Newspaper },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="w-[220px] shrink-0 bg-bg-card border-r border-border flex flex-col min-h-screen sticky top-0 max-h-screen overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" aria-label="View public site" title="View public site">
          <Logo className="h-4 text-text-muted hover:text-text transition-colors" />
        </Link>
        <p className="font-mono text-[12px] text-text-faint mt-1.5 tracking-widest uppercase">Admin</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4" aria-label="Admin navigation">
        <ul className="space-y-0.5">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded font-body text-sm transition-colors ${
                    active
                      ? "bg-accent/10 text-accent font-medium"
                      : "text-text-muted hover:text-text hover:bg-bg-elevated"
                  }`}
                  aria-current={active ? "page" : undefined}
                >
                  <Icon size={15} strokeWidth={active ? 2.5 : 2} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-border space-y-0.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 w-full px-3 py-2 rounded font-body text-sm text-text-muted hover:text-text hover:bg-bg-elevated transition-colors"
        >
          <LogOut size={15} strokeWidth={2} />
          Log out
        </button>
      </div>
    </aside>
  );
}
