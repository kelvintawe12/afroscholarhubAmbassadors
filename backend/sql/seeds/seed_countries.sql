-- ================================================
-- SEED COUNTRIES DATA
-- ================================================
-- This script seeds the countries table with initial data
-- Compatible with the schema in backend/sql/migrations/001_create_tables.sql
-- Run this in Supabase SQL Editor or via psql
-- Note: lead_id is set to NULL (no lead assigned yet), timestamps use defaults

-- Insert countries data (explicitly including all columns for schema match)
INSERT INTO countries (
    code, 
    name, 
    flag_emoji, 
    currency, 
    timezone, 
    lead_id, 
    active, 
    settings
) VALUES
('USA', 'United States', '🇺🇸', 'USD', 'America/New_York', NULL, true, '{"region": "North America", "language": "en"}'::jsonb),
('KEN', 'Kenya', '🇰🇪', 'KES', 'Africa/Nairobi', NULL, true, '{"region": "East Africa", "language": "en"}'::jsonb),
('NGA', 'Nigeria', '🇳🇬', 'NGN', 'Africa/Lagos', NULL, true, '{"region": "West Africa", "language": "en"}'::jsonb),
('ZAF', 'South Africa', '🇿🇦', 'ZAR', 'Africa/Johannesburg', NULL, true, '{"region": "Southern Africa", "language": "en"}'::jsonb),
('GHA', 'Ghana', '🇬🇭', 'GHS', 'Africa/Accra', NULL, true, '{"region": "West Africa", "language": "en"}'::jsonb),
('ETH', 'Ethiopia', '🇪🇹', 'ETB', 'Africa/Addis_Ababa', NULL, true, '{"region": "East Africa", "language": "en"}'::jsonb),
('UGA', 'Uganda', '🇺🇬', 'UGX', 'Africa/Kampala', NULL, true, '{"region": "East Africa", "language": "en"}'::jsonb),
('TZA', 'Tanzania', '🇹🇿', 'TZS', 'Africa/Dar_es_Salaam', NULL, true, '{"region": "East Africa", "language": "en"}'::jsonb),
('CMR', 'Cameroon', '🇨🇲', 'XAF', 'Africa/Douala', NULL, true, '{"region": "Central Africa", "language": "en"}'::jsonb),
('SSD', 'South Sudan', '🇸🇸', 'SSP', 'Africa/Juba', NULL, true, '{"region": "East Africa", "language": "en"}'::jsonb),
('SLE', 'Sierra Leone', '🇸🇱', 'SLL', 'Africa/Freetown', NULL, true, '{"region": "West Africa", "language": "en"}'::jsonb)
ON CONFLICT (code) DO NOTHING;

-- Verify the data was inserted (matches getCountries query in src/api/reports.ts)
SELECT code, name, flag_emoji 
FROM countries 
WHERE active = true 
ORDER BY name;
