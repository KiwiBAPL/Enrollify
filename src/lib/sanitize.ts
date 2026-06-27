import DOMPurify from "dompurify";

const ALLOWED_TAGS = [
  "p", "br", "strong", "em", "u", "s",
  "h2", "h3", "h4",
  "ul", "ol", "li",
  "blockquote", "a", "img",
  "figure",
  "div", "span", "iframe",
];

const ALLOWED_ATTR = [
  "href", "target", "rel", "src", "alt", "title", "class",
  "frameborder", "allow", "allowfullscreen", "loading",
  "data-width", "data-padding",
];

const ALLOWED_BLOG_IMAGE_CLASSES = new Set([
  "blog-inline-image",
  "blog-inline-image--below",
  "blog-inline-image--left",
  "blog-inline-image--right",
]);

const ALLOWED_ALIGN_CLASSES = new Set([
  "ql-align-right",
  "ql-align-center",
  "ql-align-justify",
]);

const ALIGN_CLASS_TAGS = new Set(["P", "H2", "H3", "H4", "BLOCKQUOTE", "LI"]);

function uponSanitizeClassHook(
  node: Element,
  data: { attrName: string; attrValue: string }
): void {
  if (data.attrName !== "class") return;

  const classes = data.attrValue.split(/\s+/).filter(Boolean);

  if (node.tagName === "FIGURE") {
    data.attrValue = classes.filter((cls) => ALLOWED_BLOG_IMAGE_CLASSES.has(cls)).join(" ");
    return;
  }

  if (node.tagName === "DIV") {
    data.attrValue = classes.filter((cls) => cls === "blog-embed").join(" ");
    return;
  }

  if (ALIGN_CLASS_TAGS.has(node.tagName)) {
    data.attrValue = classes.filter((cls) => ALLOWED_ALIGN_CLASSES.has(cls)).join(" ");
  }
}

export function sanitizeBlogHtml(html: string): string {
  DOMPurify.addHook("uponSanitizeAttribute", uponSanitizeClassHook);
  try {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      ALLOW_DATA_ATTR: false,
      FORBID_TAGS: ["script", "style", "object", "embed", "form", "input"],
      FORBID_ATTR: ["onerror", "onclick", "onload", "onmouseover"],
    });
  } finally {
    DOMPurify.removeHook("uponSanitizeAttribute", uponSanitizeClassHook);
  }
}
