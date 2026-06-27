export interface EmbedResult {
  valid: boolean;
  embedUrl?: string;
  provider?: string;
  error?: string;
}

const EMBED_PATTERNS: { provider: string; test: RegExp; toEmbed: (url: string) => string }[] = [
  {
    provider: "YouTube",
    test: /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
    toEmbed: (url) => {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    },
  },
  {
    provider: "Vimeo",
    test: /vimeo\.com\/(\d+)/,
    toEmbed: (url) => {
      const match = url.match(/vimeo\.com\/(\d+)/);
      return match ? `https://player.vimeo.com/video/${match[1]}` : url;
    },
  },
  {
    provider: "Spotify",
    test: /open\.spotify\.com\/(episode|track|playlist|album)\/[\w]+/,
    toEmbed: (url) => url.replace("open.spotify.com/", "open.spotify.com/embed/"),
  },
  {
    provider: "Apple Podcasts",
    test: /podcasts\.apple\.com\//,
    toEmbed: (url) => url,
  },
  {
    provider: "SoundCloud",
    test: /soundcloud\.com\//,
    toEmbed: (url) =>
      `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23B07908`,
  },
];

export function validateEmbedUrl(url: string): EmbedResult {
  const trimmed = url.trim();
  if (!trimmed) {
    return { valid: false, error: "URL is required." };
  }

  try {
    new URL(trimmed);
  } catch {
    return { valid: false, error: "Invalid URL format." };
  }

  for (const { provider, test, toEmbed } of EMBED_PATTERNS) {
    if (test.test(trimmed)) {
      return {
        valid: true,
        embedUrl: toEmbed(trimmed),
        provider,
      };
    }
  }

  return {
    valid: false,
    error:
      "URL must be from YouTube, Vimeo, Spotify, Apple Podcasts, or SoundCloud.",
  };
}

export function buildEmbedHtml(embedUrl: string): string {
  return `<div class="blog-embed"><iframe src="${embedUrl}" title="Embedded media" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
}
