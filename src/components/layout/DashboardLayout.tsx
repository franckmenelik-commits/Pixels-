"use client";

import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: { name: string; role: string };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[var(--surface)]">
      <Sidebar user={user} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
