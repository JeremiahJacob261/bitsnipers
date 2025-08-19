-- Supabase SQL schema for BitSnipers auth/profile with prefix bitsnips_
-- Run this in Supabase SQL editor

create table if not exists public.bitsnips_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure helper exists
create or replace function public.set_current_timestamp_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Update timestamp trigger
drop trigger if exists bitsnips_profiles_updated_at on public.bitsnips_profiles;
create trigger bitsnips_profiles_updated_at
before update on public.bitsnips_profiles
for each row execute procedure public.set_current_timestamp_updated_at();

-- Auto-create profile on user signup
create or replace function public.bitsnips_handle_new_user()
returns trigger as $$
begin
  insert into public.bitsnips_profiles (id, username, display_name, avatar_url)
  values (new.id, split_part(new.email, '@', 1), split_part(new.email, '@', 1), null)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists bitsnips_on_auth_user_created on auth.users;
create trigger bitsnips_on_auth_user_created
after insert on auth.users
for each row execute procedure public.bitsnips_handle_new_user();

-- Friends table (simple follow relationship)
create table if not exists public.bitsnips_friends (
  user_id uuid references auth.users(id) on delete cascade,
  friend_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, friend_id)
);

-- Winnings history
create table if not exists public.bitsnips_winnings (
  id bigserial primary key,
  user_id uuid references auth.users(id) on delete cascade,
  usd_cents bigint not null default 0,
  sol_lamports bigint not null default 0,
  note text,
  created_at timestamptz default now()
);

-- Simple leaderboard materialized view (can be replaced by realtime aggregations)
create materialized view if not exists public.bitsnips_leaderboard as
select
  u.id as user_id,
  coalesce(p.username, u.email) as name,
  sum(w.usd_cents) / 100.0 as total_usd,
  sum(w.sol_lamports) / 1000000000.0 as total_sol
from auth.users u
left join public.bitsnips_profiles p on p.id = u.id
left join public.bitsnips_winnings w on w.user_id = u.id
group by u.id, p.username, u.email;

-- Allow anon to read leaderboard
grant select on public.bitsnips_leaderboard to anon, authenticated;

-- RLS policies
alter table public.bitsnips_profiles enable row level security;
create policy "own profile" on public.bitsnips_profiles for select using (auth.uid() = id);
create policy "update own profile" on public.bitsnips_profiles for update using (auth.uid() = id);
create policy "insert own profile" on public.bitsnips_profiles for insert with check (auth.uid() = id);

alter table public.bitsnips_friends enable row level security;
create policy "own friends" on public.bitsnips_friends for select using (auth.uid() = user_id);
create policy "manage own friends" on public.bitsnips_friends for insert with check (auth.uid() = user_id);
create policy "delete own friends" on public.bitsnips_friends for delete using (auth.uid() = user_id);

alter table public.bitsnips_winnings enable row level security;
create policy "own winnings" on public.bitsnips_winnings for select using (auth.uid() = user_id);
create policy "insert own winnings" on public.bitsnips_winnings for insert with check (auth.uid() = user_id);
