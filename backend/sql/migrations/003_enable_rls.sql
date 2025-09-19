-- Enable Row Level Security on all tables
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT AS $$
  SELECT role FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Helper function to get current user country
CREATE OR REPLACE FUNCTION auth.user_country()
RETURNS TEXT AS $$
  SELECT country_code FROM users WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER;

-- Countries policies
CREATE POLICY "Countries are viewable by authenticated users" ON countries
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Countries are manageable by management" ON countries
  FOR ALL USING (auth.user_role() = 'management');

-- Users policies
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Management can view all users" ON users
  FOR SELECT USING (auth.user_role() = 'management');

CREATE POLICY "Country leads can view users in their country" ON users
  FOR SELECT USING (
    auth.user_role() = 'country_lead' AND
    country_code = auth.user_country()
  );

CREATE POLICY "Ambassadors can view ambassadors in their country" ON users
  FOR SELECT USING (
    auth.user_role() = 'ambassador' AND
    role = 'ambassador' AND
    country_code = auth.user_country()
  );

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    role = (SELECT role FROM users WHERE id = auth.uid()) AND
    country_code = (SELECT country_code FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Management can manage user roles" ON users
  FOR ALL USING (auth.user_role() = 'management');

-- Schools policies
CREATE POLICY "Management can view all schools" ON schools
  FOR SELECT USING (auth.user_role() = 'management');

CREATE POLICY "Country leads can view schools in their country" ON schools
  FOR SELECT USING (
    auth.user_role() = 'country_lead' AND
    country_code = auth.user_country()
  );

CREATE POLICY "Ambassadors can view their schools" ON schools
  FOR SELECT USING (
    auth.user_role() = 'ambassador' AND
    (ambassador_id = auth.uid() OR country_code = auth.user_country())
  );

CREATE POLICY "Management can manage all schools" ON schools
  FOR ALL USING (auth.user_role() = 'management');

CREATE POLICY "Country leads can manage schools in their country" ON schools
  FOR ALL USING (
    auth.user_role() = 'country_lead' AND
    country_code = auth.user_country()
  );

-- Visits policies
CREATE POLICY "Management can view all visits" ON visits
  FOR SELECT USING (auth.user_role() = 'management');

CREATE POLICY "Country leads can view visits in their country" ON visits
  FOR SELECT USING (
    auth.user_role() = 'country_lead' AND
    school_id IN (
      SELECT id FROM schools WHERE country_code = auth.user_country()
    )
  );

CREATE POLICY "Ambassadors can view their visits" ON visits
  FOR SELECT USING (
    auth.user_role() = 'ambassador' AND
    ambassador_id = auth.uid()
  );

CREATE POLICY "Ambassadors can create visits for their schools" ON visits
  FOR INSERT WITH CHECK (
    auth.user_role() = 'ambassador' AND
    ambassador_id = auth.uid() AND
    school_id IN (
      SELECT id FROM schools WHERE ambassador_id = auth.uid()
    )
  );

-- Tasks policies
CREATE POLICY "Management can view all tasks" ON tasks
  FOR SELECT USING (auth.user_role() = 'management');

CREATE POLICY "Country leads can view tasks in their country" ON tasks
  FOR SELECT USING (
    auth.user_role() = 'country_lead' AND
    ambassador_id IN (
      SELECT id FROM users WHERE country_code = auth.user_country()
    )
  );

CREATE POLICY "Ambassadors can view their tasks" ON tasks
  FOR SELECT USING (
    auth.user_role() = 'ambassador' AND
    ambassador_id = auth.uid()
  );

CREATE POLICY "Management can create tasks" ON tasks
  FOR INSERT WITH CHECK (auth.user_role() = 'management');

CREATE POLICY "Country leads can create tasks in their country" ON tasks
  FOR INSERT WITH CHECK (
    auth.user_role() = 'country_lead' AND
    ambassador_id IN (
      SELECT id FROM users WHERE country_code = auth.user_country()
    )
  );

CREATE POLICY "Ambassadors can update their tasks" ON tasks
  FOR UPDATE USING (
    auth.user_role() = 'ambassador' AND
    ambassador_id = auth.uid()
  );

-- Events policies
CREATE POLICY "Events are viewable by authenticated users" ON events
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Management can manage all events" ON events
  FOR ALL USING (auth.user_role() = 'management');

CREATE POLICY "Country leads can manage events in their country" ON events
  FOR ALL USING (
    auth.user_role() = 'country_lead' AND
    country_code = auth.user_country()
  );

-- Resources policies
CREATE POLICY "Resources are viewable by authenticated users" ON resources
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Management and support can manage resources" ON resources
  FOR ALL USING (auth.user_role() IN ('management', 'support'));
