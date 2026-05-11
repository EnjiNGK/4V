
UPDATE public.car_images SET url = 'https://bqnitaoqrjrzdnnwjcrb.supabase.co/storage/v1/object/public/cars/bugatti-35b.jpg' WHERE car_id = (SELECT id FROM public.cars WHERE brand='Bugatti');
UPDATE public.car_images SET url = 'https://bqnitaoqrjrzdnnwjcrb.supabase.co/storage/v1/object/public/cars/bentley-blower.jpg' WHERE car_id = (SELECT id FROM public.cars WHERE brand='Bentley');
UPDATE public.car_images SET url = 'https://bqnitaoqrjrzdnnwjcrb.supabase.co/storage/v1/object/public/cars/alfa-6c.jpg' WHERE car_id = (SELECT id FROM public.cars WHERE brand='Alfa Romeo');
UPDATE public.car_images SET url = 'https://bqnitaoqrjrzdnnwjcrb.supabase.co/storage/v1/object/public/cars/mb-540k.jpg' WHERE car_id = (SELECT id FROM public.cars WHERE brand='Mercedes-Benz' AND model='540 K');
UPDATE public.car_images SET url = 'https://bqnitaoqrjrzdnnwjcrb.supabase.co/storage/v1/object/public/cars/jaguar-xk120.jpg' WHERE car_id = (SELECT id FROM public.cars WHERE brand='Jaguar');
UPDATE public.car_images SET url = 'https://bqnitaoqrjrzdnnwjcrb.supabase.co/storage/v1/object/public/cars/mb-300sl.jpg' WHERE car_id = (SELECT id FROM public.cars WHERE brand='Mercedes-Benz' AND model='300 SL');
