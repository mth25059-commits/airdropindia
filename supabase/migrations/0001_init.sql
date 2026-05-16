-- AirdropIndia + CryptoTaxIndia schema
-- Run this in Supabase SQL Editor (or via supabase db push if you use the CLI).
-- Order matters: tables -> indexes -> RLS -> policies.

-- ============================================================================
-- 1. Airdrops
-- ============================================================================
create table if not exists public.airdrops (
  id                   uuid primary key default gen_random_uuid(),
  slug                 text not null unique,
  name                 text not null,
  chain                text not null,
  description          text,
  estimated_value_usd  numeric,
  estimated_value_inr  numeric,
  deadline             timestamptz,
  difficulty           text check (difficulty in ('easy','medium','hard')),
  status               text not null default 'active'
                       check (status in ('active','upcoming','ended')),
  logo_url             text,
  official_url         text,
  steps                jsonb not null default '[]'::jsonb,
  tags                 text[] not null default '{}',
  ai_generated_guide   boolean not null default false,
  views                integer not null default 0,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);
create index if not exists airdrops_chain_idx     on public.airdrops (chain);
create index if not exists airdrops_status_idx    on public.airdrops (status);
create index if not exists airdrops_deadline_idx  on public.airdrops (deadline);
create index if not exists airdrops_created_idx   on public.airdrops (created_at desc);

-- ============================================================================
-- 2. Subscribers (email list for airdrop alerts)
-- ============================================================================
create table if not exists public.subscribers (
  id                 uuid primary key default gen_random_uuid(),
  email              text not null unique,
  chains             text[] not null default '{}',
  confirmed          boolean not null default false,
  confirm_token      text unique,
  unsubscribe_token  text not null unique default replace(gen_random_uuid()::text,'-',''),
  created_at         timestamptz not null default now(),
  confirmed_at       timestamptz
);
create index if not exists subscribers_email_idx on public.subscribers (lower(email));

-- ============================================================================
-- 3. Tax calculations (per-user)
-- ============================================================================
create table if not exists public.tax_calculations (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  asset_name    text,
  buy_price     numeric not null,
  sell_price    numeric not null,
  quantity      numeric not null,
  buy_date      date not null,
  sell_date     date not null,
  total_buy     numeric not null,
  total_sell    numeric not null,
  profit_loss   numeric not null,
  taxable_gain  numeric not null,
  base_tax      numeric not null,
  cess          numeric not null,
  total_tax     numeric not null,
  tds           numeric not null,
  created_at    timestamptz not null default now()
);
create index if not exists tax_calc_user_created_idx
  on public.tax_calculations (user_id, created_at desc);

-- ============================================================================
-- 4. Blog posts
-- ============================================================================
create table if not exists public.blog_posts (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  title               text not null,
  excerpt             text,
  content             text,
  cover_image         text,
  category            text,
  tags                text[] not null default '{}',
  related_airdrop_id  uuid references public.airdrops(id) on delete set null,
  ai_generated        boolean not null default false,
  published           boolean not null default false,
  views               integer not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists blog_posts_published_idx
  on public.blog_posts (published, created_at desc);

-- ============================================================================
-- 5. updated_at triggers
-- ============================================================================
create or replace function public.touch_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists airdrops_touch on public.airdrops;
create trigger airdrops_touch before update on public.airdrops
  for each row execute function public.touch_updated_at();

drop trigger if exists blog_posts_touch on public.blog_posts;
create trigger blog_posts_touch before update on public.blog_posts
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- 6. Row Level Security
-- ============================================================================
alter table public.airdrops          enable row level security;
alter table public.subscribers       enable row level security;
alter table public.tax_calculations  enable row level security;
alter table public.blog_posts        enable row level security;

-- AIRDROPS: public read, no public writes (admin writes via service-role key).
drop policy if exists "airdrops read" on public.airdrops;
create policy "airdrops read"
  on public.airdrops for select
  to anon, authenticated
  using (true);

-- SUBSCRIBERS: writes/reads handled by service-role only.
-- No public policies = nobody but service role can touch the table.

-- TAX CALCULATIONS: each user sees & writes only their own.
drop policy if exists "tax own select" on public.tax_calculations;
create policy "tax own select"
  on public.tax_calculations for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "tax own insert" on public.tax_calculations;
create policy "tax own insert"
  on public.tax_calculations for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "tax own delete" on public.tax_calculations;
create policy "tax own delete"
  on public.tax_calculations for delete
  to authenticated
  using (auth.uid() = user_id);

-- BLOG POSTS: only published rows are public.
drop policy if exists "blog public read published" on public.blog_posts;
create policy "blog public read published"
  on public.blog_posts for select
  to anon, authenticated
  using (published = true);
