insert into public.posts (title, type, price, loc, parish, qty_total, qty_left, desc, vendor, whatsapp, free, tracking, highlight)
values
('Fresh Fruit Bags', 'Food', 'JMD $700', 'Kingston • Near St. Bess Pharmacy', 'Kingston', 10, 8, 'Fresh banana, orange, pineapple, and mango bags available for same-day pickup.', 'Marcia Produce', '18765551001', false, 'Ready for pickup', 'Pickup today'),
('Restaurant Meal Donations', 'Free Support', 'Free', 'Kingston • Half Way Tree', 'Kingston', 20, 12, 'Prepared meals available while supplies last. First come, first served.', 'Island Kitchen', '18765551002', true, 'On the way', 'Donation pickup')
on conflict do nothing;
insert into public.events (title, loc, date_text, host, whatsapp, desc, price, featured)
values
('Kingston Night Market', 'Kingston', 'Tonight 7:00 PM', 'City Events', '18765552000', 'Food, music, shopping, and family fun.', 'JMD 1500', true),
('Community Food Drive', 'Kingston', 'Sat 2:00 PM', 'Nabor Volunteers', '18765552001', 'Free groceries and family support.', 'Free', false)
on conflict do nothing;
