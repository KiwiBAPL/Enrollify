-- Website chat analytics (questions only — not leads)

create type public.chat_question_category as enum (
  'visas_immigration',
  'courses_study',
  'costs_funding',
  'english_requirements',
  'work_rights',
  'accommodation',
  'general'
);

create table public.webchat_sessions (
  id uuid primary key,
  last_activity_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.webchat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.webchat_sessions (id) on delete cascade,
  message_type public.message_type not null,
  content text not null,
  category public.chat_question_category,
  created_at timestamptz not null default now()
);

create index webchat_messages_session_created_idx
  on public.webchat_messages (session_id, created_at);

create index webchat_messages_category_created_idx
  on public.webchat_messages (category, created_at desc)
  where message_type = 'user' and category is not null;

alter table public.webchat_sessions enable row level security;
alter table public.webchat_messages enable row level security;

create policy webchat_sessions_admin_select
  on public.webchat_sessions for select to authenticated using (public.is_admin());

create policy webchat_messages_admin_select
  on public.webchat_messages for select to authenticated using (public.is_admin());
