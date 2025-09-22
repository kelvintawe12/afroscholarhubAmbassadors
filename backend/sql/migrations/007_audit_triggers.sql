-- First, let's ensure the audit_logs table exists (from your 005 migration)
-- If it doesn't exist, uncomment and run this:

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID,
    timestamp TIMESTAMP DEFAULT NOW(),
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255)
);

-- Function to get the current user ID from the session
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID AS $$
BEGIN
    -- Try to get user ID from auth.uid() (Supabase)
    RETURN auth.uid();
EXCEPTION
    WHEN OTHERS THEN
        -- Fallback to a session variable or NULL
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_table_name VARCHAR(100),
    p_record_id UUID,
    p_action VARCHAR(10),
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_changed_fields TEXT[] DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    audit_id UUID;
BEGIN
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_fields,
        user_id,
        timestamp
    ) VALUES (
        p_table_name,
        p_record_id,
        p_action,
        p_old_values,
        p_new_values,
        p_changed_fields,
        get_current_user_id(),
        NOW()
    ) RETURNING id INTO audit_id;
    
    RETURN audit_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get changed fields between old and new records
CREATE OR REPLACE FUNCTION get_changed_fields(old_record JSONB, new_record JSONB)
RETURNS TEXT[] AS $$
DECLARE
    changed_fields TEXT[] := ARRAY[]::TEXT[];
    field_name TEXT;
BEGIN
    -- Skip if either record is NULL
    IF old_record IS NULL OR new_record IS NULL THEN
        RETURN changed_fields;
    END IF;

    -- Compare each field in new_record with old_record
    FOR field_name IN SELECT jsonb_object_keys(new_record)
    LOOP
        -- Skip system fields
        IF field_name IN ('created_at', 'updated_at') THEN
            CONTINUE;
        END IF;
        
        IF old_record->field_name IS NULL OR old_record->field_name <> new_record->field_name THEN
            changed_fields := array_append(changed_fields, field_name);
        END IF;
    END LOOP;

    RETURN changed_fields;
END;
$$ LANGUAGE plpgsql;

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    old_values JSONB;
    new_values JSONB;
    changed_fields TEXT[];
    record_id UUID;
BEGIN
    -- Get record ID
    record_id := CASE 
        WHEN TG_OP = 'DELETE' THEN OLD.id
        ELSE NEW.id
    END;

    -- Convert OLD and NEW to JSONB (excluding sensitive fields)
    IF TG_OP != 'INSERT' THEN
        old_values := to_jsonb(OLD);
        -- Remove sensitive fields if they exist
        old_values := old_values - 'password' - 'password_hash' - 'token';
    END IF;
    
    IF TG_OP != 'DELETE' THEN
        new_values := to_jsonb(NEW);
        -- Remove sensitive fields if they exist
        new_values := new_values - 'password' - 'password_hash' - 'token';
    END IF;

    -- Get changed fields for updates
    IF TG_OP = 'UPDATE' THEN
        changed_fields := get_changed_fields(old_values, new_values);
        -- Only log if there are actual changes
        IF array_length(changed_fields, 1) IS NULL OR array_length(changed_fields, 1) = 0 THEN
            RETURN NEW;
        END IF;
    END IF;

    -- Log the audit event
    PERFORM log_audit_event(
        TG_TABLE_NAME,
        record_id,
        TG_OP,
        old_values,
        new_values,
        changed_fields
    );

    RETURN CASE
        WHEN TG_OP = 'DELETE' THEN OLD
        ELSE NEW
    END;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail the original operation
        RAISE WARNING 'Audit logging failed for table %: %', TG_TABLE_NAME, SQLERRM;
        RETURN CASE
            WHEN TG_OP = 'DELETE' THEN OLD
            ELSE NEW
        END;
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for key tables
DROP TRIGGER IF EXISTS audit_users_trigger ON users;
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_schools_trigger ON schools;
CREATE TRIGGER audit_schools_trigger
    AFTER INSERT OR UPDATE OR DELETE ON schools
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_visits_trigger ON visits;
CREATE TRIGGER audit_visits_trigger
    AFTER INSERT OR UPDATE OR DELETE ON visits
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_tasks_trigger ON tasks;
CREATE TRIGGER audit_tasks_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_events_trigger ON events;
CREATE TRIGGER audit_events_trigger
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Add audit triggers for new system tables (if they exist)
DROP TRIGGER IF EXISTS audit_teams_trigger ON teams;
CREATE TRIGGER audit_teams_trigger
    AFTER INSERT OR UPDATE OR DELETE ON teams
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_team_members_trigger ON team_members;
CREATE TRIGGER audit_team_members_trigger
    AFTER INSERT OR UPDATE OR DELETE ON team_members
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

