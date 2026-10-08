-- Sessions de la démo vocale du site (limite d'essais par visiteur).
-- L'adresse IP n'est jamais stockée : seulement une empreinte salée (ip_hash).
create table if not exists demo_sessions (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  mode text not null check (mode in ('voice', 'text')),
  created_at timestamptz not null default now()
);

create index if not exists demo_sessions_ip_created_idx on demo_sessions (ip_hash, created_at desc);
create index if not exists demo_sessions_created_idx on demo_sessions (created_at desc);

-- Accès réservé au serveur (clé service role) : aucune policy publique.
alter table demo_sessions enable row level security;
