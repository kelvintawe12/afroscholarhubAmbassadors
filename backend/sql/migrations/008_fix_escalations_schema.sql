-- Fix escalations table schema to match API expectations
-- This migration addresses the column name mismatches and missing relationships

-- First, check if we need to rename columns or add missing ones
DO $$
BEGIN
    -- Rename columns to match API expectations if they exist with different names
    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'escalations' AND column_name = 'escalated_by') THEN
        ALTER TABLE escalations RENAME COLUMN escalated_by TO reporter_id;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_name = 'escalations' AND column_name = 'assigned_to') THEN
        ALTER TABLE escalations RENAME COLUMN assigned_to TO assignee_id;
    END IF;

    -- Add missing columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'escalations' AND column_name = 'school_id') THEN
        ALTER TABLE escalations ADD COLUMN school_id UUID REFERENCES schools(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'escalations' AND column_name = 'task_id') THEN
        ALTER TABLE escalations ADD COLUMN task_id UUID REFERENCES tasks(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'escalations' AND column_name = 'team_id') THEN
        ALTER TABLE escalations ADD COLUMN team_id UUID REFERENCES teams(id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'escalations' AND column_name = 'watchers') THEN
        ALTER TABLE escalations ADD COLUMN watchers UUID[];
    END IF;

    -- Add missing timestamp columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'escalations' AND column_name = 'time_to_resolve') THEN
        ALTER TABLE escalations ADD COLUMN time_to_resolve INTERVAL;
    END IF;

    -- Update status values to match API expectations
    UPDATE escalations SET status =
        CASE
            WHEN status = 'Open' THEN 'new'
            WHEN status = 'Assigned' THEN 'assigned'
            WHEN status = 'In Progress' THEN 'in_progress'
            WHEN status = 'Pending' THEN 'escalated'
            WHEN status = 'Resolved' THEN 'resolved'
            WHEN status = 'Closed' THEN 'closed'
            WHEN status = 'Reopened' THEN 'escalated'
            ELSE status
        END
    WHERE status IN ('Open', 'Assigned', 'In Progress', 'Pending', 'Resolved', 'Closed', 'Reopened');

    -- Update priority values to match API expectations
    UPDATE escalations SET priority =
        CASE
            WHEN priority = 'Low' THEN 'low'
            WHEN priority = 'Medium' THEN 'medium'
            WHEN priority = 'High' THEN 'high'
            WHEN priority = 'Critical' THEN 'critical'
            ELSE priority
        END
    WHERE priority IN ('Low', 'Medium', 'High', 'Critical');

END $$;

-- Create indexes for the new/missing columns
CREATE INDEX IF NOT EXISTS idx_escalations_reporter_id ON escalations(reporter_id);
CREATE INDEX IF NOT EXISTS idx_escalations_assignee_id ON escalations(assignee_id);
CREATE INDEX IF NOT EXISTS idx_escalations_school_id ON escalations(school_id);
CREATE INDEX IF NOT EXISTS idx_escalations_task_id ON escalations(task_id);
CREATE INDEX IF NOT EXISTS idx_escalations_team_id ON escalations(team_id);

-- Function to calculate time to resolve
CREATE OR REPLACE FUNCTION calculate_time_to_resolve()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'resolved' AND OLD.status != 'resolved' AND NEW.resolved_at IS NOT NULL THEN
        NEW.time_to_resolve := NEW.resolved_at - OLD.created_at;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically calculate resolution time
DROP TRIGGER IF EXISTS calculate_resolution_time_trigger ON escalations;
CREATE TRIGGER calculate_resolution_time_trigger
    BEFORE UPDATE ON escalations
    FOR EACH ROW EXECUTE FUNCTION calculate_time_to_resolve();
