-- Blog posts table, RLS, storage bucket (Phases 2–4 MVP)
-- Uses existing public.is_admin() from 20260623084836_rls_policies.sql

-- ---------------------------------------------------------------------------
-- blog_posts table
-- ---------------------------------------------------------------------------
CREATE TABLE public.blog_posts (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text NOT NULL,
  slug                text NOT NULL UNIQUE,
  body                text NOT NULL DEFAULT '',
  summary             text,
  status              text NOT NULL DEFAULT 'draft'
                      CHECK (status IN ('draft', 'published')),
  category            text NOT NULL DEFAULT '',
  series_collection   text,
  featured_image_url  text,
  featured_image_alt  text,
  meta_title          text NOT NULL DEFAULT '',
  meta_description    text NOT NULL DEFAULT '',
  author_name         text NOT NULL DEFAULT 'EnRollify',
  published_at        timestamptz,
  article_template    text NOT NULL DEFAULT 'classic',
  related_post_slugs  text[] NOT NULL DEFAULT '{}',
  is_featured         boolean NOT NULL DEFAULT false,
  faq_text            text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX idx_blog_posts_published_at
  ON public.blog_posts (published_at DESC NULLS LAST);

CREATE INDEX idx_blog_posts_status
  ON public.blog_posts (status);

CREATE INDEX idx_blog_posts_category
  ON public.blog_posts (category);

CREATE INDEX idx_blog_posts_series_collection
  ON public.blog_posts (series_collection)
  WHERE series_collection IS NOT NULL;

CREATE INDEX idx_blog_posts_is_featured
  ON public.blog_posts (is_featured)
  WHERE is_featured = true;

-- ---------------------------------------------------------------------------
-- updated_at trigger (search_path hardened)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_blog_posts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION public.set_blog_posts_updated_at();

-- ---------------------------------------------------------------------------
-- RLS policies
-- ---------------------------------------------------------------------------
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY blog_posts_public_read ON public.blog_posts
  FOR SELECT
  USING (status = 'published');

CREATE POLICY blog_posts_admin_read ON public.blog_posts
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY blog_posts_admin_insert ON public.blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY blog_posts_admin_update ON public.blog_posts
  FOR UPDATE
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY blog_posts_admin_delete ON public.blog_posts
  FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage bucket: blog-images
-- ---------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'blog-images',
  'blog-images',
  true,
  2097152,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY blog_images_admin_insert ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin());

CREATE POLICY blog_images_admin_update ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'blog-images' AND public.is_admin());

CREATE POLICY blog_images_admin_delete ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'blog-images' AND public.is_admin());
