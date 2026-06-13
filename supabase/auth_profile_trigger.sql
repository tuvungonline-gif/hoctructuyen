-- Run this after supabase/schema.sql if you use Supabase Auth.
-- It creates a profile automatically when a new auth user signs up.

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role, status)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1), 'Học viên'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    'student',
    'active'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Allow authenticated users to insert their own profile only as student.
-- This is a fallback. The trigger above is the preferred path.
drop policy if exists "Users can insert own student profile" on public.profiles;

create policy "Users can insert own student profile" on public.profiles
for insert
with check (
  auth.uid() = id
  and role = 'student'
);
