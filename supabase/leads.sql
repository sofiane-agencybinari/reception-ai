-- Trial leads from the marketing landing form (#essai)
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  restaurant_name text not null,
  city text not null,
  phone text not null,
  email text not null,
  cuisine_type text not null check (cuisine_type in ('kebab', 'pizza', 'burger', 'grill', 'autre')),
  message text,
  source text not null default 'marketing_trial',
  created_at timestamptz not null default now()
);

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_email_idx on leads (email);
