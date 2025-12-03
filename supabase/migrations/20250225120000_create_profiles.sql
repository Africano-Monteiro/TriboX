/*
  # Setup Profiles and Auth Triggers

  ## Query Description:
  This migration creates the public.profiles table and sets up a trigger to automatically create a profile entry whenever a new user signs up via Supabase Auth. This ensures we have a place to store application-specific user data (like XP, coins, etc.) linked to the auth user.

  ## Metadata:
  - Schema-Category: "Structural"
  - Impact-Level: "High"
  - Requires-Backup: false
  - Reversible: true

  ## Structure Details:
  - Table: public.profiles
    - id (UUID, PK, FK to auth.users)
    - email (Text)
    - name (Text)
    - handle (Text)
    - avatar_url (Text)
    - xp (Integer)
    - level (Text)
    - coins (Integer)
    - is_premium (Boolean)
    - created_at (Timestamp)
  - Trigger: on_auth_user_created
  - Function: public.handle_new_user()

  ## Security Implications:
  - RLS Enabled on profiles table.
  - Policies created for Select, Insert, and Update.
*/

-- Create profiles table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text,
  name text,
  handle text,
  avatar_url text,
  xp integer default 0,
  level text default 'Bronze',
  coins integer default 0,
  is_premium boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, handle, avatar_url)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'name', 
    '@' || lower(regexp_replace(new.raw_user_meta_data->>'name', '\s+', '', 'g')),
    'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
