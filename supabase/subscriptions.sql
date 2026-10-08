-- Abonnements payés via Stripe (alimentée par le webhook /api/stripe/webhook).
create table if not exists subscriptions (
  id bigint generated always as identity primary key,
  stripe_subscription_id text unique not null,
  stripe_customer_id text not null,
  plan text,
  status text not null,
  restaurant_name text,
  email text,
  phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists subscriptions_customer_idx on subscriptions (stripe_customer_id);

-- Accès réservé au serveur (clé service role).
alter table subscriptions enable row level security;
