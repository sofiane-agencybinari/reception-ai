-- TOUT EN UN : à coller en entier dans Supabase → SQL Editor → Run. Relançable sans risque.

-- ===== billing.sql =====
-- Facturation des minutes d'appel (voir /api/webhooks/elevenlabs/post-call et scripts/link-restaurant-billing.mjs).

-- Chaque restaurant client est relié à son agent ElevenLabs et à son client Stripe.
alter table restaurants add column if not exists elevenlabs_agent_id text unique;
alter table restaurants add column if not exists stripe_customer_id text;

-- Un enregistrement par appel facturé : évite de déclarer deux fois le même appel et garde une trace.
create table if not exists billed_calls (
  conversation_id text primary key,
  restaurant_id uuid references restaurants(id) on delete set null,
  agent_id text not null,
  stripe_customer_id text not null,
  duration_secs integer not null,
  minutes integer not null,
  started_at timestamptz,
  reported_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists billed_calls_restaurant_idx on billed_calls (restaurant_id, created_at);

-- Accès réservé au serveur (clé service role).
alter table billed_calls enable row level security;

-- ===== customer-profiles.sql =====
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

-- ===== hubrise.sql =====
-- Connexion des restaurants à leur caisse via HubRise (voir src/lib/hubrise.ts et scripts/connect-hubrise.mjs).
-- Jetons d'accès : table séparée, lisible uniquement par le serveur.
create table if not exists restaurant_integrations (
  restaurant_id uuid primary key references restaurants(id) on delete cascade,
  hubrise_location_id text,
  hubrise_access_token text,
  updated_at timestamptz not null default now()
);
alter table restaurant_integrations enable row level security;

-- Référence de la commande côté HubRise (envoyée en caisse).
alter table orders add column if not exists hubrise_order_id text;

-- ===== security.sql =====
-- Verrouillage de la base : à exécuter une fois (Supabase → SQL Editor → Run). Relançable sans risque.
-- Le site n'accède à la base qu'avec la clé serveur (service role), qui ignore ces règles : rien ne casse.
-- Sans règle d'accès, la clé publique (anon) ne peut plus lire ni modifier aucune de ces tables.
alter table if exists restaurants enable row level security;
alter table if exists menu_items enable row level security;
alter table if exists orders enable row level security;
alter table if exists order_items enable row level security;
alter table if exists call_logs enable row level security;
alter table if exists leads enable row level security;
alter table if exists subscriptions enable row level security;
alter table if exists demo_sessions enable row level security;
alter table if exists billed_calls enable row level security;
alter table if exists customer_profiles enable row level security;
alter table if exists restaurant_integrations enable row level security;

