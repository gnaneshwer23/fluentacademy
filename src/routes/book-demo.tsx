import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/book-demo")({
  head: () => ({ meta: [{ title: "Book a Free Demo · Fluent" }] }),
  component: BookDemo,
});

const schema = z.object({
  parent_name: z.string().trim().min(1).max(100),
  child_name: z.string().trim().min(1).max(100),
  child_grade: z.string().trim().max(50).optional(),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(6).max(20),
  preferred_time: z.string().trim().max(100).optional(),
  notes: z.string().trim().max(1000).optional(),
});

function BookDemo() {
  const [form, setForm] = useState({
    parent_name: "",
    child_name: "",
    child_grade: "",
    email: "",
    phone: "",
    preferred_time: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("demo_bookings").insert(parsed.data);
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      setDone(true);
      toast.success("Booking received! We'll be in touch soon.");
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-accent">
          ← Back to home
        </Link>
        <h1 className="mt-6 font-display text-5xl font-semibold">Book a free demo</h1>
        <p className="mt-3 text-muted-foreground">
          A 30-minute session. We'll assess and advise — no obligation.
        </p>
        {done ? (
          <div className="mt-10 card-ink rounded-3xl bg-accent/20 p-8 border border-accent">
            <h2 className="font-display text-2xl">Thank you! 🎉</h2>
            <p className="mt-3 text-sm">
              Our team will email you within 24 hours to confirm your slot.
            </p>
          </div>
        ) : (
          <form
            onSubmit={submit}
            className="mt-10 space-y-4 card-ink rounded-3xl bg-card p-8 border border-ink/15"
          >
            {[
              { k: "parent_name", l: "Parent name *" },
              { k: "child_name", l: "Child name *" },
              { k: "child_grade", l: "Child's grade / age" },
              { k: "email", l: "Email *", type: "email" },
              { k: "phone", l: "Phone *", type: "tel" },
              { k: "preferred_time", l: "Preferred time" },
            ].map((f) => (
              <div key={f.k}>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  {f.l}
                </label>
                <input
                  type={f.type ?? "text"}
                  value={(form as never)[f.k]}
                  onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm"
                />
              </div>
            ))}
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">
                Notes
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={4}
                className="mt-1 w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm"
              />
            </div>
            <button
              disabled={loading}
              className="btn-ink w-full rounded-full px-6 py-3 text-sm font-semibold"
            >
              {loading ? "Sending…" : "Book my demo →"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
