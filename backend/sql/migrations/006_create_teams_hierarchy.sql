-- Teams table for country leads to organize ambassadors into teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
    lead_id UUID NOT NULL REFERENCES users(id), -- Country lead who created the team
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(country_code, name)
);

-- Team members table (many-to-many relationship between teams and ambassadors)
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    ambassador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_team VARCHAR(50) DEFAULT 'member', -- member, coordinator, etc.
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, ambassador_id)
);

-- Escalations table for issues that need attention from higher levels
CREATE TABLE escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) CHECK (status IN ('Open', 'In Progress', 'Resolved', 'Closed')),
    category VARCHAR(50) NOT NULL, -- school_issue, ambassador_issue, technical, etc.
    escalated_by UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id), -- Can be null if not yet assigned
    school_id UUID REFERENCES schools(id),
    task_id UUID REFERENCES tasks(id),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    resolved_at TIMESTAMP
);

-- Notifications table for system notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- info, warning, error, success
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_type VARCHAR(50), -- schools, tasks, events, etc.
    related_entity_id UUID,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for teams and hierarchy
CREATE INDEX idx_teams_country_code ON teams(country_code);
CREATE INDEX idx_teams_lead_id ON teams(lead_id);
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_ambassador_id ON team_members(ambassador_id);

-- Indexes for escalations
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_escalations_priority ON escalations(priority);
CREATE INDEX idx_escalations_escalated_by ON escalations(escalated_by);
CREATE INDEX idx_escalations_assigned_to ON escalations(assigned_to);
CREATE INDEX idx_escalations_school_id ON escalations(school_id);
CREATE INDEX idx_escalations_task_id ON escalations(task_id);

-- Indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- Enable RLS on new tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Teams policies
CREATE POLICY "Country leads can manage teams in their country" ON teams
  FOR ALL USING (
    auth.user_role() = 'country_lead' AND
    country_code = auth.user_country()
  );

CREATE POLICY "Management can view all teams" ON teams
  FOR SELECT USING (auth.user_role() = 'management');

CREATE POLICY "Ambassadors can view teams they're members of" ON teams
  FOR SELECT USING (
    auth.user_role() = 'ambassador' AND
    id IN (
      SELECT team_id FROM team_members WHERE ambassador_id = auth.uid()
    )
  );

-- Team members policies
CREATE POLICY "Country leads can manage team members in their country" ON team_members
  FOR ALL USING (
    auth.user_role() = 'country_lead' AND
    team_id IN (
      SELECT id FROM teams WHERE lead_id = auth.uid()
    )
  );

CREATE POLICY "Ambassadors can view their team memberships" ON team_members
  FOR SELECT USING (auth.uid() = ambassador_id);

-- Escalations policies
CREATE POLICY "Users can view escalations they created or are assigned to" ON escalations
  FOR SELECT USING (
    auth.uid() = escalated_by OR
    auth.uid() = assigned_to
  );

CREATE POLICY "Management and support can view all escalations" ON escalations
  FOR SELECT USING (auth.user_role() IN ('management', 'support'));

CREATE POLICY "Country leads can view escalations from their country" ON escalations
  FOR SELECT USING (
    auth.user_role() = 'country_lead' AND
    (school_id IN (SELECT id FROM schools WHERE country_code = auth.user_country()) OR
     escalated_by IN (SELECT id FROM users WHERE country_code = auth.user_country()))
  );

CREATE POLICY "Users can create escalations" ON escalations
  FOR INSERT WITH CHECK (auth.uid() = escalated_by);

CREATE POLICY "Assigned users and management can update escalations" ON escalations
  FOR UPDATE USING (
    auth.uid() = assigned_to OR
    auth.user_role() = 'management' OR
    auth.user_role() = 'support'
  );

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create notifications for users" ON notifications
  FOR INSERT WITH CHECK (TRUE); -- Allow system to create notifications

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);
