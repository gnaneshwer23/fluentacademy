import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MarketingShell } from "@/components/MarketingShell";

export const Route = createFileRoute("/book-demo")({
  head: () => ({ meta: [{ title: "Book a Demo · Fluent" }] }),
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
    <MarketingShell
      title="Book a demo"
      subtitle="A 30-minute session to see Fluent in action — tailored to your school or family. No obligation."
    >
      {done ? (
        <div className="card-connectd rounded-2xl bg-teal-light p-8">
          <h2 className="text-2xl font-bold">Thank you</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Our team will email you within 24 hours to confirm your slot.
          </p>
        </div>
      ) : (
        <form onSubmit={submit} className="marketing-form card-connectd space-y-4 rounded-2xl p-8">
          {[
            { k: "parent_name", l: "Your name *" },
            { k: "child_name", l: "Scholar name *" },
            { k: "child_grade", l: "Grade / age" },
            { k: "email", l: "Email *", type: "email" },
            { k: "phone", l: "Phone *", type: "tel" },
            { k: "preferred_time", l: "Preferred time" },
          ].map((f) => (
            <div key={f.k}>
              <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                {f.l}
              </label>
              <input
                type={f.type ?? "text"}
                value={(form as Record<string, string>)[f.k]}
                onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
              />
            </div>
          ))}
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
            />
          </div>
          <button disabled={loading} className="btn-connectd w-full">
            {loading ? "Sending…" : "Request demo"}
          </button>
        </form>
      )}
    </MarketingShell>
  );
}
