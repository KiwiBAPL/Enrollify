import type { FaqItem } from "@/lib/parse-faq";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, toAbsoluteUrl } from "./site";

export interface BlogPostOgInput {
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  summary: string | null;
  featured_image_url: string | null;
  author_name: string;
  published_at: string | null;
  updated_at: string;
}

export interface BlogPostOgMeta {
  pageTitle: string;
  title: string;
  description: string;
  image: string;
  url: string;
  author: string;
  datePublished: string | null;
  dateModified: string;
  headline: string;
}

export function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function resolveBlogPostOgMeta(post: BlogPostOgInput): BlogPostOgMeta {
  const path = `/blog/${post.slug}`;
  const url = `${SITE_URL}${path}`;
  const title = post.meta_title || post.title;
  const description = post.meta_description || post.summary || "";
  const image = post.featured_image_url
    ? toAbsoluteUrl(post.featured_image_url)
    : toAbsoluteUrl(DEFAULT_OG_IMAGE);

  return {
    pageTitle: `${title} | ${SITE_NAME}`,
    title,
    description,
    image,
    url,
    author: post.author_name,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    headline: post.title,
  };
}

export function buildBlogPostJsonLd(meta: BlogPostOgMeta): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.headline,
    description: meta.description,
    image: meta.image,
    author: {
      "@type": "Person",
      name: meta.author,
    },
    datePublished: meta.datePublished,
    dateModified: meta.dateModified,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": meta.url,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };
}

export function buildFaqPageJsonLd(items: FaqItem[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildBlogPostHeadTags(meta: BlogPostOgMeta): string {
  const jsonLd = buildBlogPostJsonLd(meta);
  const e = escapeHtmlAttr;

  return [
    `<title>${e(meta.pageTitle)}</title>`,
    `<meta name="description" content="${e(meta.description)}" />`,
    `<link rel="canonical" href="${e(meta.url)}" />`,
    `<meta property="og:title" content="${e(meta.title)}" />`,
    `<meta property="og:description" content="${e(meta.description)}" />`,
    `<meta property="og:image" content="${e(meta.image)}" />`,
    `<meta property="og:url" content="${e(meta.url)}" />`,
    `<meta property="og:type" content="article" />`,
    `<meta property="og:site_name" content="${e(SITE_NAME)}" />`,
    meta.datePublished
      ? `<meta property="article:published_time" content="${e(meta.datePublished)}" />`
      : "",
    `<meta property="article:author" content="${e(meta.author)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${e(meta.title)}" />`,
    `<meta name="twitter:description" content="${e(meta.description)}" />`,
    `<meta name="twitter:image" content="${e(meta.image)}" />`,
    `<meta name="author" content="${e(meta.author)}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

export function injectBlogPostHeadTags(html: string, meta: BlogPostOgMeta): string {
  const tags = buildBlogPostHeadTags(meta);
  return html.replace(/<title>[\s\S]*?<\/title>/, tags);
}
