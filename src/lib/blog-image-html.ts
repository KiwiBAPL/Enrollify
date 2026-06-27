export type BlogImageAlign = "below" | "left" | "right";

export interface BlogInlineImageOptions {
  url: string;
  alt: string;
  align: BlogImageAlign;
  width: number;
  padding: number;
  linkUrl?: string;
}

export type ImageLinkUrlResult =
  | { ok: true; url: string }
  | { ok: false; error: string };

const ALLOWED_LINK_SCHEMES = new Set(["http:", "https:"]);

export const BLOG_INLINE_IMAGE_CLASS = "blog-inline-image";

export const BLOG_INLINE_IMAGE_ALIGN_CLASS: Record<BlogImageAlign, string> = {
  below: "blog-inline-image--below",
  left: "blog-inline-image--left",
  right: "blog-inline-image--right",
};

export const DEFAULT_BLOG_IMAGE_WIDTH = 100;
export const DEFAULT_BLOG_IMAGE_PADDING = 16;
export const DEFAULT_BLOG_IMAGE_ALIGN: BlogImageAlign = "below";

export const MIN_BLOG_IMAGE_WIDTH = 25;
export const MAX_BLOG_IMAGE_WIDTH = 100;
export const MIN_BLOG_IMAGE_PADDING = 0;
export const MAX_BLOG_IMAGE_PADDING = 48;

export function clampWidth(width: number): number {
  return Math.min(MAX_BLOG_IMAGE_WIDTH, Math.max(MIN_BLOG_IMAGE_WIDTH, Math.round(width)));
}

export function clampPadding(padding: number): number {
  return Math.min(
    MAX_BLOG_IMAGE_PADDING,
    Math.max(MIN_BLOG_IMAGE_PADDING, Math.round(padding))
  );
}

function escapeAttr(value: string): string {
  return value.replace(/"/g, "&quot;");
}

export function normalizeImageLinkUrl(raw: string): ImageLinkUrlResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { ok: true, url: "" };
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return { ok: false, error: "Invalid link URL format." };
  }

  if (!ALLOWED_LINK_SCHEMES.has(parsed.protocol)) {
    return { ok: false, error: "Link URL must use http or https." };
  }

  return { ok: true, url: parsed.href };
}

function buildImageMarkup(options: BlogInlineImageOptions): string {
  const img = `<img src="${escapeAttr(options.url)}" alt="${escapeAttr(options.alt)}" />`;
  const linkResult = normalizeImageLinkUrl(options.linkUrl ?? "");
  if (!linkResult.ok || !linkResult.url) {
    return img;
  }

  return `<a href="${escapeAttr(linkResult.url)}" target="_blank" rel="noopener noreferrer">${img}</a>`;
}

export function buildBlogInlineImageHtml(options: BlogInlineImageOptions): string {
  const width = clampWidth(options.width);
  const padding = clampPadding(options.padding);
  const alignClass = BLOG_INLINE_IMAGE_ALIGN_CLASS[options.align];

  return `<figure class="${BLOG_INLINE_IMAGE_CLASS} ${alignClass}" data-width="${width}" data-padding="${padding}">${buildImageMarkup(options)}</figure>`;
}

export function parseBlogInlineImageAlign(figure: HTMLElement): BlogImageAlign {
  if (figure.classList.contains(BLOG_INLINE_IMAGE_ALIGN_CLASS.left)) return "left";
  if (figure.classList.contains(BLOG_INLINE_IMAGE_ALIGN_CLASS.right)) return "right";
  return "below";
}

export function parseBlogInlineImageFromFigure(
  figure: HTMLElement
): BlogInlineImageOptions | null {
  if (!figure.classList.contains(BLOG_INLINE_IMAGE_CLASS)) return null;

  const anchor = figure.querySelector(":scope > a[href]");
  const img = anchor?.querySelector("img") ?? figure.querySelector(":scope > img");
  if (!img) return null;

  const url = img.getAttribute("src")?.trim();
  if (!url) return null;

  const width = parseInt(figure.getAttribute("data-width") ?? String(DEFAULT_BLOG_IMAGE_WIDTH), 10);
  const padding = parseInt(
    figure.getAttribute("data-padding") ?? String(DEFAULT_BLOG_IMAGE_PADDING),
    10
  );

  const rawLinkUrl = anchor?.getAttribute("href")?.trim() ?? "";
  const linkResult = normalizeImageLinkUrl(rawLinkUrl);

  return {
    url,
    alt: img.getAttribute("alt") ?? "",
    align: parseBlogInlineImageAlign(figure),
    width: clampWidth(Number.isNaN(width) ? DEFAULT_BLOG_IMAGE_WIDTH : width),
    padding: clampPadding(Number.isNaN(padding) ? DEFAULT_BLOG_IMAGE_PADDING : padding),
    linkUrl: linkResult.ok ? linkResult.url : "",
  };
}

/** Plain `<img>` nodes (e.g. pasted or legacy Quill images) outside `figure.blog-inline-image`. */
export function parseLegacyInlineImageFromElement(
  img: HTMLImageElement
): BlogInlineImageOptions | null {
  const url = img.getAttribute("src")?.trim();
  if (!url) return null;

  const anchor = img.closest("a[href]");
  const rawLinkUrl = anchor?.getAttribute("href")?.trim() ?? "";
  const linkResult = normalizeImageLinkUrl(rawLinkUrl);

  return {
    url,
    alt: img.getAttribute("alt") ?? "",
    align: DEFAULT_BLOG_IMAGE_ALIGN,
    width: DEFAULT_BLOG_IMAGE_WIDTH,
    padding: DEFAULT_BLOG_IMAGE_PADDING,
    linkUrl: linkResult.ok ? linkResult.url : "",
  };
}

export function parseBlogInlineImageFromHtml(html: string): BlogInlineImageOptions | null {
  if (typeof document === "undefined") return null;
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const figure = template.content.querySelector("figure");
  if (!(figure instanceof HTMLElement)) return null;
  return parseBlogInlineImageFromFigure(figure);
}

/** Apply CSS variables from data attributes for dynamic width/padding. */
export function applyBlogInlineImageStyles(root: ParentNode): void {
  root.querySelectorAll(`figure.${BLOG_INLINE_IMAGE_CLASS}`).forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const width = node.getAttribute("data-width");
    const padding = node.getAttribute("data-padding");
    if (width) node.style.setProperty("--blog-img-width", `${width}%`);
    if (padding) node.style.setProperty("--blog-img-padding", `${padding}px`);
  });
}
