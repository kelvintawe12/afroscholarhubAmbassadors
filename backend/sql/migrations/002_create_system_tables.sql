-- Teams table for hierarchical team management
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    country_code VARCHAR(3) REFERENCES countries(code),
    region VARCHAR(100),
    parent_team_id UUID REFERENCES teams(id),
    lead_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'disbanded')),
    team_type VARCHAR(50) CHECK (team_type IN ('country', 'region', 'project', 'special')),
    goals JSONB DEFAULT '{}',
    performance_metrics JSONB DEFAULT '{}',
    budget DECIMAL(12,2),
    target_schools INTEGER,
    target_students INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Team members junction table
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT NOW(),
    left_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    permissions JSONB DEFAULT '{}',
    UNIQUE(team_id, user_id, is_active) DEFERRABLE INITIALLY DEFERRED
);

-- Escalations/Support ticket system
CREATE TABLE escalations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('scholarship', 'compliance', 'technical', 'ambassador', 'partner', 'system', 'finance')),
    sub_category VARCHAR(100),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in_progress', 'escalated', 'resolved', 'closed', 'reopened')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    reporter_id UUID REFERENCES users(id) NOT NULL,
    assignee_id UUID REFERENCES users(id),
    escalated_to UUID REFERENCES users(id),
    escalated_at TIMESTAMP,
    due_date DATE,
    resolved_at TIMESTAMP,
    closed_at TIMESTAMP,
    resolution_notes TEXT,
    attachments TEXT[],
    tags TEXT[],
    impact VARCHAR(20) CHECK (impact IN ('single_student', 'multiple_students', 'regional', 'national', 'system_wide')),
    urgency VARCHAR(10) CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    customer_satisfaction INTEGER CHECK (customer_satisfaction >= 1 AND customer_satisfaction <= 5),
    time_to_resolve INTERVAL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Escalation comments for communication thread
CREATE TABLE escalation_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    escalation_id UUID REFERENCES escalations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) NOT NULL,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    attachments TEXT[],
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications system
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    action_url TEXT,
    action_text VARCHAR(100),
    priority VARCHAR(10) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    category VARCHAR(50),
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reports generation system
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    sub_type VARCHAR(50),
    format VARCHAR(10) DEFAULT 'pdf' CHECK (format IN ('pdf', 'xlsx', 'csv', 'json')),
    parameters JSONB DEFAULT '{}',
    filters JSONB DEFAULT '{}',
    file_url TEXT,
    file_size INTEGER,
    status VARCHAR(20) DEFAULT 'generating' CHECK (status IN ('generating', 'ready', 'failed', 'expired')),
    generated_by UUID REFERENCES users(id) NOT NULL,
    downloads INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    error_message TEXT,
    generation_time INTERVAL,
    scheduled_for TIMESTAMP,
    is_recurring BOOLEAN DEFAULT false,
    recurring_pattern VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat/Communication system
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) CHECK (type IN ('direct', 'group', 'support', 'announcement')),
    title VARCHAR(255),
    participants UUID[] NOT NULL,
    created_by UUID REFERENCES users(id) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    last_message_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) NOT NULL,
    message TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'file', 'image', 'system')),
    attachments TEXT[],
    reply_to UUID REFERENCES messages(id),
    edited_at TIMESTAMP,
    deleted_at TIMESTAMP,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Performance tracking
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    target_value DECIMAL(10,2),
    unit VARCHAR(20),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    country_code VARCHAR(3) REFERENCES countries(code),
    region VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, metric_type, metric_name, period_start, period_end)
);

-- Settings/Configuration
CREATE TABLE system_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_public BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP DEFAULT NOW()
);