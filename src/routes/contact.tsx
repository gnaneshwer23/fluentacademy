import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact Fluent" }] }),
  component: Contact,
});

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().max(150).optional(),
  message: z.string().trim().min(1).max(2000),
});

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.errors[0].message); return; }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setLoading(false);
    if (error) toast.error(error.message);
    else { toast.success("Message sent!"); setForm({ name: "", email: "", subject: "", message: "" }); }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="text-sm text-muted-foreground hover:text-accent">← Back to home</Link>
        <h1 className="mt-6 font-display text-5xl font-semibold">Get in touch</h1>
        <p className="mt-3 text-muted-foreground">
          Email <a className="underline decoration-accent" href="mailto:futureminds.academy26@gmail.com">futureminds.academy26@gmail.com</a> or call <a className="underline decoration-accent" href="tel:+447553886303">07553 886303</a>.
        </p>
        <form onSubmit={submit} className="mt-10 space-y-4 card-ink rounded-3xl bg-card p-8 border border-ink/15">
          <input required placeholder="Your name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" />
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" />
          <input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}
            className="w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" />
          <textarea required rows={5} placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
            className="w-full rounded-xl border border-ink/20 bg-background px-4 py-3 text-sm" />
          <button disabled={loading} className="btn-ink w-full rounded-full px-6 py-3 text-sm font-semibold">
            {loading ? "Sending…" : "Send message →"}
          </button>
        </form>
      </div>
    </div>
  );
}
