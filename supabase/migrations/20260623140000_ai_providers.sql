-- AI provider configuration (encrypted API keys, failover priority)

create type public.ai_provider_type as enum ('perplexity', 'claude');

create table public.ai_providers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  provider_type public.ai_provider_type not null,
  model text not null,
  api_key_ciphertext text not null,
  enabled boolean not null default true,
  priority int not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index ai_providers_enabled_priority_idx
  on public.ai_providers (enabled, priority);

create trigger ai_providers_set_updated_at
  before update on public.ai_providers
  for each row execute function public.set_updated_at();

alter table public.ai_providers enable row level security;

-- No policies: backend service_role only; anon/authenticated denied
