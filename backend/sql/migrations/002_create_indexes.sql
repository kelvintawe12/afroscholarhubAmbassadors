-- Indexes for performance optimization

-- Users table indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_country_code ON users(country_code);
CREATE INDEX idx_users_email ON users(email);

-- Schools table indexes
CREATE INDEX idx_schools_status ON schools(status);
CREATE INDEX idx_schools_country_code ON schools(country_code);
CREATE INDEX idx_schools_region ON schools(region);
CREATE INDEX idx_schools_ambassador_id ON schools(ambassador_id);
CREATE INDEX idx_schools_created_at ON schools(created_at);

-- Visits table indexes
CREATE INDEX idx_visits_school_id ON visits(school_id);
CREATE INDEX idx_visits_ambassador_id ON visits(ambassador_id);
CREATE INDEX idx_visits_visit_date ON visits(visit_date);
CREATE INDEX idx_visits_created_at ON visits(created_at);

-- Tasks table indexes
CREATE INDEX idx_tasks_ambassador_id ON tasks(ambassador_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_school_id ON tasks(school_id);
CREATE INDEX idx_tasks_created_by ON tasks(created_by);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Events table indexes
CREATE INDEX idx_events_country_code ON events(country_code);
CREATE INDEX idx_events_region ON events(region);
CREATE INDEX idx_events_event_date ON events(event_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_events_created_at ON events(created_at);

-- Resources table indexes
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_created_by ON resources(created_by);
CREATE INDEX idx_resources_created_at ON resources(created_at);

-- Countries table indexes
CREATE INDEX idx_countries_name ON countries(name);
CREATE INDEX idx_countries_lead_id ON countries(lead_id);

-- Composite indexes for common queries
CREATE INDEX idx_schools_country_status ON schools(country_code, status);
CREATE INDEX idx_visits_ambassador_date ON visits(ambassador_id, visit_date);
CREATE INDEX idx_tasks_ambassador_status ON tasks(ambassador_id, status);
CREATE INDEX idx_events_country_date ON events(country_code, event_date);
