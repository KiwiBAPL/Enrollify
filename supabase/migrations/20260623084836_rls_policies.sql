-- Enrollify AI — RLS policies (Phase 2)
-- anon: deny all (no policies)
-- authenticated admin: full CRUD via app_metadata.role = 'admin'
-- service_role: bypasses RLS (backend webhook + AI)

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    false
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

alter table public.students enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.institutions enable row level security;
alter table public.courses enable row level security;
alter table public.knowledge_articles enable row level security;
alter table public.lead_scores enable row level security;
alter table public.appointments enable row level security;

-- students
create policy students_admin_select on public.students for select to authenticated using (public.is_admin());
create policy students_admin_insert on public.students for insert to authenticated with check (public.is_admin());
create policy students_admin_update on public.students for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy students_admin_delete on public.students for delete to authenticated using (public.is_admin());

-- conversations
create policy conversations_admin_select on public.conversations for select to authenticated using (public.is_admin());
create policy conversations_admin_insert on public.conversations for insert to authenticated with check (public.is_admin());
create policy conversations_admin_update on public.conversations for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy conversations_admin_delete on public.conversations for delete to authenticated using (public.is_admin());

-- messages
create policy messages_admin_select on public.messages for select to authenticated using (public.is_admin());
create policy messages_admin_insert on public.messages for insert to authenticated with check (public.is_admin());
create policy messages_admin_update on public.messages for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy messages_admin_delete on public.messages for delete to authenticated using (public.is_admin());

-- institutions
create policy institutions_admin_select on public.institutions for select to authenticated using (public.is_admin());
create policy institutions_admin_insert on public.institutions for insert to authenticated with check (public.is_admin());
create policy institutions_admin_update on public.institutions for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy institutions_admin_delete on public.institutions for delete to authenticated using (public.is_admin());

-- courses
create policy courses_admin_select on public.courses for select to authenticated using (public.is_admin());
create policy courses_admin_insert on public.courses for insert to authenticated with check (public.is_admin());
create policy courses_admin_update on public.courses for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy courses_admin_delete on public.courses for delete to authenticated using (public.is_admin());

-- knowledge_articles
create policy knowledge_articles_admin_select on public.knowledge_articles for select to authenticated using (public.is_admin());
create policy knowledge_articles_admin_insert on public.knowledge_articles for insert to authenticated with check (public.is_admin());
create policy knowledge_articles_admin_update on public.knowledge_articles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy knowledge_articles_admin_delete on public.knowledge_articles for delete to authenticated using (public.is_admin());

-- lead_scores
create policy lead_scores_admin_select on public.lead_scores for select to authenticated using (public.is_admin());
create policy lead_scores_admin_insert on public.lead_scores for insert to authenticated with check (public.is_admin());
create policy lead_scores_admin_update on public.lead_scores for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy lead_scores_admin_delete on public.lead_scores for delete to authenticated using (public.is_admin());

-- appointments
create policy appointments_admin_select on public.appointments for select to authenticated using (public.is_admin());
create policy appointments_admin_insert on public.appointments for insert to authenticated with check (public.is_admin());
create policy appointments_admin_update on public.appointments for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy appointments_admin_delete on public.appointments for delete to authenticated using (public.is_admin());
