-- EduVideo Cloudflare R2 video patch
-- Run this after supabase/schema.sql.

alter table public.lessons
  add column if not exists video_mime_type text,
  add column if not exists video_size_bytes bigint,
  add column if not exists video_uploaded_at timestamptz,
  add column if not exists video_status text not null default 'empty' check (video_status in ('empty', 'uploaded', 'processing', 'ready', 'failed'));

create index if not exists lessons_video_asset_id_idx on public.lessons(video_asset_id);

-- Optional helper view for admin dashboard.
create or replace view public.admin_lesson_video_status as
select
  l.id as lesson_id,
  l.course_id,
  c.title as course_title,
  l.title as lesson_title,
  l.video_provider,
  l.video_asset_id,
  l.video_status,
  l.video_mime_type,
  l.video_size_bytes,
  l.video_uploaded_at,
  l.updated_at
from public.lessons l
join public.courses c on c.id = l.course_id;

-- This view is still protected by table policies when queried through Supabase client.
