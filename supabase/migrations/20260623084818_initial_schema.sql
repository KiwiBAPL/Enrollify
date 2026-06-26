-- Enrollify AI — initial schema (Phase 2)

create type public.channel_type as enum ('facebook', 'webchat');
create type public.message_type as enum ('user', 'assistant');
create type public.enrolment_status as enum (
  'enquiry',
  'qualified_lead',
  'appointment_booked',
  'application_submitted',
  'enrolled',
  'not_qualified'
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  channel public.channel_type not null,
  channel_user_id text not null,
  name text,
  email text,
  phone text,
  country text,
  citizenship text,
  current_education_level text,
  desired_qualification text,
  field_of_study text,
  english_level text,
  preferred_intake text,
  budget text,
  visa_status text,
  enrolment_status public.enrolment_status not null default 'enquiry',
  last_activity_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint students_channel_user_unique unique (channel, channel_user_id)
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  channel public.channel_type not null,
  status text not null default 'active',
  started_at timestamptz not null default now(),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  message_type public.message_type not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table public.institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  location text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.institutions (id) on delete cascade,
  name text not null,
  qualification_level text,
  field_of_study text,
  duration text,
  tuition text,
  intake_dates text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.knowledge_articles (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text,
  source_document_url text,
  search_vector tsvector generated always as (
    to_tsvector(
      'english',
      coalesce(title, '') || ' ' || coalesce(content, '') || ' ' || coalesce(category, '')
    )
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.lead_scores (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null unique references public.students (id) on delete cascade,
  overall_score smallint not null default 0 check (overall_score between 0 and 100),
  ready_to_apply smallint not null default 0 check (ready_to_apply between 0 and 10),
  english_ability smallint not null default 0 check (english_ability between 0 and 10),
  budget_fit smallint not null default 0 check (budget_fit between 0 and 10),
  intake_timeframe smallint not null default 0 check (intake_timeframe between 0 and 10),
  visa_readiness smallint not null default 0 check (visa_readiness between 0 and 10),
  education_match smallint not null default 0 check (education_match between 0 and 10),
  interest_level smallint not null default 0 check (interest_level between 0 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.appointments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.students (id) on delete cascade,
  scheduled_at timestamptz,
  status text not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index students_last_activity_idx on public.students (last_activity_at desc nulls last);
create index students_enrolment_status_idx on public.students (enrolment_status);
create index students_country_idx on public.students (country);
create index conversations_student_id_idx on public.conversations (student_id);
create index conversations_last_message_idx on public.conversations (last_message_at desc nulls last);
create index messages_conversation_created_idx on public.messages (conversation_id, created_at);
create index courses_institution_id_idx on public.courses (institution_id);
create index knowledge_articles_search_idx on public.knowledge_articles using gin (search_vector);
create index lead_scores_overall_score_idx on public.lead_scores (overall_score desc);
create index appointments_student_id_idx on public.appointments (student_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger students_set_updated_at before update on public.students for each row execute function public.set_updated_at();
create trigger conversations_set_updated_at before update on public.conversations for each row execute function public.set_updated_at();
create trigger institutions_set_updated_at before update on public.institutions for each row execute function public.set_updated_at();
create trigger courses_set_updated_at before update on public.courses for each row execute function public.set_updated_at();
create trigger knowledge_articles_set_updated_at before update on public.knowledge_articles for each row execute function public.set_updated_at();
create trigger lead_scores_set_updated_at before update on public.lead_scores for each row execute function public.set_updated_at();
create trigger appointments_set_updated_at before update on public.appointments for each row execute function public.set_updated_at();
