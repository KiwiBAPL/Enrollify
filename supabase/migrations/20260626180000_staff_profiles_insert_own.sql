-- Allow admin auth users to create their own staff_profiles row if bootstrap missed them
-- Idempotent: remote may already have this policy (applied as 20260626040047)

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'staff_profiles'
      and policyname = 'staff_profiles_insert_own'
  ) then
    create policy staff_profiles_insert_own on public.staff_profiles
      for insert to authenticated
      with check (
        auth.uid() = id
        and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
      );
  end if;
end $$;
