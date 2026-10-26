-- Portfolio CMS: editable page content, blog posts, image storage.
--
-- Everyone can read published content. Only emails listed in `admins` can
-- write — and since Supabase requires email confirmation, only the owner of
-- that inbox can ever get a session carrying that email.

create table public.admins (
  email text primary key
);

alter table public.admins enable row level security;
-- No policies: the table is only readable through is_admin() below.

insert into public.admins (email) values ('vishwajeet.inn@gmail.com');

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins a
    where a.email = (select auth.jwt() ->> 'email')
  );
$$;

-- One row per page section ('site', 'about', 'skills', ...), value is JSON.
create table public.site_content (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

create policy "content is public" on public.site_content
  for select to anon, authenticated using (true);
create policy "admin inserts content" on public.site_content
  for insert to authenticated with check ((select public.is_admin()));
create policy "admin updates content" on public.site_content
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin deletes content" on public.site_content
  for delete to authenticated using ((select public.is_admin()));

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  excerpt text not null default '',
  cover_url text,
  content text not null default '',
  tags text[] not null default '{}',
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index posts_published_idx on public.posts (published, published_at desc);

alter table public.posts enable row level security;

create policy "published posts are public" on public.posts
  for select to anon, authenticated using (published or (select public.is_admin()));
create policy "admin inserts posts" on public.posts
  for insert to authenticated with check ((select public.is_admin()));
create policy "admin updates posts" on public.posts
  for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "admin deletes posts" on public.posts
  for delete to authenticated using ((select public.is_admin()));

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_content_touch before update on public.site_content
  for each row execute function public.touch_updated_at();
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

-- Public bucket for project screenshots, portrait and blog covers.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio', 'portfolio', true, 5242880,
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml', 'application/pdf']
);

create policy "admin uploads files" on storage.objects
  for insert to authenticated with check (bucket_id = 'portfolio' and (select public.is_admin()));
create policy "admin updates files" on storage.objects
  for update to authenticated using (bucket_id = 'portfolio' and (select public.is_admin()));
create policy "admin deletes files" on storage.objects
  for delete to authenticated using (bucket_id = 'portfolio' and (select public.is_admin()));
