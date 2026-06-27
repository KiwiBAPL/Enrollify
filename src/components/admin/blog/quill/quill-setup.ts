import ReactQuill from "react-quill-new";
import Quill from "quill";
import { parseBlogInlineImageFromFigure } from "@/lib/blog-image-html";
import { defineBlogImageBlot } from "./BlogImageBlot";

// Use the same Quill instance react-quill uses so blots register correctly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const QuillConstructor = (ReactQuill as any).Quill as typeof Quill;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Delta = QuillConstructor.import("delta") as any;

let registered = false;

export function ensureBlogQuillSetup(): typeof Quill {
  if (!registered) {
    const BlogImageBlot = defineBlogImageBlot(QuillConstructor);
    QuillConstructor.register(BlogImageBlot);
    registered = true;
  }
  return QuillConstructor;
}

export function blogImageClipboardMatcher(node: Node, delta: typeof Delta) {
  if (!(node instanceof HTMLElement)) return delta;
  const options = parseBlogInlineImageFromFigure(node);
  if (!options) return delta;
  return new Delta().insert({ blogImage: options });
}

export const blogClipboardModule = {
  matchers: [["figure.blog-inline-image", blogImageClipboardMatcher] as const],
};

ensureBlogQuillSetup();
