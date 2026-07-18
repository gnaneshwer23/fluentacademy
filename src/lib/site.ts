/** Canonical site URL. Set VITE_SITE_URL on Vercel (production: https://fluentacademy.vercel.app). */
export const SITE_URL =
  import.meta.env.VITE_SITE_URL ?? "https://fluentacademy.vercel.app";

export const SITE_NAME = "Fluent";
export const SITE_TAGLINE = "Learning Intelligence Platform";

export const OG_IMAGE = `${SITE_URL}/og.svg`;
