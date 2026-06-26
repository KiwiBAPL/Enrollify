-- Staff profiles: admin/consultant user profiles linked to Supabase Auth

create type public.staff_role as enum ('admin', 'consultant');

create table public.staff_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text not null,
  last_name text not null,
  role public.staff_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index staff_profiles_email_idx on public.staff_profiles (email);

create trigger staff_profiles_set_updated_at
  before update on public.staff_profiles
  for each row execute function public.set_updated_at();

alter table public.staff_profiles enable row level security;

create policy staff_profiles_select_own on public.staff_profiles
  for select to authenticated using (auth.uid() = id);

create policy staff_profiles_update_own on public.staff_profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

create policy staff_profiles_admin_select on public.staff_profiles
  for select to authenticated using (public.is_admin());
