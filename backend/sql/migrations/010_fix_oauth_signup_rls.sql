-- Fix OAuth signup RLS policy for users table
-- Allow users to insert their own record during OAuth signup

CREATE POLICY "Users can insert own profile during signup" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
