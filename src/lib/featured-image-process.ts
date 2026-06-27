export const FEATURED_IMAGE_MAX_WIDTH = 1400;

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

const INITIAL_QUALITY = 0.85;
const MIN_QUALITY = 0.5;
const QUALITY_STEP = 0.1;

export type FeaturedImageProcessError = {
  message: string;
};

export type FeaturedImageProcessResult =
  | { file: File; error: null }
  | { file: null; error: FeaturedImageProcessError };

export function computeFeaturedImageDimensions(
  width: number,
  height: number,
  maxWidth = FEATURED_IMAGE_MAX_WIDTH
): { width: number; height: number } {
  if (width <= maxWidth) {
    return { width, height };
  }

  const scale = maxWidth / width;
  return {
    width: maxWidth,
    height: Math.round(height * scale),
  };
}

function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read image file."));
    };
    img.src = url;
  });
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality: number
): Promise<Blob | null> {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, mimeType, quality);
  });
}

function replaceExtension(name: string, extension: string): string {
  const base = name.replace(/\.[^.]+$/, "") || "featured-image";
  return `${base}.${extension}`;
}

async function encodeCanvas(
  canvas: HTMLCanvasElement,
  fileName: string
): Promise<File | null> {
  const attempts: Array<{ mimeType: string; extension: string }> = [
    { mimeType: "image/webp", extension: "webp" },
    { mimeType: "image/jpeg", extension: "jpg" },
  ];

  for (const { mimeType, extension } of attempts) {
    let quality = INITIAL_QUALITY;

    while (quality >= MIN_QUALITY) {
      const blob = await canvasToBlob(canvas, mimeType, quality);
      if (!blob) break;

      if (blob.size <= MAX_IMAGE_SIZE_BYTES) {
        return new File([blob], replaceExtension(fileName, extension), {
          type: mimeType,
          lastModified: Date.now(),
        });
      }

      quality -= QUALITY_STEP;
    }
  }

  return null;
}

export async function prepareFeaturedImage(
  file: File
): Promise<FeaturedImageProcessResult> {
  if (
    !ALLOWED_IMAGE_TYPES.includes(
      file.type as (typeof ALLOWED_IMAGE_TYPES)[number]
    )
  ) {
    return {
      file: null,
      error: { message: "Image must be JPEG, PNG, or WebP." },
    };
  }

  let img: HTMLImageElement;
  try {
    img = await loadImageFromFile(file);
  } catch {
    return {
      file: null,
      error: { message: "Could not read image file." },
    };
  }

  const { width, height } = computeFeaturedImageDimensions(
    img.naturalWidth,
    img.naturalHeight
  );

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return {
      file: null,
      error: { message: "Could not process image." },
    };
  }

  ctx.drawImage(img, 0, 0, width, height);

  const processed = await encodeCanvas(canvas, file.name);
  if (processed) {
    return { file: processed, error: null };
  }

  if (file.size <= MAX_IMAGE_SIZE_BYTES) {
    return { file, error: null };
  }

  return {
    file: null,
    error: {
      message:
        "Image could not be compressed below 2 MB. Try a smaller source file.",
    },
  };
}
