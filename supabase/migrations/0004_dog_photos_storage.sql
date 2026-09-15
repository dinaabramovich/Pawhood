-- Dog photos, stored at "<owner_id>/<dog_id>/<filename>" so ownership can
-- be checked from the path alone, same pattern as avatars.
insert into storage.buckets (id, name, public)
values ('dog-photos', 'dog-photos', true)
on conflict (id) do nothing;

create policy "Dog photos are publicly readable"
  on storage.objects
  for select
  to public
  using (bucket_id = 'dog-photos');

create policy "Owners can upload their dogs' photos"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'dog-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owners can update their dogs' photos"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'dog-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Owners can delete their dogs' photos"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'dog-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
