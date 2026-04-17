insert into storage.buckets (id, name, public)
values ('naborly-uploads', 'naborly-uploads', true)
on conflict (id) do nothing;

drop policy if exists "public read uploads" on storage.objects;
create policy "public read uploads" on storage.objects for select using (bucket_id = 'naborly-uploads');

drop policy if exists "auth upload own files" on storage.objects;
create policy "auth upload own files" on storage.objects for insert to authenticated with check (bucket_id = 'naborly-uploads');

drop policy if exists "auth update own files" on storage.objects;
create policy "auth update own files" on storage.objects for update to authenticated using (bucket_id = 'naborly-uploads');

drop policy if exists "auth delete own files" on storage.objects;
create policy "auth delete own files" on storage.objects for delete to authenticated using (bucket_id = 'naborly-uploads');
