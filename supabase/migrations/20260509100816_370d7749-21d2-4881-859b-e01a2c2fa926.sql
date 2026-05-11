
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS brochure_url text;
ALTER TABLE public.cars ADD COLUMN IF NOT EXISTS matching_numbers boolean DEFAULT false;
ALTER TABLE public.listing_requests ADD COLUMN IF NOT EXISTS has_brochure boolean DEFAULT false;
ALTER TABLE public.listing_requests ADD COLUMN IF NOT EXISTS brochure_notes text;
