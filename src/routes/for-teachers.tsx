import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, ClipboardCheck, Clock, LineChart } from "lucide-react";
import { RolePage } from "./for-leaders";

export const Route = createFileRoute("/for-teachers")({
  head: () => ({
    meta: [
      { title: "Fluent for Teachers — Reduce Workload, Improve Teaching" },
      { name: "description", content: "Plan faster, mark smarter, and see every learner. Fluent is the AI co-pilot for teachers that gives time back without diluting craft." },
      { property: "og:title", content: "Fluent for Teachers" },
      { property: "og:description", content: "Reduce workload. Improve teaching. See real progress." },
      { property: "og:url", content: "https://fluentinstitute.lovable.app/for-teachers" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Fluent for Teachers" },
      { name: "twitter:description", content: "Reduce workload. Improve teaching. See real progress." },
    ],
    links: [
      { rel: "canonical", href: "https://fluentinstitute.lovable.app/for-teachers" },
    ],
  }),
  component: TeachersPage,
});

function TeachersPage() {
  const kpis = [
    { icon: Sparkles, t: "AI lesson co-pilot", d: "Plans, slides and differentiation in minutes — your style, your standards." },
    { icon: ClipboardCheck, t: "Smart marking", d: "Spend time on feedback, not red pens. Bulk grade with full control." },
    { icon: Clock, t: "Hours back", d: "Average 6+ hours saved weekly across planning, marking and reporting." },
    { icon: LineChart, t: "See every learner", d: "Cohort heatmaps reveal who's stuck — before the next assessment." },
  ];
  return (
    <RolePage
      eyebrow="For Teachers"
      title="Reduce workload. Improve teaching. See real progress."
      subtitle="Fluent is a calm, capable co-pilot. It handles the heavy lifting so you can do what only you can — teach."
      kpis={kpis}
      proof={[
        "Lesson plans in minutes, aligned to your curriculum",
        "Auto-marking with teacher-in-the-loop control",
        "Live view of every student's understanding",
        "Reports written for you — you review, send, done",
      ]}
      ctaTitle="Get your evenings back. Keep your craft."
    />
  );
}
