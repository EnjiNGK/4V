GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;

UPDATE storage.buckets
SET public = true
WHERE id = 'listing-uploads';

DROP POLICY IF EXISTS "admins read listing-uploads" ON storage.objects;
DROP POLICY IF EXISTS "admins delete listing-uploads" ON storage.objects;

CREATE POLICY "public read listing-uploads"
ON storage.objects
FOR SELECT
USING (bucket_id = 'listing-uploads');

CREATE POLICY "admins delete listing-uploads"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id='listing-uploads' AND public.has_role(auth.uid(),'admin'));