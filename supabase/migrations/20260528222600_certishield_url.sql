-- Add CertiShield (KNOBS) blockchain Digital Vehicle Passport URL per car.
ALTER TABLE public.cars
  ADD COLUMN IF NOT EXISTS certishield_url text;
