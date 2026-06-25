-- Supabase SQL Editor'da calistirin.
-- Auth > Providers > Email bolumunden e-posta ile giris acik olmali.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique not null,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Kullanicilar kendi profilini okuyabilir" on public.profiles;
drop policy if exists "Kullanicilar kendi profilini guncelleyebilir" on public.profiles;
drop policy if exists "Kullanicilar kendi profilini olusturabilir" on public.profiles;

create policy "Kullanicilar kendi profilini okuyabilir"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Kullanicilar kendi profilini guncelleyebilir"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Kullanicilar kendi profilini olusturabilir"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, username, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
