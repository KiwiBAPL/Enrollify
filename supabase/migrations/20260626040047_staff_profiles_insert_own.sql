-- Allow admin auth users to create their own staff_profiles row if bootstrap missed them
-- Applied to remote via MCP; kept for migration history alignment with 20260626180000 (idempotent duplicate).

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
