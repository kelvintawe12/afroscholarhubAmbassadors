-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for tasks table
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to get ambassador statistics
CREATE OR REPLACE FUNCTION get_ambassador_stats(ambassador_uuid UUID)
RETURNS TABLE(
    total_schools INTEGER,
    total_visits INTEGER,
    total_students_reached INTEGER,
    total_visit_duration INTEGER,
    completed_tasks INTEGER,
    pending_tasks INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT s.id)::INTEGER as total_schools,
        COUNT(v.id)::INTEGER as total_visits,
        COALESCE(SUM(v.students_reached), 0)::INTEGER as total_students_reached,
        COALESCE(SUM(v.duration_minutes), 0)::INTEGER as total_visit_duration,
        COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::INTEGER as completed_tasks,
        COUNT(CASE WHEN t.status IN ('Pending', 'In Progress') THEN 1 END)::INTEGER as pending_tasks
    FROM users u
    LEFT JOIN schools s ON s.ambassador_id = u.id
    LEFT JOIN visits v ON v.ambassador_id = u.id
    LEFT JOIN tasks t ON t.ambassador_id = u.id
    WHERE u.id = ambassador_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get country statistics
CREATE OR REPLACE FUNCTION get_country_stats(country_code_param VARCHAR(3))
RETURNS TABLE(
    total_schools INTEGER,
    prospect_schools INTEGER,
    visited_schools INTEGER,
    partnered_schools INTEGER,
    total_ambassadors INTEGER,
    total_visits INTEGER,
    total_students_reached INTEGER,
    total_events INTEGER,
    upcoming_events INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT s.id)::INTEGER as total_schools,
        COUNT(CASE WHEN s.status = 'prospect' THEN 1 END)::INTEGER as prospect_schools,
        COUNT(CASE WHEN s.status = 'visited' THEN 1 END)::INTEGER as visited_schools,
        COUNT(CASE WHEN s.status = 'partnered' THEN 1 END)::INTEGER as partnered_schools,
        COUNT(DISTINCT u.id)::INTEGER as total_ambassadors,
        COUNT(v.id)::INTEGER as total_visits,
        COALESCE(SUM(v.students_reached), 0)::INTEGER as total_students_reached,
        COUNT(DISTINCT e.id)::INTEGER as total_events,
        COUNT(CASE WHEN e.event_date >= CURRENT_DATE THEN 1 END)::INTEGER as upcoming_events
    FROM countries c
    LEFT JOIN schools s ON s.country_code = c.code
    LEFT JOIN users u ON u.country_code = c.code AND u.role = 'ambassador'
    LEFT JOIN visits v ON v.ambassador_id = u.id
    LEFT JOIN events e ON e.country_code = c.code
    WHERE c.code = country_code_param
    GROUP BY c.code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get management dashboard stats
CREATE OR REPLACE FUNCTION get_management_stats()
RETURNS TABLE(
    total_countries INTEGER,
    total_schools INTEGER,
    total_ambassadors INTEGER,
    total_visits INTEGER,
    total_students_reached INTEGER,
    total_events INTEGER,
    active_tasks INTEGER,
    completed_tasks INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT c.code)::INTEGER as total_countries,
        COUNT(DISTINCT s.id)::INTEGER as total_schools,
        COUNT(DISTINCT u.id)::INTEGER as total_ambassadors,
        COUNT(v.id)::INTEGER as total_visits,
        COALESCE(SUM(v.students_reached), 0)::INTEGER as total_students_reached,
        COUNT(DISTINCT e.id)::INTEGER as total_events,
        COUNT(CASE WHEN t.status IN ('Pending', 'In Progress') THEN 1 END)::INTEGER as active_tasks,
        COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::INTEGER as completed_tasks
    FROM countries c
    LEFT JOIN schools s ON s.country_code = c.code
    LEFT JOIN users u ON u.country_code = c.code AND u.role = 'ambassador'
    LEFT JOIN visits v ON v.ambassador_id = u.id
    LEFT JOIN events e ON e.country_code = c.code
    LEFT JOIN tasks t ON t.ambassador_id = u.id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- View for monthly reports
CREATE OR REPLACE VIEW monthly_reports AS
SELECT
    DATE_TRUNC('month', v.visit_date) as month,
    c.name as country,
    COUNT(DISTINCT v.ambassador_id) as active_ambassadors,
    COUNT(v.id) as total_visits,
    SUM(v.students_reached) as students_reached,
    SUM(v.duration_minutes) as total_duration,
    COUNT(DISTINCT s.id) as schools_visited
FROM visits v
JOIN schools s ON v.school_id = s.id
JOIN countries c ON s.country_code = c.code
GROUP BY DATE_TRUNC('month', v.visit_date), c.name, c.code
ORDER BY month DESC, c.name;

-- View for task summary
CREATE OR REPLACE VIEW task_summary AS
SELECT
    u.full_name as ambassador_name,
    u.country_code,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'Completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN status IN ('Pending', 'In Progress') THEN 1 END) as active_tasks,
    COUNT(CASE WHEN due_date < CURRENT_DATE AND status != 'Completed' THEN 1 END) as overdue_tasks
FROM tasks t
JOIN users u ON t.ambassador_id = u.id
WHERE u.role = 'ambassador'
GROUP BY u.id, u.full_name, u.country_code;

-- Function to get school pipeline
CREATE OR REPLACE FUNCTION get_school_pipeline(country_code_param VARCHAR(3) DEFAULT NULL)
RETURNS TABLE(
    status TEXT,
    count INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        s.status::TEXT,
        COUNT(*)::INTEGER
    FROM schools s
    WHERE (country_code_param IS NULL OR s.country_code = country_code_param)
    GROUP BY s.status
    ORDER BY s.status;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
