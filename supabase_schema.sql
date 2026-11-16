-- ========================================================
-- Supabase Schema for Guidance Office & Scholarship System
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. ACADEMIC YEARS
create table if not exists public.academic_years (
  id text primary key,
  year text not null,
  overall_status text default 'Active',
  first_semester text default 'Active',
  second_semester text default 'Inactive',
  label text,
  updated_at timestamptz default now()
);

-- 2. COURSES
create table if not exists public.courses (
  id text primary key,
  code text not null,
  name text not null,
  department text,
  status text default 'Active'
);

-- 3. SECTIONS
create table if not exists public.sections (
  id text primary key,
  name text not null,
  course text,
  status text default 'Active'
);

-- 4. SCHOLARSHIPS
create table if not exists public.scholarships (
  id text primary key,
  name text not null,
  type text not null,
  category text not null,
  status text default 'Active',
  description text,
  requirements jsonb default '[]'::jsonb,
  slots integer default 0,
  deadline text
);

-- 5. SUBMISSIONS
create table if not exists public.submissions (
  id text primary key,
  student_id text not null,
  student_name text not null,
  student_auth_id text,
  scholarship_type text,
  status text default 'Pending',
  submitted_at timestamptz default now(),
  data jsonb default '{}'::jsonb,
  files jsonb default '[]'::jsonb
);

-- Enable Row Level Security (RLS)
alter table public.academic_years enable row level security;
alter table public.courses enable row level security;
alter table public.sections enable row level security;
alter table public.scholarships enable row level security;
alter table public.submissions enable row level security;

-- Policies allowing public client access (adjust as needed for authenticated roles)
drop policy if exists "Public read academic_years" on public.academic_years;
create policy "Public read academic_years" on public.academic_years for select using (true);
drop policy if exists "Public write academic_years" on public.academic_years;
create policy "Public write academic_years" on public.academic_years for all using (true);

drop policy if exists "Public read courses" on public.courses;
create policy "Public read courses" on public.courses for select using (true);
drop policy if exists "Public write courses" on public.courses;
create policy "Public write courses" on public.courses for all using (true);

drop policy if exists "Public read sections" on public.sections;
create policy "Public read sections" on public.sections for select using (true);
drop policy if exists "Public write sections" on public.sections;
create policy "Public write sections" on public.sections for all using (true);

drop policy if exists "Public read scholarships" on public.scholarships;
create policy "Public read scholarships" on public.scholarships for select using (true);
drop policy if exists "Public write scholarships" on public.scholarships;
create policy "Public write scholarships" on public.scholarships for all using (true);

drop policy if exists "Public read submissions" on public.submissions;
create policy "Public read submissions" on public.submissions for select using (true);
drop policy if exists "Public write submissions" on public.submissions;
create policy "Public write submissions" on public.submissions for all using (true);

-- Enable Storage Bucket for Student Documents
insert into storage.buckets (id, name, public)
values ('scholarship-documents', 'scholarship-documents', true)
on conflict (id) do nothing;

drop policy if exists "Public storage select" on storage.objects;
create policy "Public storage select" on storage.objects for select using (bucket_id = 'scholarship-documents');

drop policy if exists "Public storage insert" on storage.objects;
create policy "Public storage insert" on storage.objects for insert with check (bucket_id = 'scholarship-documents');

drop policy if exists "Public storage update" on storage.objects;
create policy "Public storage update" on storage.objects for update using (bucket_id = 'scholarship-documents');

drop policy if exists "Public storage delete" on storage.objects;
create policy "Public storage delete" on storage.objects for delete using (bucket_id = 'scholarship-documents');
