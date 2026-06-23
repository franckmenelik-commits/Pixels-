"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Post {
  id: string;
  content: string;
  authorName: string;
  author?: { name: string; photo?: string };
  likes: number;
  commentsCount: number;
  createdAt: string;
}

export default function FeedPage() {
  const { user, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/feed", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => Array.isArray(data) && setPosts(data));
  }, [token]);

  async function handlePost(e: React.FormEvent) {
    e.preventDefault();
    if (!newPost.trim()) return;
    const res = await fetch("/api/feed", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ content: newPost }),
    });
    if (res.ok) {
      const post = await res.json();
      setPosts(prev => [post, ...prev]);
      setNewPost("");
    }
  }

  if (!user) return null;

  return (
    <DashboardLayout user={{ name: user.displayName || user.email || "", role: (user as any).role || "artist" }}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Communauté</h1>

        <form onSubmit={handlePost} className="bg-white border border-[var(--border)] rounded-xl p-4 mb-6">
          <textarea
            value={newPost}
            onChange={e => setNewPost(e.target.value)}
            placeholder="Partager quelque chose avec la communauté..."
            className="w-full resize-none border-0 bg-transparent focus:outline-none text-sm"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium">Publier</button>
          </div>
        </form>

        <div className="space-y-4">
          {posts.map(p => (
            <div key={p.id} className="bg-white border border-[var(--border)] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-sm font-bold">
                  {(p.author?.name || p.authorName || "?")[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{p.author?.name || p.authorName}</p>
                  <p className="text-xs text-[var(--text-light)]">{new Date(p.createdAt).toLocaleDateString("fr-CA")}</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed">{p.content}</p>
            </div>
          ))}
          {posts.length === 0 && <p className="text-center text-[var(--text-muted)] py-12">Aucune publication</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
