-- Formulaires d'installation remplis par les nouveaux abonnés (/installation). Accès serveur uniquement.
create table if not exists installations (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text unique not null,
  plan text,
  restaurant_name text not null,
  contact_email text,
  data jsonb not null,
  created_at timestamptz not null default now()
);
alter table installations enable row level security;
