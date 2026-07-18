import { createFileRoute } from "@tanstack/react-router";
import { Heart, MessageCircle, Eye, Home } from "lucide-react";
import { RolePage } from "./for-leaders";

export const Route = createFileRoute("/for-parents")({
  head: () => ({
    meta: [
      { title: "Fluent for Parents — Understand Your Child's Learning" },
      { name: "description", content: "Honest, weekly visibility into your child's learning — strengths, gaps and what to do next at home." },
      { property: "og:title", content: "Fluent for Parents" },
      { property: "og:description", content: "Understand your child's learning like never before." },
      { property: "og:url", content: "https://fluentinstitute.lovable.app/for-parents" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Fluent for Parents" },
      { name: "twitter:description", content: "Understand your child's learning like never before." },
    ],
    links: [
      { rel: "canonical", href: "https://fluentinstitute.lovable.app/for-parents" },
    ],
  }),
  component: ParentsPage,
});

function ParentsPage() {
  const kpis = [
    { icon: Eye, t: "Real visibility", d: "See understanding, confidence and effort — not just grades." },
    { icon: Heart, t: "Honest updates", d: "A clear Sunday note from teachers, written for you." },
    { icon: Home, t: "Home strategies", d: "Bite-size things you can do this week to help your child." },
    { icon: MessageCircle, t: "Talk to teachers", d: "Direct, calm communication when it matters — no chasing." },
  ];
  return (
    <RolePage
      eyebrow="For Parents"
      title="Understand your child's learning like never before."
      subtitle="Beyond the report card. Fluent shows you how your child is actually learning — and how to help."
      kpis={kpis}
      proof={[
        "Weekly Sunday report — strengths and gaps, plainly",
        "Concept-level view, not just scores",
        "Suggested home plays you can actually do",
        "Direct line to teachers without the chase",
      ]}
      ctaTitle="Be part of your child's learning, every week."
    />
  );
}
