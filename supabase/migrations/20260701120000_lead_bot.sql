-- Lead Generator Bot: channel + qualification columns

alter type public.channel_type add value if not exists 'lead_bot';

alter table public.students
  add column if not exists funding_source text,
  add column if not exists funds_available text,
  add column if not exists english_test_completed text,
  add column if not exists visa_refusal_history text;
