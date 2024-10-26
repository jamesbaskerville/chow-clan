create table public.profiles (
  user_id uuid not null references auth.users on delete cascade,
  full_name text,
  email text,
  birth_date date,
  death_date date,

  primary key (user_id)
);

alter table public.profiles enable row level security;