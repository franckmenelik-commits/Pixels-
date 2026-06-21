"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarUser {
  name: string;
  role: string;
}

interface SidebarProps {
  user: SidebarUser;
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "🏠", roles: null },
  { href: "/profile", label: "Mon Profil", icon: "👤", roles: null },
  { href: "/availability", label: "Disponibilités", icon: "📅", roles: null },
  { href: "/missions", label: "Missions", icon: "📋", roles: null },
  { href: "/studio", label: "Studio Musical", icon: "🎵", roles: null },
  { href: "/jam-sessions", label: "Jam Sessions", icon: "🎸", roles: null },
  { href: "/equipment", label: "Équipement", icon: "📦", roles: null },
  { href: "/finances", label: "Finances", icon: "💰", roles: null },
  { href: "/events/new", label: "Soumettre un événement", icon: "📝", roles: ["organizer"] },
  { href: "/incidents", label: "Incidents", icon: "⚠️", roles: ["admin", "operator"] },
  { href: "/admin", label: "Administration", icon: "📊", roles: ["admin", "operator"] },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const visibleItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(user.role)
  );

  return (
    <aside className="glass flex flex-col w-64 min-h-screen p-4">
      {/* Logo */}
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          PIXELS
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1">
        {visibleItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-white/5"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="border-t border-[rgba(108,92,231,0.2)] pt-4 mt-4">
        <div className="flex items-center justify-between px-2">
          <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-[var(--text-muted)] capitalize">{user.role}</p>
          </div>
          <button className="text-[var(--text-muted)] hover:text-[var(--error)] transition-colors text-sm cursor-pointer">
            Déconnexion
          </button>
        </div>
      </div>
    </aside>
  );
}