DROP TRIGGER IF EXISTS audit_escalations_trigger ON escalations;
CREATE TRIGGER audit_escalations_trigger
    AFTER INSERT OR UPDATE OR DELETE ON escalations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Create updated_at triggers for tables that have this column
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_schools_updated_at ON schools;
CREATE TRIGGER update_schools_updated_at
    BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_visits_updated_at ON visits;
CREATE TRIGGER update_visits_updated_at
    BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_resources_updated_at ON resources;
CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Notification triggers
CREATE OR REPLACE FUNCTION create_notification(
    p_user_id UUID,
    p_type VARCHAR(50),
    p_title VARCHAR(255),
    p_message TEXT,
    p_data JSONB DEFAULT '{}',
    p_action_url TEXT DEFAULT NULL,
    p_priority VARCHAR(10) DEFAULT 'normal'
) RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (
        user_id, type, title, message, data, action_url, priority
    ) VALUES (
        p_user_id, p_type, p_title, p_message, p_data, p_action_url, p_priority
    ) RETURNING id INTO notification_id;
    
    RETURN notification_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Log error but don't fail
        RAISE WARNING 'Failed to create notification for user %: %', p_user_id, SQLERRM;
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to notify when tasks are assigned or updated
CREATE OR REPLACE FUNCTION notify_task_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify ambassador when task is assigned to them
    IF TG_OP = 'INSERT' AND NEW.ambassador_id IS NOT NULL THEN
        PERFORM create_notification(
            NEW.ambassador_id,
            'task_assigned',
            'New Task Assigned: ' || NEW.title,
            'You have been assigned a new task: ' || COALESCE(NEW.description, 'No description provided'),
            jsonb_build_object(
                'task_id', NEW.id,
                'priority', NEW.priority,
                'due_date', NEW.due_date
            ),
            '/dashboard/ambassador/tasks',
            CASE 
                WHEN NEW.priority = 'High' THEN 'high'
                WHEN NEW.priority = 'Urgent' THEN 'urgent'
                ELSE 'normal'
            END
        );
    END IF;

    -- Notify ambassador when task is updated (only important changes)
    IF TG_OP = 'UPDATE' AND OLD.ambassador_id = NEW.ambassador_id AND NEW.ambassador_id IS NOT NULL THEN
        IF OLD.status != NEW.status OR OLD.priority != NEW.priority OR OLD.due_date != NEW.due_date THEN
            PERFORM create_notification(
                NEW.ambassador_id,
                'task_updated',
                'Task Updated: ' || NEW.title,
                'Your task has been updated. Status: ' || NEW.status || ', Priority: ' || NEW.priority,
                jsonb_build_object(
                    'task_id', NEW.id,
                    'old_status', OLD.status,
                    'new_status', NEW.status,
                    'priority', NEW.priority
                ),
                '/dashboard/ambassador/tasks',
                CASE 
                    WHEN NEW.status = 'Completed' THEN 'normal'
                    WHEN NEW.priority = 'Urgent' THEN 'urgent'
                    ELSE 'normal'
                END
            );
        END IF;
    END IF;

    -- Notify task creator when task is completed
    IF TG_OP = 'UPDATE' AND OLD.status != 'Completed' AND NEW.status = 'Completed' AND NEW.created_by != NEW.ambassador_id THEN
        PERFORM create_notification(
            NEW.created_by,
            'task_completed',
            'Task Completed: ' || NEW.title,
            'The task you assigned has been completed by ' || (SELECT full_name FROM users WHERE id = NEW.ambassador_id),
            jsonb_build_object(
                'task_id', NEW.id,
                'completed_by', NEW.ambassador_id,
                'completed_date', NOW()
            ),
            '/dashboard/management/tasks'
        );
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Task notification failed: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for task notifications
DROP TRIGGER IF EXISTS notify_on_task_changes ON tasks;
CREATE TRIGGER notify_on_task_changes
    AFTER INSERT OR UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION notify_task_changes();

