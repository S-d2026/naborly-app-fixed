create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  whatsapp text,
  market text default 'JA',
  parish text,
  created_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  type text not null,
  price text not null,
  loc text not null,
  parish text,
  qty_total integer default 0,
  qty_left integer default 0,
  description text,
  vendor text,
  whatsapp text,
  free boolean default false,
  tracking text default 'Reserved',
  highlight text,
  image_url text,
  promoted boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  title text not null,
  loc text not null,
  date_text text,
  host text,
  whatsapp text,
  description text,
  price text,
  featured boolean default false,
  promoted boolean default false,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('post','event')),
  item_id text not null,
  created_at timestamptz not null default now()
);
