-- Teams table for country leads to organize ambassadors into teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
    region VARCHAR(100), -- Add region support for better organization
    lead_id UUID NOT NULL REFERENCES users(id), -- Country lead who created the team
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disbanded')),
    team_type VARCHAR(50) DEFAULT 'general' CHECK (team_type IN ('general', 'specialist', 'pilot', 'training')),
    target_schools INTEGER DEFAULT 0,
    current_schools INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
    goals JSONB DEFAULT '{}', -- Team goals and KPIs
    settings JSONB DEFAULT '{}', -- Team-specific settings
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(country_code, name)
);

-- Team members table (many-to-many relationship between teams and ambassadors)
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    ambassador_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_in_team VARCHAR(50) DEFAULT 'member' CHECK (role_in_team IN ('member', 'coordinator', 'mentor', 'trainee')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP,
    performance_notes TEXT,
    permissions JSONB DEFAULT '{}',
    UNIQUE(team_id, ambassador_id)
);

-- Enhanced escalations table with better workflow support
CREATE TABLE escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_number VARCHAR(20) UNIQUE NOT NULL, -- Human-readable ticket number
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(10) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(20) DEFAULT 'Open' CHECK (status IN ('Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Reopened')),
    category VARCHAR(50) NOT NULL CHECK (category IN ('school_issue', 'ambassador_issue', 'technical', 'compliance', 'finance', 'partnership', 'training')),
    sub_category VARCHAR(100),
    urgency VARCHAR(10) DEFAULT 'Medium' CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')),
    impact VARCHAR(20) DEFAULT 'Low' CHECK (impact IN ('Low', 'Medium', 'High', 'Critical')),
    escalated_by UUID NOT NULL REFERENCES users(id),
    assigned_to UUID REFERENCES users(id),
    escalated_to UUID REFERENCES users(id), -- For further escalation
    school_id UUID REFERENCES schools(id),
    task_id UUID REFERENCES tasks(id),
    team_id UUID REFERENCES teams(id),
    due_date DATE,
    resolution_notes TEXT,
    resolution_time_hours INTEGER, -- Time taken to resolve
    customer_satisfaction INTEGER CHECK (customer_satisfaction >= 1 AND customer_satisfaction <= 5),
    tags TEXT[],
    attachments TEXT[],
    watchers UUID[], -- Users who want to be notified of updates
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    assigned_at TIMESTAMP,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP
);

-- Escalation comments for discussion thread
CREATE TABLE escalation_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escalation_id UUID NOT NULL REFERENCES escalations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false, -- Internal comments vs customer-facing
    attachments TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Enhanced notifications table with better categorization
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'error', 'success', 'reminder')),
    category VARCHAR(50) CHECK (category IN ('system', 'task', 'escalation', 'team', 'school', 'event', 'report')),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    action_required BOOLEAN DEFAULT FALSE,
    action_url TEXT, -- Deep link to relevant page
    action_text VARCHAR(100), -- Text for action button
    related_entity_type VARCHAR(50), -- schools, tasks, events, etc.
    related_entity_id UUID,
    expires_at TIMESTAMP, -- Auto-delete old notifications
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Function to generate escalation ticket numbers
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TEXT AS $$
DECLARE
    counter INTEGER;
    ticket_num TEXT;
BEGIN
    -- Get next sequence number for today
    SELECT COALESCE(MAX(CAST(SUBSTRING(ticket_number FROM 10) AS INTEGER)), 0) + 1
    INTO counter
    FROM escalations
    WHERE ticket_number LIKE TO_CHAR(NOW(), 'YYYY-MM-DD') || '-%';
    
    -- Format: YYYY-MM-DD-XXX (e.g., 2023-12-25-001)
    ticket_num := TO_CHAR(NOW(), 'YYYY-MM-DD') || '-' || LPAD(counter::TEXT, 3, '0');
    
    RETURN ticket_num;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate ticket numbers
CREATE OR REPLACE FUNCTION set_escalation_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number := generate_ticket_number();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER escalation_ticket_number_trigger
    BEFORE INSERT ON escalations
    FOR EACH ROW EXECUTE FUNCTION set_escalation_ticket_number();

-- Function to auto-assign escalations based on category and workload
CREATE OR REPLACE FUNCTION auto_assign_escalation()
RETURNS TRIGGER AS $$
DECLARE
    assignee_id UUID;
    min_workload INTEGER;
BEGIN
    -- Only auto-assign if not manually assigned
    IF NEW.assigned_to IS NULL THEN
        -- Find user with least workload in the appropriate role
        SELECT u.id INTO assignee_id
        FROM users u
        LEFT JOIN (
            SELECT assigned_to, COUNT(*) as workload
            FROM escalations
            WHERE status IN ('Assigned', 'In Progress')
            AND assigned_to IS NOT NULL
            GROUP BY assigned_to
        ) w ON u.id = w.assigned_to
        WHERE u.role = CASE
            WHEN NEW.category IN ('technical', 'system') THEN 'support'
            WHEN NEW.category IN ('compliance', 'finance') THEN 'management'
            ELSE 'support'
        END
        AND u.status = 'active'
        ORDER BY COALESCE(w.workload, 0) ASC, u.last_activity DESC
        LIMIT 1;
        
        IF assignee_id IS NOT NULL THEN
            NEW.assigned_to := assignee_id;
            NEW.assigned_at := NOW();
            NEW.status := 'Assigned';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_assign_escalation_trigger
    BEFORE INSERT ON escalations
    FOR EACH ROW EXECUTE FUNCTION auto_assign_escalation();

