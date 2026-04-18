insert into storage.buckets (id, name, public)
values ('naborly-uploads', 'naborly-uploads', true)
on conflict (id) do nothing;
