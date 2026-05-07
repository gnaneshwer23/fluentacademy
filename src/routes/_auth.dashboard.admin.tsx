import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard } from "@/components/DashboardShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/_auth/dashboard/admin")({
  component: AdminDash,
});

interface Booking { id: string; parent_name: string; child_name: string; email: string; phone: string; status: string; created_at: string; }
interface Message { id: string; name: string; email: string; subject: string | null; message: string; created_at: string; }

function AdminDash() {
  const { roles } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab] = useState<"bookings" | "messages">("bookings");

  useEffect(() => {
    if (!roles.includes("admin")) return;
    supabase.from("demo_bookings").select("*").order("created_at", { ascending: false }).then(({ data }) => setBookings((data ?? []) as Booking[]));
    supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).then(({ data }) => setMessages((data ?? []) as Message[]));
  }, [roles]);

  if (!roles.includes("admin")) {
    return <DashboardShell title="Admin">
      <p className="text-muted-foreground">You don't have admin access. Ask the team to grant your account the <code>admin</code> role.</p>
    </DashboardShell>;
  }

  return (
    <DashboardShell title="Admin Console">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total bookings" value={bookings.length} />
        <StatCard label="Pending bookings" value={bookings.filter(b => b.status === "pending").length} />
        <StatCard label="New messages" value={messages.length} />
      </div>
      <div className="mt-10 flex gap-2">
        {(["bookings", "messages"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`rounded-full px-4 py-2 text-xs font-semibold ${tab === t ? "bg-primary text-primary-foreground" : "border border-ink/20"}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        {tab === "bookings" && bookings.map(b => (
          <div key={b.id} className="card-ink rounded-2xl bg-card p-5 border border-ink/15">
            <div className="flex items-center justify-between">
              <div className="font-display text-lg">{b.parent_name} · child: {b.child_name}</div>
              <span className="rounded-full bg-accent/30 px-3 py-1 text-xs font-semibold">{b.status}</span>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">{b.email} · {b.phone} · {new Date(b.created_at).toLocaleString()}</div>
          </div>
        ))}
        {tab === "messages" && messages.map(m => (
          <div key={m.id} className="card-ink rounded-2xl bg-card p-5 border border-ink/15">
            <div className="font-display text-lg">{m.subject || "(no subject)"}</div>
            <div className="text-xs text-muted-foreground">{m.name} · {m.email} · {new Date(m.created_at).toLocaleString()}</div>
            <p className="mt-3 text-sm">{m.message}</p>
          </div>
        ))}
        {((tab === "bookings" && bookings.length === 0) || (tab === "messages" && messages.length === 0)) && (
          <p className="text-muted-foreground text-sm">Nothing here yet.</p>
        )}
      </div>
    </DashboardShell>
  );
}
