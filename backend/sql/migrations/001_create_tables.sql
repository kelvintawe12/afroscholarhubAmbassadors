-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table (Enhanced)
CREATE TABLE countries (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    flag_emoji VARCHAR(10), -- Changed from flag_url to emoji for better performance
    currency VARCHAR(3),
    timezone VARCHAR(50),
    lead_id UUID, -- Will reference users(id) after users table is created
    active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}', -- For country-specific configurations
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users table (Enhanced)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('management', 'country_lead', 'ambassador', 'support')),
    country_code VARCHAR(3) REFERENCES countries(code),
    avatar_url VARCHAR(255),
    phone VARCHAR(20),
    bio TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'training', 'suspended')),
    last_activity TIMESTAMP,
    onboarding_completed BOOLEAN DEFAULT false,
    performance_score INTEGER DEFAULT 0 CHECK (performance_score >= 0 AND performance_score <= 100),
    join_date DATE DEFAULT CURRENT_DATE,
    preferences JSONB DEFAULT '{}',
    skills TEXT[],
    languages TEXT[],
    emergency_contact JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key constraint for countries.lead_id after users table exists
ALTER TABLE countries ADD CONSTRAINT fk_countries_lead_id 
    FOREIGN KEY (lead_id) REFERENCES users(id);

-- Schools table (Enhanced)
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100),
    country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
    region VARCHAR(100) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('primary', 'secondary', 'tertiary', 'university', 'polytechnic')),
    status VARCHAR(20) DEFAULT 'prospect' CHECK (status IN ('prospect', 'contacted', 'visited', 'proposal', 'partnered', 'inactive')),
    contact_person VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    student_count INTEGER NOT NULL,
    ambassador_id UUID REFERENCES users(id),
    partnership_date DATE,
    last_visit DATE,
    next_action VARCHAR(255),
    notes TEXT,
    score INTEGER DEFAULT 0 CHECK (score >= 0 AND score <= 100),
    conversion_probability INTEGER DEFAULT 0 CHECK (conversion_probability >= 0 AND conversion_probability <= 100),
    potential VARCHAR(20) DEFAULT 'medium' CHECK (potential IN ('low', 'medium', 'high')),
    facilities JSONB DEFAULT '{}', -- Library, computer lab, internet, etc.
    demographics JSONB DEFAULT '{}', -- Age groups, gender distribution, etc.
    challenges TEXT[],
    opportunities TEXT[],
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Visits table (Enhanced)
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    ambassador_id UUID NOT NULL REFERENCES users(id),
    visit_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_minutes INTEGER NOT NULL,
    students_reached INTEGER NOT NULL DEFAULT 0,
    activities TEXT[],
    notes TEXT,
    photos TEXT[], -- URLs to photo storage
    documents TEXT[], -- URLs to document storage
    leads_generated INTEGER DEFAULT 0,
    feedback JSONB DEFAULT '{}',
    follow_up_required BOOLEAN DEFAULT false,
    follow_up_date DATE,
    weather_conditions VARCHAR(50),
    transportation_used VARCHAR(50),
    challenges_faced TEXT[],
    success_metrics JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'postponed')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table (Enhanced)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Urgent')),
    status VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Cancelled', 'On Hold')),
    due_date DATE NOT NULL,
    completed_date DATE,
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    school_id UUID REFERENCES schools(id),
    ambassador_id UUID NOT NULL REFERENCES users(id),
    created_by UUID NOT NULL REFERENCES users(id),
    assignor_id UUID REFERENCES users(id), -- Who assigned the task
    tags TEXT[],
    attachments TEXT[],
    estimated_hours DECIMAL(4,2),
    actual_hours DECIMAL(4,2),
    dependencies UUID[], -- Array of task IDs this task depends on
    watchers UUID[], -- Users who want to be notified of updates
    recurring_pattern VARCHAR(50), -- 'daily', 'weekly', 'monthly', etc.
    parent_task_id UUID REFERENCES tasks(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table (Enhanced)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255) NOT NULL,
    address TEXT,
    country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
    region VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) CHECK (event_type IN ('workshop', 'training', 'conference', 'outreach', 'meeting', 'webinar')),
    expected_attendance INTEGER NOT NULL,
    actual_attendance INTEGER,
    budget DECIMAL(12,2) NOT NULL,
    actual_cost DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    organizer_id UUID NOT NULL REFERENCES users(id),
    created_by UUID NOT NULL REFERENCES users(id),
    participants JSONB DEFAULT '[]', -- Array of participant objects
    speakers JSONB DEFAULT '[]',
    agenda JSONB DEFAULT '{}',
    resources_needed TEXT[],
    equipment_needed TEXT[],
    catering_required BOOLEAN DEFAULT false,
    registration_link VARCHAR(500),
    meeting_link VARCHAR(500),
    outcomes TEXT,
    feedback JSONB DEFAULT '{}',
    photos TEXT[],
    documents TEXT[],
    social_media_posts TEXT[],
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Resources table (Enhanced)
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    type VARCHAR(20) CHECK (type IN ('document', 'video', 'template', 'guide', 'form', 'toolkit', 'presentation')),
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) CHECK (file_type IN ('pdf', 'docx', 'xlsx', 'pptx', 'mp4', 'mp3', 'jpg', 'png', 'zip')),
    file_size INTEGER, -- in bytes
    thumbnail_url VARCHAR(500),
    tags TEXT[],
    country_specific BOOLEAN DEFAULT false,
    applicable_countries VARCHAR(3)[], -- Array of country codes
    access_level VARCHAR(20) DEFAULT 'all' CHECK (access_level IN ('all', 'ambassadors', 'leads', 'management')),
    featured BOOLEAN DEFAULT false,
    downloads INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    rating DECIMAL(2,1) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    rating_count INTEGER DEFAULT 0,
    version VARCHAR(20) DEFAULT '1.0',
    language VARCHAR(10) DEFAULT 'en',
    prerequisites TEXT[],
    learning_objectives TEXT[],
    duration_minutes INTEGER, -- For videos/courses
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