-- Indexes for teams and hierarchy
CREATE INDEX idx_teams_country_code ON teams(country_code);
CREATE INDEX idx_teams_region ON teams(region);
CREATE INDEX idx_teams_lead_id ON teams(lead_id);
CREATE INDEX idx_teams_status ON teams(status);
CREATE INDEX idx_teams_type ON teams(team_type);

CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_ambassador_id ON team_members(ambassador_id);
CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_members_role ON team_members(role_in_team);

-- Enhanced indexes for escalations
CREATE INDEX idx_escalations_ticket_number ON escalations(ticket_number);
CREATE INDEX idx_escalations_status ON escalations(status);
CREATE INDEX idx_escalations_priority ON escalations(priority);
CREATE INDEX idx_escalations_category ON escalations(category);
CREATE INDEX idx_escalations_escalated_by ON escalations(escalated_by);
CREATE INDEX idx_escalations_assigned_to ON escalations(assigned_to);
CREATE INDEX idx_escalations_school_id ON escalations(school_id);
CREATE INDEX idx_escalations_task_id ON escalations(task_id);
CREATE INDEX idx_escalations_team_id ON escalations(team_id);
CREATE INDEX idx_escalations_created_at ON escalations(created_at);
CREATE INDEX idx_escalations_due_date ON escalations(due_date);

CREATE INDEX idx_escalation_comments_escalation_id ON escalation_comments(escalation_id);
CREATE INDEX idx_escalation_comments_user_id ON escalation_comments(user_id);
CREATE INDEX idx_escalation_comments_created_at ON escalation_comments(created_at);

-- Enhanced indexes for notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_category ON notifications(category);
CREATE INDEX idx_notifications_priority ON notifications(priority);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_expires_at ON notifications(expires_at);
CREATE INDEX idx_notifications_action_required ON notifications(action_required);

-- Enable RLS on new tables
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalations ENABLE ROW LEVEL SECURITY;
ALTER TABLE escalation_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Enhanced Teams policies
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
      SELECT team_id FROM team_members 
      WHERE ambassador_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY "Support can view all teams for assistance" ON teams
  FOR SELECT USING (auth.user_role() = 'support');

-- Enhanced Team members policies
CREATE POLICY "Country leads can manage team members in their teams" ON team_members
  FOR ALL USING (
    auth.user_role() = 'country_lead' AND
    team_id IN (
      SELECT id FROM teams WHERE lead_id = auth.uid()
    )
  );

CREATE POLICY "Management can view all team memberships" ON team_members
  FOR SELECT USING (auth.user_role() = 'management');

CREATE POLICY "Ambassadors can view their team memberships" ON team_members
  FOR SELECT USING (auth.uid() = ambassador_id);

CREATE POLICY "Team coordinators can view their team members" ON team_members
  FOR SELECT USING (
    auth.user_role() = 'ambassador' AND
    team_id IN (
      SELECT team_id FROM team_members 
      WHERE ambassador_id = auth.uid() 
      AND role_in_team = 'coordinator'
      AND status = 'active'
    )
  );

-- Enhanced Escalations policies
CREATE POLICY "Users can view escalations they created or are assigned to" ON escalations
  FOR SELECT USING (
    auth.uid() = escalated_by OR
    auth.uid() = assigned_to OR
    auth.uid() = escalated_to OR
    auth.uid() = ANY(watchers)
  );

CREATE POLICY "Management and support can view all escalations" ON escalations
  FOR SELECT USING (auth.user_role() IN ('management', 'support'));

CREATE POLICY "Country leads can view escalations from their region" ON escalations
  FOR SELECT USING (
    auth.user_role() = 'country_lead' AND
    (school_id IN (SELECT id FROM schools WHERE country_code = auth.user_country()) OR
     escalated_by IN (SELECT id FROM users WHERE country_code = auth.user_country()) OR
     team_id IN (SELECT id FROM teams WHERE lead_id = auth.uid()))
  );

CREATE POLICY "Authenticated users can create escalations" ON escalations
  FOR INSERT WITH CHECK (auth.uid() = escalated_by);

CREATE POLICY "Assigned users and authorized roles can update escalations" ON escalations
  FOR UPDATE USING (
    auth.uid() = assigned_to OR
    auth.uid() = escalated_to OR
    auth.user_role() IN ('management', 'support') OR
    (auth.user_role() = 'country_lead' AND 
     escalated_by IN (SELECT id FROM users WHERE country_code = auth.user_country()))
  );

-- Escalation comments policies
CREATE POLICY "Users can view comments on escalations they have access to" ON escalation_comments
  FOR SELECT USING (
    escalation_id IN (
      SELECT id FROM escalations
      WHERE auth.uid() = escalated_by OR
            auth.uid() = assigned_to OR
            auth.uid() = escalated_to OR
            auth.uid() = ANY(watchers) OR
            auth.user_role() IN ('management', 'support')
    )
  );

CREATE POLICY "Users can add comments to accessible escalations" ON escalation_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    escalation_id IN (
      SELECT id FROM escalations
      WHERE auth.uid() = escalated_by OR
            auth.uid() = assigned_to OR
            auth.uid() = escalated_to OR
            auth.uid() = ANY(watchers) OR
            auth.user_role() IN ('management', 'support')
    )
  );

-- Enhanced Notifications policies
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System and authorized users can create notifications" ON notifications
  FOR INSERT WITH CHECK (
    user_id IS NOT NULL AND (
      auth.user_role() IN ('management', 'support') OR
      -- Allow creation by system functions
      current_setting('role', true) = 'service_role'
    )
  );

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Function to clean up expired notifications
CREATE OR REPLACE FUNCTION cleanup_expired_notifications()
RETURNS void AS $$
BEGIN
    DELETE FROM notifications
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- You can schedule this to run daily
-- SELECT cron.schedule('cleanup-notifications', '0 2 * * *', 'SELECT cleanup_expired_notifications();');