REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM authenticated;

UPDATE storage.buckets
SET public = false
WHERE id = 'listing-uploads';

DROP POLICY IF EXISTS "public read listing-uploads" ON storage.objects;
DROP POLICY IF EXISTS "admins delete listing-uploads" ON storage.objects;
CREATE POLICY "admins read listing-uploads"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'listing-uploads' AND public.has_role(auth.uid(),'admin'));

CREATE POLICY "admins delete listing-uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id='listing-uploads' AND public.has_role(auth.uid(),'admin'));

DROP POLICY IF EXISTS "public view published cars" ON public.cars;
CREATE POLICY "public view published cars"
ON public.cars
FOR SELECT
TO public
USING (status = 'published');

CREATE OR REPLACE VIEW public.public_cars AS
SELECT
  id,
  price_eur,
  fuel,
  transmission,
  body_type,
  power_hp,
  displacement_cc,
  color,
  doors,
  seats,
  condition,
  previous_owners,
  has_inspection,
  inspection_notes,
  has_documents,
  description,
  location,
  registration_date,
  status,
  featured,
  matching_numbers,
  brochure_url,
  created_at,
  updated_at,
  brand,
  model,
  version,
  year,
  mileage_km
FROM public.cars
WHERE status = 'published';