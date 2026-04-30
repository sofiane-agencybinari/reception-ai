insert into restaurants (id, name, phone, address)
values (
  '11111111-1111-1111-1111-111111111111',
  'Restaurant Pilote',
  '+33100000000',
  'Paris'
)
on conflict (id) do update
set
  name = excluded.name,
  phone = excluded.phone,
  address = excluded.address;

insert into menu_items (restaurant_id, name, price, is_available)
values
  ('11111111-1111-1111-1111-111111111111', 'Burger Classique', 8.90, true),
  ('11111111-1111-1111-1111-111111111111', 'Frites', 3.50, true),
  ('11111111-1111-1111-1111-111111111111', 'Boisson', 2.50, true)
on conflict do nothing;
