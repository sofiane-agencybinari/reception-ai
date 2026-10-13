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
