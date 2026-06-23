"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  authorName: string;
  updatedAt: string;
}

export default function WikiPage() {
  const { user, token } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch("/api/wiki", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => Array.isArray(data) && setArticles(data));
  }, [token]);

  if (!user) return null;

  return (
    <DashboardLayout user={{ name: user.displayName || user.email || "", role: (user as any).role || "artist" }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Wiki & Documentation</h1>
        <div className="space-y-3">
          {articles.map(a => (
            <div key={a.id} className="bg-white border border-[var(--border)] rounded-xl p-5">
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">{a.category} · {a.authorName} · {new Date(a.updatedAt).toLocaleDateString("fr-CA")}</p>
            </div>
          ))}
          {articles.length === 0 && <p className="text-center text-[var(--text-muted)] py-12">Aucun article dans le wiki</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