-- Function to notify about new visits
CREATE OR REPLACE FUNCTION notify_visit_created()
RETURNS TRIGGER AS $$
DECLARE
    country_lead_id UUID;
    school_name VARCHAR(255);
BEGIN
    -- Get school name and country lead
    SELECT s.name, u.id INTO school_name, country_lead_id
    FROM schools s
    LEFT JOIN users u ON u.country_code = s.country_code AND u.role = 'country_lead'
    WHERE s.id = NEW.school_id;

    -- Notify country lead about new visit
    IF country_lead_id IS NOT NULL THEN
        PERFORM create_notification(
            country_lead_id,
            'visit_logged',
            'New School Visit Logged',
            'A visit to ' || COALESCE(school_name, 'Unknown School') || ' has been logged with ' || NEW.students_reached || ' students reached.',
            jsonb_build_object(
                'visit_id', NEW.id,
                'school_id', NEW.school_id,
                'ambassador_id', NEW.ambassador_id,
                'students_reached', NEW.students_reached
            ),
            '/dashboard/country-lead/visits'
        );
    END IF;

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Visit notification failed: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for visit notifications
DROP TRIGGER IF EXISTS notify_on_visit_created ON visits;
CREATE TRIGGER notify_on_visit_created
    AFTER INSERT ON visits
    FOR EACH ROW EXECUTE FUNCTION notify_visit_created();

-- Function to update school metrics when visits are added/updated
CREATE OR REPLACE FUNCTION update_school_metrics()
RETURNS TRIGGER AS $$
DECLARE
    total_visits INTEGER;
    total_students INTEGER;
    last_visit_date DATE;
    new_score INTEGER;
BEGIN
    -- Calculate metrics for the school
    SELECT 
        COUNT(*),
        COALESCE(SUM(students_reached), 0),
        MAX(visit_date)
    INTO total_visits, total_students, last_visit_date
    FROM visits 
    WHERE school_id = COALESCE(NEW.school_id, OLD.school_id);

    -- Calculate simple score (you can make this more sophisticated)
    new_score := LEAST(100, 
        (total_visits * 10) + 
        (CASE WHEN total_students > 500 THEN 30 
              WHEN total_students > 100 THEN 20 
              ELSE total_students / 5 END) +
        (CASE WHEN last_visit_date > CURRENT_DATE - INTERVAL '30 days' THEN 20 ELSE 0 END)
    );

    -- Update school record
    UPDATE schools 
    SET 
        score = new_score,
        last_visit = last_visit_date,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.school_id, OLD.school_id);

    RETURN COALESCE(NEW, OLD);
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'School metrics update failed: %', SQLERRM;
        RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to update school metrics
DROP TRIGGER IF EXISTS update_school_metrics_trigger ON visits;
CREATE TRIGGER update_school_metrics_trigger
    AFTER INSERT OR UPDATE OR DELETE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_school_metrics();

-- Function to check for overdue tasks
CREATE OR REPLACE FUNCTION check_overdue_tasks()
RETURNS void AS $$
BEGIN
    -- Update overdue tasks
    UPDATE tasks 
    SET status = 'Overdue', updated_at = NOW()
    WHERE due_date < CURRENT_DATE 
    AND status IN ('Pending', 'In Progress');

    -- Notify ambassadors about overdue tasks
    INSERT INTO notifications (user_id, type, title, message, priority, data)
    SELECT 
        t.ambassador_id,
        'task_overdue',
        'Overdue Task: ' || t.title,
        'Your task "' || t.title || '" is now overdue. Please update the status or contact your supervisor.',
        'high',
        jsonb_build_object('task_id', t.id, 'due_date', t.due_date)
    FROM tasks t
    WHERE t.due_date < CURRENT_DATE 
    AND t.status = 'Overdue'
    AND t.ambassador_id IS NOT NULL
    -- Only send notification once per day
    AND NOT EXISTS (
        SELECT 1 FROM notifications n
        WHERE n.user_id = t.ambassador_id
        AND n.type = 'task_overdue'
        AND n.data->>'task_id' = t.id::text
        AND n.created_at > CURRENT_DATE
    );
END;
$$ LANGUAGE plpgsql;

-- You can run this function periodically (daily) to check for overdue tasks
-- Example: SELECT check_overdue_tasks();

-- Comment out the following if you don't have pg_cron extension
-- SELECT cron.schedule('check-overdue-tasks', '0 9 * * *', 'SELECT check_overdue_tasks();');
