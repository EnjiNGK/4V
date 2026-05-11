
-- Replace catalog with truly vintage / pre-war historic cars
DELETE FROM public.car_images;
DELETE FROM public.cars;

WITH inserted AS (
  INSERT INTO public.cars (brand, model, version, year, mileage_km, price_eur, fuel, transmission, body_type, power_hp, displacement_cc, doors, seats, condition, previous_owners, has_inspection, has_documents, description, location, color, status, featured)
  VALUES
    ('Bugatti', 'Type 35B', 'Grand Prix Compressore', 1928, 12000, 4500000, 'Benzina', 'Manuale', 'Biposto Corsa', 138, 2262, 0, 2, 'restaurata', 4, true, true, 'Vettura da Grand Prix con compressore Roots. Documentazione FIVA, storia sportiva tracciata. CRS rilasciato.', 'Milano', 'Bleu de France', 'published', true),
    ('Bentley', '4½ Litre', 'Blower Supercharged Tourer', 1930, 35000, 3200000, 'Benzina', 'Manuale', 'Tourer', 175, 4398, 4, 4, 'restaurata', 5, true, true, 'Iconica Blower Bentley con compressore Amherst Villiers. Carrozzeria Vanden Plas. Targa ORO ASI.', 'Milano', 'British Racing Green', 'published', true),
    ('Alfa Romeo', '6C 1750', 'Gran Sport Zagato', 1931, 48000, 2100000, 'Benzina', 'Manuale', 'Spider Corsa', 85, 1752, 2, 2, 'restaurata', 6, true, true, 'Carrozzeria Zagato originale. Mille Miglia eligible. Perizia Volontè con valutazione completa.', 'Milano', 'Rosso Alfa', 'published', true),
    ('Mercedes-Benz', '540 K', 'Special Roadster', 1937, 28000, 6800000, 'Benzina', 'Manuale', 'Roadster', 180, 5401, 2, 2, 'conservata', 3, true, true, 'Special Roadster con compressore. Uno dei pochi esemplari sopravvissuti. Pebble Beach class winner.', 'Milano', 'Nero', 'published', true),
    ('Jaguar', 'XK120', 'Roadster OTS', 1949, 42000, 195000, 'Benzina', 'Manuale', 'Roadster', 160, 3442, 2, 2, 'restaurata', 4, true, true, 'Primo modello XK del dopoguerra. Restauro completo, certificazione ASI.', 'Milano', 'Old English White', 'published', false),
    ('Mercedes-Benz', '300 SL', 'Gullwing Coupé W198', 1955, 42000, 1450000, 'Benzina', 'Manuale', 'Coupé', 215, 2996, 2, 2, 'restaurata', 3, true, true, 'Iconica Gullwing con porte ad ali di gabbiano. Numeri matching, certificazione Mercedes-Benz Classic Center.', 'Milano', 'Argento', 'published', true)
  RETURNING id, brand
)
INSERT INTO public.car_images (car_id, url, is_cover, position)
SELECT id,
  CASE brand
    WHEN 'Bugatti' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Bugatti_Type_35_1924_-_Mullin_Automotive_Museum.jpg/1600px-Bugatti_Type_35_1924_-_Mullin_Automotive_Museum.jpg'
    WHEN 'Bentley' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/1929_Bentley_4_5_Litre_Supercharged_-_fvr.jpg/1600px-1929_Bentley_4_5_Litre_Supercharged_-_fvr.jpg'
    WHEN 'Alfa Romeo' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/1931_Alfa_Romeo_6C_1750_Gran_Sport_Spider.jpg/1600px-1931_Alfa_Romeo_6C_1750_Gran_Sport_Spider.jpg'
    WHEN 'Mercedes-Benz' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/1955_Mercedes-Benz_300_SL_Gullwing_Coupe_-_silver_-_fvr_%284637648597%29.jpg/1600px-1955_Mercedes-Benz_300_SL_Gullwing_Coupe_-_silver_-_fvr_%284637648597%29.jpg'
    WHEN 'Jaguar' THEN 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/1950_Jaguar_XK120_OTS_white_-_fl.jpg/1600px-1950_Jaguar_XK120_OTS_white_-_fl.jpg'
  END,
  true, 0
FROM inserted
WHERE brand <> 'Mercedes-Benz' OR (brand = 'Mercedes-Benz');
