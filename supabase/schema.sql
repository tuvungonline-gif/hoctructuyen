-- EduVideo production database schema for Supabase/Postgres
-- Run this file in Supabase SQL Editor.

create extension if not exists "uuid-ossp";

-- 1. Common helpers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- 2. Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  phone text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'admin', 'instructor')),
  status text not null default 'active' check (status in ('active', 'blocked')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- 3. Courses
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  title text not null,
  short_title text,
  description text,
  level text,
  thumbnail_url text,
  price numeric(12, 2) not null default 0,
  currency text not null default 'VND',
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  instructor_id uuid references public.profiles(id),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_courses_updated_at
before update on public.courses
for each row execute function public.set_updated_at();

-- 4. Lessons
create table if not exists public.lessons (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  description text,
  video_provider text default 'external',
  video_asset_id text,
  video_url text,
  duration_seconds int default 0,
  is_preview boolean not null default false,
  sort_order int not null default 0,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lessons_course_id_idx on public.lessons(course_id);
create trigger set_lessons_updated_at
before update on public.lessons
for each row execute function public.set_updated_at();

-- 5. Orders
create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  amount numeric(12, 2) not null,
  currency text not null default 'VND',
  payment_provider text,
  provider_order_id text,
  provider_transaction_id text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'cancelled', 'refunded')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders(user_id);
create index if not exists orders_course_id_idx on public.orders(course_id);
create trigger set_orders_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

-- 6. Enrollments
create table if not exists public.enrollments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  order_id uuid references public.orders(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'active', 'blocked', 'expired', 'cancelled')),
  activated_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create index if not exists enrollments_user_id_idx on public.enrollments(user_id);
create index if not exists enrollments_course_id_idx on public.enrollments(course_id);
create trigger set_enrollments_updated_at
before update on public.enrollments
for each row execute function public.set_updated_at();

-- 7. Lesson progress
create table if not exists public.lesson_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  last_position_seconds int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create index if not exists lesson_progress_user_course_idx on public.lesson_progress(user_id, course_id);
create trigger set_lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.set_updated_at();

-- 8. Notes
create table if not exists public.lesson_notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  content text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

create trigger set_lesson_notes_updated_at
before update on public.lesson_notes
for each row execute function public.set_updated_at();

