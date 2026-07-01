-- Soft-delete for admin leads: archived_at hides from UI; hard delete after retention window.

ALTER TABLE public.students
  ADD COLUMN archived_at timestamptz NULL;

CREATE INDEX students_archived_at_idx
  ON public.students (archived_at)
  WHERE archived_at IS NOT NULL;

-- Allow channel_user_id reuse after archive (lead bot / webchat sessions).
ALTER TABLE public.students
  DROP CONSTRAINT students_channel_user_unique;

CREATE UNIQUE INDEX students_channel_user_active_uidx
  ON public.students (channel, channel_user_id)
  WHERE archived_at IS NULL;
