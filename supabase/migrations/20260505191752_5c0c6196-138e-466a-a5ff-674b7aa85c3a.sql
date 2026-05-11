
-- ROLES
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role app_role not null default 'user',
  created_at timestamptz not null default now(),
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "users view own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(), 'admin'));
create policy "admins manage roles" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));

-- CARS
create table public.cars (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model text not null,
  version text,
  year int not null,
  mileage_km int not null default 0,
  price_eur numeric(12,2) not null,
  fuel text not null,
  transmission text not null,
  body_type text,
  power_hp int,
  displacement_cc int,
  color text,
  doors int,
  seats int,
  condition text not null default 'usata',
  previous_owners int default 1,
  has_inspection boolean default false,
  inspection_notes text,
  has_documents boolean default true,
  description text,
  location text,
  vin text,
  registration_date date,
  status text not null default 'draft',
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.cars enable row level security;

create policy "public view published cars" on public.cars for select using (status = 'published');
create policy "admins view all cars" on public.cars for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins insert cars" on public.cars for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
create policy "admins update cars" on public.cars for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete cars" on public.cars for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger trg_cars_updated before update on public.cars for each row execute function public.set_updated_at();

-- CAR IMAGES
create table public.car_images (
  id uuid primary key default gen_random_uuid(),
  car_id uuid not null references public.cars(id) on delete cascade,
  url text not null,
  storage_path text,
  position int not null default 0,
  is_cover boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.car_images enable row level security;
create index on public.car_images(car_id);

create policy "public view images of published cars" on public.car_images for select
  using (exists (select 1 from public.cars c where c.id = car_id and c.status='published'));
create policy "admins manage images" on public.car_images for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- LISTING REQUESTS (richieste pubbliche di vendita)
create table public.listing_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  phone text not null,
  city text,
  brand text not null,
  model text not null,
  version text,
  year int not null,
  mileage_km int not null,
  fuel text not null,
  transmission text not null,
  power_hp int,
  displacement_cc int,
  color text,
  condition text not null,
  previous_owners int,
  has_inspection boolean default false,
  has_documents boolean default true,
  asking_price_eur numeric(12,2),
  description text,
  image_urls text[] default '{}',
  status text not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now()
);
alter table public.listing_requests enable row level security;

create policy "anyone submit request" on public.listing_requests for insert to anon, authenticated with check (true);
create policy "admins view requests" on public.listing_requests for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins update requests" on public.listing_requests for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins delete requests" on public.listing_requests for delete to authenticated using (public.has_role(auth.uid(),'admin'));

-- STORAGE bucket
insert into storage.buckets (id, name, public) values ('cars', 'cars', true) on conflict (id) do nothing;

create policy "public read cars bucket" on storage.objects for select using (bucket_id = 'cars');
create policy "admins upload cars bucket" on storage.objects for insert to authenticated
  with check (bucket_id='cars' and public.has_role(auth.uid(),'admin'));
create policy "admins update cars bucket" on storage.objects for update to authenticated
  using (bucket_id='cars' and public.has_role(auth.uid(),'admin'));
create policy "admins delete cars bucket" on storage.objects for delete to authenticated
  using (bucket_id='cars' and public.has_role(auth.uid(),'admin'));

-- Bucket per upload pubblico richieste
insert into storage.buckets (id, name, public) values ('listing-uploads', 'listing-uploads', true) on conflict (id) do nothing;
create policy "public upload listing-uploads" on storage.objects for insert to anon, authenticated
  with check (bucket_id='listing-uploads');
create policy "public read listing-uploads" on storage.objects for select using (bucket_id='listing-uploads');
create policy "admins delete listing-uploads" on storage.objects for delete to authenticated
  using (bucket_id='listing-uploads' and public.has_role(auth.uid(),'admin'));
