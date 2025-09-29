-- Create a function to ensure user exists in database, bypassing RLS
CREATE OR REPLACE FUNCTION public.ensure_user_in_database(
  user_id UUID,
  user_email VARCHAR(255),
  user_full_name VARCHAR(255),
  user_role VARCHAR(20),
  user_country_code VARCHAR(3)
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role, country_code, status, created_at, updated_at)
  VALUES (user_id, user_email, user_full_name, user_role, user_country_code, 'active', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    country_code = EXCLUDED.country_code,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
