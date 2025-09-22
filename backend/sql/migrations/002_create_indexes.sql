-- Indexes for performance optimization

-- Core table indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_country ON users(country_code);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_last_activity ON users(last_activity);

CREATE INDEX idx_schools_status ON schools(status);
CREATE INDEX idx_schools_country ON schools(country_code);
CREATE INDEX idx_schools_region ON schools(region);
CREATE INDEX idx_schools_ambassador ON schools(ambassador_id);
CREATE INDEX idx_schools_score ON schools(score);
CREATE INDEX idx_schools_potential ON schools(potential);
CREATE INDEX idx_schools_type ON schools(type);

CREATE INDEX idx_visits_school ON visits(school_id);
CREATE INDEX idx_visits_ambassador ON visits(ambassador_id);
CREATE INDEX idx_visits_date ON visits(visit_date);
CREATE INDEX idx_visits_status ON visits(status);

CREATE INDEX idx_tasks_assignee ON tasks(ambassador_id);
CREATE INDEX idx_tasks_creator ON tasks(created_by);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_school ON tasks(school_id);

CREATE INDEX idx_events_date ON events(event_date);
CREATE INDEX idx_events_country ON events(country_code);
CREATE INDEX idx_events_region ON events(region);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_organizer ON events(organizer_id);

CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_access_level ON resources(access_level);
CREATE INDEX idx_resources_featured ON resources(featured);
CREATE INDEX idx_resources_created_by ON resources(created_by);

-- System table indexes
CREATE INDEX idx_teams_country ON teams(country_code);
CREATE INDEX idx_teams_lead ON teams(lead_id);
CREATE INDEX idx_teams_parent ON teams(parent_team_id);
CREATE INDEX idx_teams_status ON teams(status);

CREATE INDEX idx_team_members_team ON team_members(team_id);
CREATE INDEX idx_team_members_user ON team_members(user_id);
CREATE INDEX idx_team_members_active ON team_members(is_active);

CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_escalations_priority ON escalations(priority);
CREATE INDEX idx_escalations_category ON escalations(category);
CREATE INDEX idx_escalations_reporter ON escalations(reporter_id);
CREATE INDEX idx_escalations_assignee ON escalations(assignee_id);
CREATE INDEX idx_escalations_ticket_id ON escalations(ticket_id);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_priority ON notifications(priority);

CREATE INDEX idx_reports_type ON reports(type);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_generated_by ON reports(generated_by);
CREATE INDEX idx_reports_created ON reports(created_at);

CREATE INDEX idx_conversations_participants ON conversations USING GIN(participants);
CREATE INDEX idx_conversations_created_by ON conversations(created_by);
CREATE INDEX idx_conversations_active ON conversations(is_active);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at);

CREATE INDEX idx_performance_user ON performance_metrics(user_id);
CREATE INDEX idx_performance_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_period ON performance_metrics(period_start, period_end);
CREATE INDEX idx_performance_country ON performance_metrics(country_code);

-- Composite indexes for common queries
CREATE INDEX idx_schools_country_status ON schools(country_code, status);
CREATE INDEX idx_visits_ambassador_date ON visits(ambassador_id, visit_date);
CREATE INDEX idx_tasks_assignee_status ON tasks(ambassador_id, status);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);

-- Full-text search indexes
CREATE INDEX idx_schools_search ON schools USING GIN(to_tsvector('english', name || ' ' || COALESCE(location, '') || ' ' || COALESCE(notes, '')));
CREATE INDEX idx_resources_search ON resources USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_events_search ON events USING GIN(to_tsvector('english', name || ' ' || COALESCE(description, '')));
