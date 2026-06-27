import Fuse from "fuse.js";
import type { BlogPost } from "@/types/database";

export const FEATURED_SIDEBAR_LIMIT = 5;

export type BlogSort = "newest" | "oldest" | "title";

export interface SearchablePost {
  post: BlogPost;
  title: string;
  summary: string;
  headings: string;
}

export function extractHeadingsFromHtml(html: string): string {
  const matches = html.matchAll(/<h[2-4][^>]*>([\s\S]*?)<\/h[2-4]>/gi);
  const headings: string[] = [];
  for (const match of matches) {
    const text = match[1].replace(/<[^>]+>/g, "").trim();
    if (text) headings.push(text);
  }
  return headings.join(" ");
}

export function buildSearchablePost(post: BlogPost): SearchablePost {
  return {
    post,
    title: post.title,
    summary: post.summary ?? "",
    headings: extractHeadingsFromHtml(post.body),
  };
}

export function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  const trimmed = query.trim();
  if (!trimmed) return posts;

  const searchable = posts.map(buildSearchablePost);
  const fuse = new Fuse(searchable, {
    keys: [
      { name: "title", weight: 0.5 },
      { name: "summary", weight: 0.3 },
      { name: "headings", weight: 0.2 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
  });

  return fuse.search(trimmed).map((result) => result.item.post);
}

export function filterPostsByCategory(
  posts: BlogPost[],
  category?: string
): BlogPost[] {
  if (!category) return posts;
  return posts.filter((post) => post.category === category);
}

export function filterPostsBySeries(
  posts: BlogPost[],
  series?: string
): BlogPost[] {
  if (!series) return posts;
  return posts.filter((post) => post.series_collection === series);
}

export function sortPosts(
  posts: BlogPost[],
  sort: BlogSort = "newest"
): BlogPost[] {
  const sorted = [...posts];
  switch (sort) {
    case "oldest":
      return sorted.sort(
        (a, b) =>
          new Date(a.published_at ?? 0).getTime() -
          new Date(b.published_at ?? 0).getTime()
      );
    case "title":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case "newest":
    default:
      return sorted.sort(
        (a, b) =>
          new Date(b.published_at ?? 0).getTime() -
          new Date(a.published_at ?? 0).getTime()
      );
  }
}

export function getFeaturedPosts(
  posts: BlogPost[],
  limit = FEATURED_SIDEBAR_LIMIT
): BlogPost[] {
  return posts
    .filter((post) => post.is_featured)
    .sort(
      (a, b) =>
        new Date(b.published_at ?? 0).getTime() -
        new Date(a.published_at ?? 0).getTime()
    )
    .slice(0, limit);
}

export function applyBlogListingFilters(
  posts: BlogPost[],
  filters: {
    category?: string;
    series?: string;
    search?: string;
    sort?: BlogSort;
  }
): BlogPost[] {
  let result = filterPostsByCategory(posts, filters.category);
  result = filterPostsBySeries(result, filters.series);
  if (filters.search?.trim()) {
    result = searchPosts(result, filters.search);
  } else if (filters.sort) {
    result = sortPosts(result, filters.sort);
  } else {
    result = sortPosts(result, "newest");
  }
  return result;
}
