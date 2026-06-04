import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MarketingShell } from "@/components/MarketingShell";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact · Fluent" }] }),
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
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("contact_messages").insert(parsed.data);
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Message sent!");
      setForm({ name: "", email: "", subject: "", message: "" });
    }
  };

  return (
    <MarketingShell
      title="Get in touch"
      subtitle="Questions about school programmes, family enrolment, or partnerships — we're here to help."
    >
      <p className="text-sm text-muted-foreground">
        Email{" "}
        <a className="font-medium text-primary hover:underline" href="mailto:info@fluent.academy">
          info@fluent.academy
        </a>
      </p>
      <form onSubmit={submit} className="marketing-form card-connectd space-y-4 rounded-2xl p-8">
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        />
        <textarea
          required
          rows={5}
          placeholder="How can we help?"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button disabled={loading} className="btn-connectd w-full">
          {loading ? "Sending…" : "Send message"}
        </button>
      </form>
    </MarketingShell>
  );
}