-- 9. Questions
create table if not exists public.lesson_questions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete set null,
  question text not null,
  answer text,
  status text not null default 'open' check (status in ('open', 'answered', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists lesson_questions_course_idx on public.lesson_questions(course_id);
create trigger set_lesson_questions_updated_at
before update on public.lesson_questions
for each row execute function public.set_updated_at();

-- 10. Notifications
create table if not exists public.notifications (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  audience text not null default 'all' check (audience in ('all', 'student', 'admin', 'instructor')),
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.notification_reads (
  id uuid primary key default uuid_generate_v4(),
  notification_id uuid not null references public.notifications(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  unique(notification_id, user_id)
);

-- 11. Support tickets
create table if not exists public.support_tickets (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  category text not null default 'other',
  priority text not null default 'medium' check (priority in ('low', 'medium', 'high')),
  message text not null,
  reply text,
  status text not null default 'open' check (status in ('open', 'done', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_support_tickets_updated_at
before update on public.support_tickets
for each row execute function public.set_updated_at();

-- 12. Reviews
create table if not exists public.course_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  content text,
  status text not null default 'visible' check (status in ('visible', 'hidden')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, course_id)
);

create trigger set_course_reviews_updated_at
before update on public.course_reviews
for each row execute function public.set_updated_at();

-- 13. Schedules
create table if not exists public.schedules (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid references public.courses(id) on delete set null,
  title text not null,
  event_type text not null default 'live',
  starts_at timestamptz not null,
  location text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_schedules_updated_at
before update on public.schedules
for each row execute function public.set_updated_at();

-- 14. Certificates
create table if not exists public.certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  certificate_code text unique not null,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique(user_id, course_id)
);

-- 15. Role helper
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid()
      and role = 'admin'
      and status = 'active'
  );
$$;

-- 16. Enable RLS
alter table public.profiles enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.orders enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.lesson_notes enable row level security;
alter table public.lesson_questions enable row level security;
alter table public.notifications enable row level security;
alter table public.notification_reads enable row level security;
alter table public.support_tickets enable row level security;
alter table public.course_reviews enable row level security;
alter table public.schedules enable row level security;
alter table public.certificates enable row level security;

-- 17. RLS policies
-- Profiles
create policy "Users can view their own profile" on public.profiles
for select using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id and role = (select role from public.profiles where id = auth.uid()));

create policy "Admins can manage profiles" on public.profiles
for all using (public.is_admin()) with check (public.is_admin());

-- Courses
create policy "Published courses are public" on public.courses
for select using (status = 'published' or public.is_admin());

create policy "Admins can manage courses" on public.courses
for all using (public.is_admin()) with check (public.is_admin());

-- Lessons
create policy "Preview lessons are public" on public.lessons
for select using (
  is_preview = true
  or public.is_admin()
  or exists (
    select 1 from public.enrollments e
    where e.user_id = auth.uid()
      and e.course_id = lessons.course_id
      and e.status = 'active'
  )
);

create policy "Admins can manage lessons" on public.lessons
for all using (public.is_admin()) with check (public.is_admin());

-- Orders
create policy "Users can view own orders" on public.orders
for select using (auth.uid() = user_id or public.is_admin());

create policy "Users can create own pending orders" on public.orders
for insert with check (auth.uid() = user_id and status = 'pending');

create policy "Admins can manage orders" on public.orders
for all using (public.is_admin()) with check (public.is_admin());

-- Enrollments
create policy "Users can view own enrollments" on public.enrollments
for select using (auth.uid() = user_id or public.is_admin());

create policy "Admins can manage enrollments" on public.enrollments
for all using (public.is_admin()) with check (public.is_admin());

-- Progress
create policy "Users can manage own progress" on public.lesson_progress
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Admins can view all progress" on public.lesson_progress
for select using (public.is_admin());

-- Notes
create policy "Users can manage own notes" on public.lesson_notes
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Questions
create policy "Users can create own questions" on public.lesson_questions
for insert with check (auth.uid() = user_id);

create policy "Users can view own questions" on public.lesson_questions
for select using (auth.uid() = user_id or public.is_admin());

create policy "Admins can manage questions" on public.lesson_questions
for all using (public.is_admin()) with check (public.is_admin());

-- Notifications
create policy "Users can view notifications" on public.notifications
for select using (
  audience = 'all'
  or audience = 'student'
  or public.is_admin()
);

create policy "Admins can manage notifications" on public.notifications
for all using (public.is_admin()) with check (public.is_admin());

create policy "Users can manage own notification reads" on public.notification_reads
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Support tickets
create policy "Users can create own tickets" on public.support_tickets
for insert with check (auth.uid() = user_id);

create policy "Users can view own tickets" on public.support_tickets
for select using (auth.uid() = user_id or public.is_admin());

create policy "Admins can manage tickets" on public.support_tickets
for all using (public.is_admin()) with check (public.is_admin());

-- Reviews
create policy "Visible reviews are public" on public.course_reviews
for select using (status = 'visible' or auth.uid() = user_id or public.is_admin());

create policy "Users can create own reviews" on public.course_reviews
for insert with check (auth.uid() = user_id);

create policy "Users can update own reviews" on public.course_reviews
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Admins can manage reviews" on public.course_reviews
for all using (public.is_admin()) with check (public.is_admin());

-- Schedules
create policy "Schedules are visible" on public.schedules
for select using (true);

create policy "Admins can manage schedules" on public.schedules
for all using (public.is_admin()) with check (public.is_admin());

-- Certificates
create policy "Users can view own certificates" on public.certificates
for select using (auth.uid() = user_id or public.is_admin());

create policy "Admins can manage certificates" on public.certificates
for all using (public.is_admin()) with check (public.is_admin());
