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
