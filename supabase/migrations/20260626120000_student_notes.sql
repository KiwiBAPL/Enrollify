-- Lead notes: admin staff notes linked to students (leads)

create table public.student_notes (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students(id) on delete cascade,
  content text not null check (char_length(trim(content)) > 0),
  author_email text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index student_notes_student_id_created_at_idx
  on public.student_notes (student_id, created_at desc);

create trigger student_notes_set_updated_at
  before update on public.student_notes
  for each row execute function public.set_updated_at();

alter table public.student_notes enable row level security;

create policy student_notes_admin_select on public.student_notes
  for select to authenticated using (public.is_admin());

create policy student_notes_admin_insert on public.student_notes
  for insert to authenticated with check (public.is_admin());

create policy student_notes_admin_update on public.student_notes
  for update to authenticated using (public.is_admin()) with check (public.is_admin());

create policy student_notes_admin_delete on public.student_notes
  for delete to authenticated using (public.is_admin());
