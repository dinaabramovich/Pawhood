-- Seed data for local/dev environments so the map has something to show.
-- Coordinates below are approximate (general knowledge of these Tel Aviv
-- parks, not surveyed data) — verify and replace with accurate coordinates
-- before using this seed in a production environment.
insert into public.parks (name, description, location, address, amenities)
values
  (
    'Yarkon Park',
    'Tel Aviv''s largest park, with open lawns and dog-friendly stretches along the river.',
    ST_SetSRID(ST_MakePoint(34.8036, 32.1010), 4326)::geography,
    'Park HaYarkon, Tel Aviv',
    '{"fenced": false, "water": true, "lighting": true}'::jsonb
  ),
  (
    'Independence Park',
    'A hillside park near the coast with a popular off-leash dog area.',
    ST_SetSRID(ST_MakePoint(34.7686, 32.0837), 4326)::geography,
    'Gan Ha''atzmaut, Tel Aviv',
    '{"fenced": true, "water": true, "lighting": true}'::jsonb
  ),
  (
    'Meir Park',
    'A central neighborhood park close to Sheinkin, with a fenced dog run.',
    ST_SetSRID(ST_MakePoint(34.7746, 32.0733), 4326)::geography,
    'Gan Meir, Tel Aviv',
    '{"fenced": true, "water": true, "lighting": true}'::jsonb
  ),
  (
    'Dubnov Park',
    'A small, well-kept park off Ibn Gabirol, popular for morning walks.',
    ST_SetSRID(ST_MakePoint(34.7845, 32.0810), 4326)::geography,
    'Gan Dubnov, Tel Aviv',
    '{"fenced": false, "water": true, "lighting": true}'::jsonb
  ),
  (
    'Charles Clore Park',
    'A waterfront park south of the old port, with wide open space near the beach.',
    ST_SetSRID(ST_MakePoint(34.7635, 32.0625), 4326)::geography,
    'Charles Clore Park, Tel Aviv',
    '{"fenced": false, "water": false, "lighting": true}'::jsonb
  ),
  (
    'HaMesila Park',
    'A long, narrow linear park built along the old railway line.',
    ST_SetSRID(ST_MakePoint(34.7730, 32.0620), 4326)::geography,
    'Park HaMesila, Tel Aviv',
    '{"fenced": false, "water": true, "lighting": true}'::jsonb
  );
