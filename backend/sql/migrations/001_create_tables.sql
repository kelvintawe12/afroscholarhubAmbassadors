-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Countries table
CREATE TABLE countries (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    flag_url VARCHAR(255),
    lead_id UUID REFERENCES users(id)
);

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('management', 'country_lead', 'ambassador', 'support')),
    country_code VARCHAR(3) REFERENCES countries(code),
    avatar_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Schools table
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    student_count INTEGER NOT NULL,
    status VARCHAR(20) CHECK (status IN ('prospect', 'visited', 'partnered', 'inactive')),
    country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
    region VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    ambassador_id UUID REFERENCES users(id)
);

-- Visits table
CREATE TABLE visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id),
    ambassador_id UUID NOT NULL REFERENCES users(id),
    visit_date DATE NOT NULL,
    duration_minutes INTEGER NOT NULL,
    students_reached INTEGER NOT NULL,
    activities TEXT[],
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) CHECK (priority IN ('Low', 'Medium', 'High')),
    status VARCHAR(20) CHECK (status IN ('Pending', 'In Progress', 'Completed')),
    due_date DATE NOT NULL,
    school_id UUID REFERENCES schools(id),
    ambassador_id UUID NOT NULL REFERENCES users(id),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    location VARCHAR(255) NOT NULL,
    country_code VARCHAR(3) NOT NULL REFERENCES countries(code),
    region VARCHAR(100) NOT NULL,
    expected_attendance INTEGER NOT NULL,
    actual_attendance INTEGER,
    budget DECIMAL(10,2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('planned', 'in-progress', 'completed', 'cancelled')),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Resources table
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) CHECK (type IN ('document', 'video', 'template', 'guide')),
    url VARCHAR(500) NOT NULL,
    file_type VARCHAR(10) CHECK (file_type IN ('pdf', 'docx', 'xlsx', 'pptx', 'mp4', 'jpg', 'png')),
    category VARCHAR(100) NOT NULL,
    tags TEXT[],
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);
