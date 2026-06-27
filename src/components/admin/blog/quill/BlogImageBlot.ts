import type Quill from "quill";
import {
  BLOG_INLINE_IMAGE_ALIGN_CLASS,
  BLOG_INLINE_IMAGE_CLASS,
  clampPadding,
  clampWidth,
  normalizeImageLinkUrl,
  parseBlogInlineImageFromFigure,
  type BlogInlineImageOptions,
} from "@/lib/blog-image-html";

/** Must extend BlockEmbed from the same Quill instance react-quill uses. */
export function defineBlogImageBlot(QuillConstructor: typeof Quill) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BlockEmbed = QuillConstructor.import("blots/block/embed") as any;

  return class BlogImageBlot extends BlockEmbed {
    static blotName = "blogImage";
    static tagName = "FIGURE";
    static className = BLOG_INLINE_IMAGE_CLASS;

    static create(value: BlogInlineImageOptions): HTMLElement {
      const node = super.create() as HTMLElement;
      node.classList.add(BLOG_INLINE_IMAGE_CLASS, BLOG_INLINE_IMAGE_ALIGN_CLASS[value.align]);
      node.setAttribute("data-width", String(clampWidth(value.width)));
      node.setAttribute("data-padding", String(clampPadding(value.padding)));
      node.setAttribute("contenteditable", "false");

      const img = document.createElement("img");
      img.setAttribute("src", value.url);
      img.setAttribute("alt", value.alt);

      const linkResult = normalizeImageLinkUrl(value.linkUrl ?? "");
      if (linkResult.ok && linkResult.url) {
        const anchor = document.createElement("a");
        anchor.setAttribute("href", linkResult.url);
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
        anchor.appendChild(img);
        node.appendChild(anchor);
      } else {
        node.appendChild(img);
      }

      return node;
    }

    static value(node: HTMLElement): BlogInlineImageOptions {
      return (
        parseBlogInlineImageFromFigure(node) ?? {
          url: "",
          alt: "",
          align: "below",
          width: 100,
          padding: 16,
        }
      );
    }
  };
}
