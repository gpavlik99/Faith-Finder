export type SeoInput = {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
};

export const siteConfig = {
  name: import.meta.env.VITE_SITE_NAME ?? "Faith Compass",
  // Optional (recommended): set on Vercel as VITE_SITE_URL=https://your-domain.com
  url: import.meta.env.VITE_SITE_URL ?? "",
  locale: "en_US",
  defaultDescription:
    "Discover church communities in and around State College, PA. Get thoughtful, explainable recommendations based on what matters to you.",
  // Put an image at /public/og.png if you want a custom share image.
  defaultImagePath: "/og.png",
};

export function getSiteUrl(): string {
  if (siteConfig.url) return siteConfig.url.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  if (!base) return path;
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function normalizePath(path?: string): string {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
}
