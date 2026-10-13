-- Fiches clients complétées par les clients finaux via le lien du SMS de confirmation (/infos/<commande>).
-- Une fiche par restaurant et par numéro de téléphone.
create table if not exists customer_profiles (
  id bigint generated always as identity primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  phone text not null,
  first_name text,
  last_name text,
  email text,
  birthday date,
  marketing_consent boolean not null default false,
  consent_at timestamptz,
  source_order_id uuid references orders(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, phone)
);

-- Accès réservé au serveur (clé service role).
alter table customer_profiles enable row level security;
