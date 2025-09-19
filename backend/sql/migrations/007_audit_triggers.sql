-- Function to get changed fields between old and new records
CREATE OR REPLACE FUNCTION get_changed_fields(old_record JSONB, new_record JSONB)
RETURNS TEXT[] AS $$
DECLARE
    changed_fields TEXT[] := ARRAY[]::TEXT[];
    field_name TEXT;
BEGIN
    -- Compare each field in new_record with old_record
    FOR field_name IN SELECT jsonb_object_keys(new_record)
    LOOP
        IF old_record->field_name IS NULL OR old_record->field_name <> new_record->field_name THEN
            changed_fields := array_append(changed_fields, field_name);
        END IF;
    END LOOP;

    -- Check for fields that exist in old but not in new (deletions)
    FOR field_name IN SELECT jsonb_object_keys(old_record)
    LOOP
        IF new_record->field_name IS NULL THEN
            changed_fields := array_append(changed_fields, field_name || ' (removed)');
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
BEGIN
    -- Convert OLD and NEW to JSONB
    old_values := CASE WHEN TG_OP != 'INSERT' THEN to_jsonb(OLD) ELSE NULL END;
    new_values := CASE WHEN TG_OP != 'DELETE' THEN to_jsonb(NEW) ELSE NULL END;

    -- Get changed fields
    IF TG_OP = 'UPDATE' THEN
        changed_fields := get_changed_fields(old_values, new_values);
    END IF;

    -- Log the audit event
    PERFORM log_audit_event(
        TG_TABLE_NAME,
        CASE
            WHEN TG_OP = 'DELETE' THEN OLD.id
            ELSE NEW.id
        END,
        TG_OP,
        old_values,
        new_values,
        changed_fields
    );

    RETURN CASE
        WHEN TG_OP = 'DELETE' THEN OLD
        ELSE NEW
    END;
END;
$$ LANGUAGE plpgsql;

-- Create audit triggers for key tables
CREATE TRIGGER audit_users_trigger
    AFTER INSERT OR UPDATE OR DELETE ON users
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_schools_trigger
    AFTER INSERT OR UPDATE OR DELETE ON schools
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_visits_trigger
    AFTER INSERT OR UPDATE OR DELETE ON visits
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_tasks_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tasks
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_events_trigger
    AFTER INSERT OR UPDATE OR DELETE ON events
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_teams_trigger
    AFTER INSERT OR UPDATE OR DELETE ON teams
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_team_members_trigger
    AFTER INSERT OR UPDATE OR DELETE ON team_members
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_escalations_trigger
    AFTER INSERT OR UPDATE OR DELETE ON escalations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

-- Function to create notifications for escalations
CREATE OR REPLACE FUNCTION notify_escalation_created()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify management and support about new escalations
    INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
    SELECT
        u.id,
        'New Escalation: ' || NEW.title,
        'A new escalation has been created: ' || NEW.description,
        CASE
            WHEN NEW.priority = 'Critical' THEN 'error'
            WHEN NEW.priority = 'High' THEN 'warning'
            ELSE 'info'
        END,
        'escalations',
        NEW.id
    FROM users u
    WHERE u.role IN ('management', 'support');

    -- Notify country lead if escalation is from their country
    INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
    SELECT
        u.id,
        'Escalation in Your Country: ' || NEW.title,
        'An escalation has been created in your country: ' || NEW.description,
        'warning',
        'escalations',
        NEW.id
    FROM users u
    WHERE u.role = 'country_lead'
    AND (
        NEW.school_id IN (SELECT id FROM schools WHERE country_code = u.country_code) OR
        NEW.escalated_by IN (SELECT id FROM users WHERE country_code = u.country_code)
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for escalation notifications
CREATE TRIGGER notify_on_escalation_created
    AFTER INSERT ON escalations
    FOR EACH ROW EXECUTE FUNCTION notify_escalation_created();

-- Function to notify when tasks are assigned or updated
CREATE OR REPLACE FUNCTION notify_task_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Notify ambassador when task is assigned to them
    IF TG_OP = 'INSERT' AND NEW.ambassador_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
        VALUES (
            NEW.ambassador_id,
            'New Task Assigned: ' || NEW.title,
            'You have been assigned a new task: ' || COALESCE(NEW.description, 'No description provided'),
            'info',
            'tasks',
            NEW.id
        );
    END IF;

    -- Notify ambassador when task is updated
    IF TG_OP = 'UPDATE' AND OLD.ambassador_id = NEW.ambassador_id THEN
        -- Only notify if important fields changed
        IF OLD.status != NEW.status OR OLD.priority != NEW.priority OR OLD.due_date != NEW.due_date THEN
            INSERT INTO notifications (user_id, title, message, type, related_entity_type, related_entity_id)
            VALUES (
                NEW.ambassador_id,
                'Task Updated: ' || NEW.title,
                'Your task has been updated. Status: ' || NEW.status || ', Priority: ' || NEW.priority,
                'info',
                'tasks',
                NEW.id
            );
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for task notifications
CREATE TRIGGER notify_on_task_changes
    AFTER INSERT OR UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION notify_task_changes();

-- Function to update team updated_at
CREATE OR REPLACE FUNCTION update_team_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE teams SET updated_at = NOW() WHERE id = NEW.team_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for team updated_at
CREATE TRIGGER update_team_timestamp
    AFTER INSERT OR UPDATE OR DELETE ON team_members
    FOR EACH ROW EXECUTE FUNCTION update_team_updated_at();

-- Function to update escalation updated_at
CREATE OR REPLACE FUNCTION update_escalation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for escalation updated_at
CREATE TRIGGER update_escalation_timestamp
    BEFORE UPDATE ON escalations
    FOR EACH ROW EXECUTE FUNCTION update_escalation_updated_at();
