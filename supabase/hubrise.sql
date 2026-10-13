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
