-- Enable UUID extension (already included in your schema, but ensuring it's present)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Training Modules table
CREATE TABLE training_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('Required', 'Optional')),
    format VARCHAR(50) NOT NULL CHECK (format IN ('Video', 'Interactive', 'Document', 'Video + Quiz', 'Document + Quiz')),
    duration VARCHAR(50) NOT NULL,
    completion_rate INTEGER DEFAULT 0 CHECK (completion_rate >= 0 AND completion_rate <= 100),
    target_audience VARCHAR(50) DEFAULT 'All Ambassadors' CHECK (target_audience IN ('All Ambassadors', 'New Ambassadors', 'Senior Ambassadors')),
    resource_id UUID REFERENCES resources(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    last_updated TIMESTAMP DEFAULT NOW(),
    applicable_countries VARCHAR(3)[], -- References countries(code)
    learning_objectives TEXT[],
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'draft')),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Ambassador Training Progress table
CREATE TABLE ambassador_training_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    training_module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN ('Not Started', 'In Progress', 'Completed', 'Behind')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    completed_at TIMESTAMP,
    last_activity TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, training_module_id)
);

-- Training Metrics table
CREATE TABLE training_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL CHECK (title IN ('Completion Rate', 'Active Modules', 'Ambassadors in Training', 'Avg. Completion Time')),
    value VARCHAR(50) NOT NULL,
    change INTEGER NOT NULL,
    period VARCHAR(20) NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly')),
    country_code VARCHAR(3) REFERENCES countries(code),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Training Sessions table
CREATE TABLE training_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    format VARCHAR(20) NOT NULL CHECK (format IN ('Virtual', 'In-Person')),
    location VARCHAR(255),
    country_code VARCHAR(3) REFERENCES countries(code),
    registered_count INTEGER DEFAULT 0 CHECK (registered_count >= 0),
    meeting_link VARCHAR(500),
    created_by UUID NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    resources_needed TEXT[],
    agenda JSONB DEFAULT '{}',
    feedback JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_training_modules_status ON training_modules(status);
CREATE INDEX idx_ambassador_training_progress_user_id ON ambassador_training_progress(user_id);
CREATE INDEX idx_ambassador_training_progress_module_id ON ambassador_training_progress(training_module_id);
CREATE INDEX idx_training_metrics_title ON training_metrics(title);
CREATE INDEX idx_training_sessions_event_date ON training_sessions(event_date);