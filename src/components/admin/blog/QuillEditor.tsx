import { useEffect, useMemo, useRef, useImperativeHandle, forwardRef, useCallback, useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { buildEmbedHtml, validateEmbedUrl } from "@/lib/embed-allowlist";
import {
  applyBlogInlineImageStyles,
  buildBlogInlineImageHtml,
  BLOG_INLINE_IMAGE_CLASS,
  parseBlogInlineImageFromFigure,
  parseLegacyInlineImageFromElement,
  type BlogInlineImageOptions,
} from "@/lib/blog-image-html";
import { blogClipboardModule, ensureBlogQuillSetup } from "@/components/admin/blog/quill/quill-setup";

function getEditorImageOptionsFromBlot(blot: { domNode: Node | null }): BlogInlineImageOptions | null {
  if (!(blot.domNode instanceof HTMLElement)) return null;

  if (blot.domNode.classList.contains(BLOG_INLINE_IMAGE_CLASS)) {
    return parseBlogInlineImageFromFigure(blot.domNode);
  }

  const img =
    blot.domNode instanceof HTMLImageElement
      ? blot.domNode
      : blot.domNode.querySelector("img");

  if (!(img instanceof HTMLImageElement)) return null;
  if (img.closest(`figure.${BLOG_INLINE_IMAGE_CLASS}`)) return null;

  return parseLegacyInlineImageFromElement(img);
}

function isDeletableEditorImageBlot(blot: { domNode: Node | null } | null | undefined): boolean {
  return getEditorImageOptionsFromBlot(blot ?? { domNode: null }) !== null;
}

const Quill = ensureBlogQuillSetup();

function syncHtml(editor: InstanceType<typeof Quill>, onChange: (html: string) => void) {
  editor.root.querySelectorAll(".blog-inline-image-drag-handle").forEach((el) => el.remove());
  onChange(editor.root.innerHTML);
}

function getIndexFromPoint(editor: InstanceType<typeof Quill>, clientX: number, clientY: number): number {
  const doc = editor.root.ownerDocument;
  let range: Range | null = null;

  if (doc.caretRangeFromPoint) {
    range = doc.caretRangeFromPoint(clientX, clientY);
  } else if ("caretPositionFromPoint" in doc) {
    const pos = (
      doc as Document & {
        caretPositionFromPoint: (x: number, y: number) => { offsetNode: Node; offset: number } | null;
      }
    ).caretPositionFromPoint(clientX, clientY);
    if (pos) {
      range = doc.createRange();
      range.setStart(pos.offsetNode, pos.offset);
      range.collapse(true);
    }
  }

  if (!range) return editor.getLength();

  const blot = Quill.find(range.startContainer, true)
  if (!blot) return editor.getLength()

  // Quill typings return Quill | Blot; getIndex expects Blot
  return editor.getIndex(blot as never) + range.startOffset
}

export interface QuillEditorHandle {
  insertEmbed: (url: string) => string | null;
  insertBlogImage: (options: BlogInlineImageOptions) => boolean;
  updateBlogImage: (index: number, options: BlogInlineImageOptions) => boolean;
  deleteBlogImage: (index: number) => boolean;
  getBlogImageAtIndex: (index: number) => BlogInlineImageOptions | null;
  getHtml: () => string | null;
  saveSelection: () => void;
}

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlogImageClick?: (index: number, options: BlogInlineImageOptions) => void;
  onRequestInsertImage?: () => void;
}

