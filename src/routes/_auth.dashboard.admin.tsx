import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell, StatCard, Section, Panel } from "@/components/DashboardShell";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { Link } from "@tanstack/react-router";
import { Calendar, MessageSquare, Clock, Mail, Phone, Search, Users, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/_auth/dashboard/admin")({
  component: AdminDash,
});

interface Booking {
  id: string;
  parent_name: string;
  child_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  child_grade?: string | null;
  preferred_time?: string | null;
  notes?: string | null;
}
interface Message {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  created_at: string;
}

function AdminDash() {
  const { roles } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab] = useState<"bookings" | "messages">("bookings");
  const [q, setQ] = useState("");
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    if (!roles.includes("admin")) return;
    supabase
      .from("demo_bookings")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setBookings((data ?? []) as Booking[]));
    supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => setMessages((data ?? []) as Message[]));
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .neq("review_status", "approved")
      .eq("onboarded", true)
      .then(({ count }) => setPendingReviews(count ?? 0));
  }, [roles]);

  if (!roles.includes("admin")) {
    return (
      <DashboardShell title="Admin Console">
        <Panel>
          <p className="text-sm text-muted-foreground">
            You don't have admin access. Ask the team to grant your account the
            <code className="mx-1 px-1.5 py-0.5 rounded bg-secondary">admin</code> role.
          </p>
        </Panel>
      </DashboardShell>
    );
  }

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("demo_bookings").update({ status }).eq("id", id);
    if (!error) setBookings((bs) => bs.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const filteredB = bookings.filter(
    (b) =>
      !q ||
      [b.parent_name, b.child_name, b.email, b.phone]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  const filteredM = messages.filter(
    (m) =>
      !q ||
      [m.name, m.email, m.subject ?? "", m.message]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
  );

  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <DashboardShell
      title="Admin Console"
      subtitle="Manage demo bookings and inquiries from one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard label="Total bookings" value={bookings.length} icon={Calendar} />
        <StatCard label="Pending bookings" value={pending} sub="Need follow-up" icon={Clock} />
        <StatCard label="Inbox messages" value={messages.length} icon={MessageSquare} />
      </div>

      <Section title="Inbox">
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex gap-1 p-1 bg-secondary rounded-full self-start">
            {(["bookings", "messages"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full transition capitalize ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t} ({t === "bookings" ? bookings.length : messages.length})
              </button>
            ))}
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search…"
              className="w-full pl-9 pr-3 py-2 rounded-full border border-ink/15 bg-card text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {tab === "bookings" && (
          <div className="space-y-3">
            {filteredB.length === 0 && (
              <Panel>
                <p className="text-sm text-muted-foreground">No bookings match.</p>
              </Panel>
            )}
            {filteredB.map((b) => (
              <Panel key={b.id}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-display text-lg">{b.parent_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Child: <span className="text-foreground font-medium">{b.child_name}</span>
                      {b.child_grade && <> · Grade {b.child_grade}</>}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {b.email}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {b.phone}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(b.created_at).toLocaleString()}
                      </span>
                    </div>
                    {b.notes && (
                      <p className="mt-3 text-sm bg-secondary/60 rounded-lg p-3">{b.notes}</p>
                    )}
                  </div>
                  <select
                    value={b.status}
                    onChange={(e) => updateStatus(b.id, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-3 py-1.5 border-0 cursor-pointer ${
                      b.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : b.status === "confirmed"
                          ? "bg-emerald-100 text-emerald-800"
                          : b.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-secondary"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </Panel>
            ))}
          </div>
        )}

        {tab === "messages" && (
          <div className="space-y-3">
            {filteredM.length === 0 && (
              <Panel>
                <p className="text-sm text-muted-foreground">No messages match.</p>
              </Panel>
            )}
            {filteredM.map((m) => (
              <Panel key={m.id}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="font-display text-lg">{m.subject || "(no subject)"}</div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground mb-3">
                  {m.name} ·{" "}
                  <a href={`mailto:${m.email}`} className="underline">
                    {m.email}
                  </a>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
              </Panel>
            ))}
          </div>
        )}
      </Section>
    </DashboardShell>
  );
}
