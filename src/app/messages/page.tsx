"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import DashboardLayout from "@/components/layout/DashboardLayout";

interface Conversation {
  id: string;
  otherParticipants: { id: string; name: string }[];
  lastMessagePreview: string;
  lastMessageAt: string;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: string;
}

export default function MessagesPage() {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!token) return;
    fetch("/api/messages", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => Array.isArray(data) && setConversations(data));
  }, [token]);

  useEffect(() => {
    if (!selectedId || !token) return;
    fetch(`/api/messages/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => Array.isArray(data) && setMessages(data));
  }, [selectedId, token]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!newMessage.trim() || !selectedId) return;
    const conv = conversations.find(c => c.id === selectedId);
    const recipientId = conv?.otherParticipants[0]?.id;
    if (!recipientId) return;

    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ recipientId, text: newMessage }),
    });
    if (res.ok) {
      setMessages(prev => [...prev, { id: Date.now().toString(), senderId: user!.uid, senderName: user!.displayName || "", text: newMessage, createdAt: new Date().toISOString() }]);
      setNewMessage("");
    }
  }

  if (!user) return null;

  return (
    <DashboardLayout user={{ name: user.displayName || user.email || "", role: (user as any).role || "artist" }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        <div className="flex gap-4 h-[600px]">
          <div className="w-1/3 bg-white border border-[var(--border)] rounded-xl overflow-y-auto">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setSelectedId(c.id)}
                className={`w-full text-left p-4 border-b border-[var(--border)] hover:bg-[var(--surface)] ${selectedId === c.id ? "bg-[var(--surface)]" : ""}`}>
                <p className="text-sm font-semibold">{c.otherParticipants.map(p => p.name).join(", ") || "Conversation"}</p>
                <p className="text-xs text-[var(--text-muted)] truncate">{c.lastMessagePreview}</p>
              </button>
            ))}
            {conversations.length === 0 && <p className="text-center text-[var(--text-muted)] py-8 text-sm">Aucune conversation</p>}
          </div>

          <div className="flex-1 bg-white border border-[var(--border)] rounded-xl flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map(m => (
                <div key={m.id} className={`flex ${m.senderId === user.uid ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${m.senderId === user.uid ? "bg-[var(--primary)] text-white" : "bg-[var(--surface)]"}`}>
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            {selectedId && (
              <form onSubmit={handleSend} className="p-3 border-t border-[var(--border)] flex gap-2">
                <input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Écrire un message..." className="flex-1 px-3 py-2 border border-[var(--border)] rounded-lg text-sm bg-[var(--surface)]" />
                <button type="submit" className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium">Envoyer</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
