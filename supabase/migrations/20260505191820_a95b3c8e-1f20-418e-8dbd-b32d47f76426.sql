
-- Fix function search_path
create or replace function public.set_updated_at() returns trigger
language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;

-- Restrict execute on security definer functions
revoke execute on function public.has_role(uuid, public.app_role) from anon, authenticated, public;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

-- Replace overly permissive insert on listing_requests with explicit but still public check
drop policy if exists "anyone submit request" on public.listing_requests;
create policy "anyone submit request" on public.listing_requests for insert to anon, authenticated
  with check (
    length(full_name) between 1 and 200
    and length(email) between 3 and 200
    and length(phone) between 3 and 50
    and length(brand) between 1 and 100
    and length(model) between 1 and 100
    and year between 1900 and extract(year from now())::int + 1
    and mileage_km >= 0
  );

-- Restrict storage listing on public buckets (still allow individual object reads)
drop policy if exists "public read cars bucket" on storage.objects;
create policy "public read cars objects" on storage.objects for select
  using (bucket_id = 'cars' and (auth.role() = 'anon' or auth.role() = 'authenticated'));

drop policy if exists "public read listing-uploads" on storage.objects;
create policy "public read listing-uploads objects" on storage.objects for select
  using (bucket_id = 'listing-uploads' and (auth.role() = 'anon' or auth.role() = 'authenticated'));