export const QuillEditor = forwardRef<QuillEditorHandle, QuillEditorProps>(
  function QuillEditor({ value, onChange, onBlogImageClick, onRequestInsertImage }, ref) {
    const [mounted, setMounted] = useState(false);
    const quillRef = useRef<ReactQuill>(null);
    const onChangeRef = useRef(onChange);
    const onBlogImageClickRef = useRef(onBlogImageClick);
    const onRequestInsertImageRef = useRef(onRequestInsertImage);
    const savedSelectionRef = useRef<number | null>(null);
    const draggingIndexRef = useRef<number | null>(null);
    const openImageDialogRef = useRef<() => void>(() => {});

    onChangeRef.current = onChange;
    onBlogImageClickRef.current = onBlogImageClick;
    onRequestInsertImageRef.current = onRequestInsertImage;

    useEffect(() => {
      setMounted(true);
    }, []);

    const getEditor = useCallback(() => quillRef.current?.getEditor(), []);

    openImageDialogRef.current = () => {
      const editor = getEditor();
      if (editor) {
        const range = editor.getSelection();
        savedSelectionRef.current = range?.index ?? editor.getLength();
      }
      onRequestInsertImageRef.current?.();
    };

    const insertFigureAtSelection = useCallback(
      (options: BlogInlineImageOptions, replaceIndex?: number): boolean => {
        const editor = getEditor();
        if (!editor) return false;

        let insertIndex = replaceIndex ?? savedSelectionRef.current ?? editor.getSelection()?.index ?? editor.getLength();
        savedSelectionRef.current = null;
        insertIndex = Math.max(0, Math.min(insertIndex, editor.getLength()));

        try {
          if (replaceIndex !== undefined) {
            editor.deleteText(replaceIndex, 1, Quill.sources.USER);
            insertIndex = replaceIndex;
          }

          editor.insertEmbed(insertIndex, "blogImage", options, Quill.sources.USER);
        } catch {
          try {
            editor.clipboard.dangerouslyPasteHTML(
              insertIndex,
              buildBlogInlineImageHtml(options),
              Quill.sources.USER
            );
            syncHtml(editor, onChangeRef.current);
            return editor.root.innerHTML.includes("blog-inline-image");
          } catch {
            return false;
          }
        }

        syncHtml(editor, onChangeRef.current);
        return editor.root.innerHTML.includes("blog-inline-image");
      },
      [getEditor]
    );

    useImperativeHandle(ref, () => ({
      saveSelection() {
        const editor = getEditor();
        if (!editor) return;
        const range = editor.getSelection();
        savedSelectionRef.current = range?.index ?? editor.getLength();
      },
      insertEmbed(url: string) {
        const result = validateEmbedUrl(url);
        if (!result.valid || !result.embedUrl) {
          return result.error ?? "Invalid embed URL.";
        }
        const editor = getEditor();
        if (!editor) return "Editor not ready.";
        const range = editor.getSelection(true);
        const index = range?.index ?? editor.getLength();
        editor.clipboard.dangerouslyPasteHTML(index, buildEmbedHtml(result.embedUrl));
        syncHtml(editor, onChangeRef.current);
        return null;
      },
      insertBlogImage(options: BlogInlineImageOptions) {
        return insertFigureAtSelection(options);
      },
      updateBlogImage(index: number, options: BlogInlineImageOptions) {
        return insertFigureAtSelection(options, index);
      },
      deleteBlogImage(index: number) {
        const editor = getEditor();
        if (!editor) return false;

        const [blot] = editor.getLeaf(index);
        if (!isDeletableEditorImageBlot(blot)) return false;

        try {
          editor.deleteText(index, 1, Quill.sources.USER);
          syncHtml(editor, onChangeRef.current);
          return true;
        } catch {
          return false;
        }
      },
      getBlogImageAtIndex(index: number) {
        const editor = getEditor();
        if (!editor) return null;
        const [blot] = editor.getLeaf(index);
        return getEditorImageOptionsFromBlot(blot ?? { domNode: null });
      },
      getHtml() {
        const editor = getEditor();
        if (!editor) return null;
        return editor.root.innerHTML;
      },
    }));

    const modules = useMemo(
      () => ({
        clipboard: blogClipboardModule,
        toolbar: {
          container: [
            [{ header: [2, 3, false] }],
            ["bold", "italic"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: ["", "right", "justify"] }],
            ["blockquote", "link", "image"],
          ],
          handlers: {
            image: () => openImageDialogRef.current(),
          },
        },
      }),
      []
    );

    const formats = [
      "header",
      "bold",
      "italic",
      "list",
      "align",
      "blockquote",
      "link",
      "image",
      "blogImage",
    ];

    useEffect(() => {
      let clickCleanup: (() => void) | undefined;
      let dragCleanup: (() => void) | undefined;
      let timer: number | undefined;

      const register = () => {
        const editor = getEditor();
        if (!editor) return;

        const root = editor.root;

        const handleClick = (event: MouseEvent) => {
          const target = event.target;
          if (!(target instanceof HTMLElement)) return;
          if (target.closest(".blog-inline-image-drag-handle")) return;

          const figure = target.closest(`figure.${BLOG_INLINE_IMAGE_CLASS}`);
          const legacyImg =
            figure instanceof HTMLElement
              ? null
              : target.closest("img:not(figure.blog-inline-image img)");

          if (!(figure instanceof HTMLElement) && !(legacyImg instanceof HTMLImageElement)) return;

          event.preventDefault();
          event.stopPropagation();

          const blotTarget = figure ?? legacyImg
          if (!blotTarget) return
          const blot = Quill.find(blotTarget)
          if (!blot) return

          const index = editor.getIndex(blot as never)
          const options =
            figure instanceof HTMLElement
              ? parseBlogInlineImageFromFigure(figure)
              : parseLegacyInlineImageFromElement(legacyImg as HTMLImageElement);
          if (options) {
            onBlogImageClickRef.current?.(index, options);
          }
        };

        const handleDragStart = (event: DragEvent) => {
          const target = event.target;
          if (!(target instanceof HTMLElement)) return;

          const handle = target.closest(".blog-inline-image-drag-handle");
          const figure = target.closest(`figure.${BLOG_INLINE_IMAGE_CLASS}`);
          if (!handle || !(figure instanceof HTMLElement)) return;

          const blot = Quill.find(figure);
          if (!blot) return;

          const index = editor.getIndex(blot as never)
          draggingIndexRef.current = index
          event.dataTransfer?.setData("text/plain", String(index));
          event.dataTransfer!.effectAllowed = "move";
        };

        const handleDragOver = (event: DragEvent) => {
          if (draggingIndexRef.current === null) return;
          event.preventDefault();
          event.dataTransfer!.dropEffect = "move";
        };

        const handleDrop = (event: DragEvent) => {
          const fromIndex = draggingIndexRef.current;
          draggingIndexRef.current = null;
          if (fromIndex === null) return;

          event.preventDefault();
          event.stopPropagation();

          const leaf = editor.getLeaf(fromIndex)[0];
          if (!(leaf?.domNode instanceof HTMLElement)) return;
          const parsed = parseBlogInlineImageFromFigure(leaf.domNode);
          if (!parsed) return;

          let toIndex = getIndexFromPoint(editor, event.clientX, event.clientY);
          toIndex = Math.max(0, Math.min(toIndex, editor.getLength()));

          editor.deleteText(fromIndex, 1, Quill.sources.USER);
          const adjustedTo = toIndex > fromIndex ? toIndex - 1 : toIndex;
          editor.clipboard.dangerouslyPasteHTML(adjustedTo, buildBlogInlineImageHtml(parsed));
          syncHtml(editor, onChangeRef.current);
        };

        const handleDragEnd = () => {
          draggingIndexRef.current = null;
        };

        applyBlogInlineImageStyles(root);

        root.addEventListener("click", handleClick);
        root.addEventListener("dragstart", handleDragStart);
        root.addEventListener("dragover", handleDragOver);
        root.addEventListener("drop", handleDrop);
        root.addEventListener("dragend", handleDragEnd);

        clickCleanup = () => root.removeEventListener("click", handleClick);
        dragCleanup = () => {
          root.removeEventListener("dragstart", handleDragStart);
          root.removeEventListener("dragover", handleDragOver);
          root.removeEventListener("drop", handleDrop);
          root.removeEventListener("dragend", handleDragEnd);
        };
      };

      if (getEditor()) {
        register();
      } else {
        timer = window.setTimeout(register, 0);
      }

      return () => {
        if (timer) window.clearTimeout(timer);
        clickCleanup?.();
        dragCleanup?.();
      };
    }, [getEditor]);

    useEffect(() => {
      const editor = getEditor();
      if (!editor) return;

      applyBlogInlineImageStyles(editor.root);

      editor.root.querySelectorAll(`figure.${BLOG_INLINE_IMAGE_CLASS}`).forEach((figure) => {
        if (!(figure instanceof HTMLElement)) return;
        if (figure.querySelector(".blog-inline-image-drag-handle")) return;

        figure.setAttribute("draggable", "false");
        const handle = document.createElement("span");
        handle.className = "blog-inline-image-drag-handle";
        handle.setAttribute("draggable", "true");
        handle.setAttribute("title", "Drag to move");
        handle.setAttribute("aria-label", "Drag to move image");
        handle.textContent = "⋮⋮";
        figure.prepend(handle);
      });
    }, [value, getEditor]);

    if (!mounted) {
      return (
        <div className="blog-quill-editor rounded-md border bg-white px-4 py-8 font-body text-sm text-text-muted">
          Loading editor…
        </div>
      );
    }

    return (
      <div className="blog-quill-editor bg-white rounded-md border">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={value}
          onChange={onChange}
          modules={modules}
          formats={formats}
          placeholder="Write your article body…"
        />
      </div>
    );
  }
);
