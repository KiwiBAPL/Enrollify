import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPost,
  deletePost,
  getDistinctCategories,
  getPostById,
  getPublishedPostBySlug,
  getPublishedPosts,
  getRelatedPosts,
  listAllPosts,
  publishPost,
  updatePost,
  type AdminPostsFilter,
  type PublishedPostsFilter,
} from '@/lib/blog'
import type { BlogPostInsert, BlogPostUpdate } from '@/types/database'

export const blogKeys = {
  all: ['blog'] as const,
  published: (filters: PublishedPostsFilter) => [...blogKeys.all, 'published', filters] as const,
  post: (slug: string) => [...blogKeys.all, 'post', slug] as const,
  related: (id: string) => [...blogKeys.all, 'related', id] as const,
  adminList: (filters: AdminPostsFilter) => [...blogKeys.all, 'admin', filters] as const,
  adminPost: (id: string) => [...blogKeys.all, 'admin', id] as const,
  categories: () => [...blogKeys.all, 'categories'] as const,
}

export function useBlogCategories() {
  return useQuery({
    queryKey: blogKeys.categories(),
    queryFn: async () => {
      const { data, error } = await getDistinctCategories()
      if (error) throw new Error(error.message)
      return data ?? []
    },
  })
}

export function usePublishedPosts(filters: PublishedPostsFilter = {}) {
  return useQuery({
    queryKey: blogKeys.published(filters),
    queryFn: async () => {
      const { data, error } = await getPublishedPosts(filters)
      if (error) throw new Error(error.message)
      return data ?? []
    },
  })
}

export function usePublishedPost(slug: string) {
  return useQuery({
    queryKey: blogKeys.post(slug),
    queryFn: async () => {
      const { data, error } = await getPublishedPostBySlug(slug)
      if (error) throw new Error(error.message)
      return data
    },
    enabled: Boolean(slug),
  })
}

export function useRelatedPosts(
  postId: string,
  post: Parameters<typeof getRelatedPosts>[0] | null,
) {
  return useQuery({
    queryKey: blogKeys.related(postId),
    queryFn: async () => {
      if (!post) return []
      const { data, error } = await getRelatedPosts(post)
      if (error) throw new Error(error.message)
      return data ?? []
    },
    enabled: Boolean(post),
  })
}

export function useAdminPosts(filters: AdminPostsFilter = {}) {
  return useQuery({
    queryKey: blogKeys.adminList(filters),
    queryFn: async () => {
      const { data, error } = await listAllPosts(filters)
      if (error) throw new Error(error.message)
      return data ?? []
    },
  })
}

export function useAdminPost(id: string | undefined) {
  return useQuery({
    queryKey: blogKeys.adminPost(id ?? ''),
    queryFn: async () => {
      const { data, error } = await getPostById(id!)
      if (error) throw new Error(error.message)
      return data
    },
    enabled: Boolean(id),
  })
}

export function useBlogMutations() {
  const queryClient = useQueryClient()

  const invalidate = () => queryClient.invalidateQueries({ queryKey: blogKeys.all })

  const create = useMutation({
    mutationFn: async (input: BlogPostInsert) => {
      const { data, error } = await createPost(input)
      if (error) throw new Error(error.message)
      return data!
    },
    onSuccess: invalidate,
  })

  const update = useMutation({
    mutationFn: async ({ id, input }: { id: string; input: BlogPostUpdate }) => {
      const { data, error } = await updatePost(id, input)
      if (error) throw new Error(error.message)
      return data!
    },
    onSuccess: invalidate,
  })

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await deletePost(id)
      if (error) throw new Error(error.message)
    },
    onSuccess: invalidate,
  })

  const publish = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await publishPost(id)
      if (error) throw new Error(error.message)
      return data!
    },
    onSuccess: invalidate,
  })

  return { create, update, remove, publish }
}
