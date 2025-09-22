-- ================================================
-- UTILITY FUNCTIONS
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    -- Only update if there are actual changes
    IF ROW(OLD.*) IS DISTINCT FROM ROW(NEW.*) THEN
        NEW.updated_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN 
        SELECT table_name 
        FROM information_schema.columns 
        WHERE column_name = 'updated_at' 
        AND table_schema = 'public'
        AND table_name IN ('users', 'schools', 'visits', 'tasks', 'events', 'resources', 'teams', 'escalations', 'reports')
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS update_%I_updated_at ON %I;
            CREATE TRIGGER update_%I_updated_at
                BEFORE UPDATE ON %I
                FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
        ', table_record.table_name, table_record.table_name, table_record.table_name, table_record.table_name);
    END LOOP;
END $$;

-- ================================================
-- STATISTICS & ANALYTICS FUNCTIONS
-- ================================================

-- Enhanced function to get ambassador statistics with error handling
CREATE OR REPLACE FUNCTION get_ambassador_stats(
    ambassador_uuid UUID,
    date_from DATE DEFAULT NULL,
    date_to DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    total_schools INTEGER,
    total_visits INTEGER,
    total_students_reached INTEGER,
    total_visit_duration INTEGER,
    completed_tasks INTEGER,
    pending_tasks INTEGER,
    overdue_tasks INTEGER,
    average_students_per_visit DECIMAL(10,2),
    last_visit_date DATE,
    performance_score INTEGER,
    monthly_target INTEGER,
    monthly_achievement INTEGER
) AS $$
DECLARE
    start_date DATE;
BEGIN
    -- Set default date range
    start_date := COALESCE(date_from, CURRENT_DATE - INTERVAL '30 days');
    
    -- Validate inputs
    IF ambassador_uuid IS NULL THEN
        RAISE EXCEPTION 'Ambassador UUID cannot be null';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM users WHERE id = ambassador_uuid) THEN
        RAISE EXCEPTION 'Ambassador with UUID % not found', ambassador_uuid;
    END IF;

    RETURN QUERY
    WITH ambassador_data AS (
        SELECT u.id, u.performance_score
        FROM users u
        WHERE u.id = ambassador_uuid
    ),
    visit_stats AS (
        SELECT
            COUNT(DISTINCT s.id) as school_count,
            COUNT(v.id) as visit_count,
            COALESCE(SUM(v.students_reached), 0) as students_total,
            COALESCE(SUM(v.duration_minutes), 0) as duration_total,
            MAX(v.visit_date) as last_visit,
            CASE 
                WHEN COUNT(v.id) > 0 THEN ROUND(COALESCE(SUM(v.students_reached), 0)::DECIMAL / COUNT(v.id), 2)
                ELSE 0
            END as avg_students
        FROM ambassador_data a
        LEFT JOIN schools s ON s.ambassador_id = a.id
        LEFT JOIN visits v ON v.ambassador_id = a.id 
            AND (date_from IS NULL OR v.visit_date >= start_date)
            AND v.visit_date <= date_to
    ),
    task_stats AS (
        SELECT
            COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) as completed_count,
            COUNT(CASE WHEN t.status IN ('Pending', 'In Progress') THEN 1 END) as pending_count,
            COUNT(CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'Completed' THEN 1 END) as overdue_count
        FROM ambassador_data a
        LEFT JOIN tasks t ON t.ambassador_id = a.id
            AND (date_from IS NULL OR t.created_at >= start_date)
            AND t.created_at <= date_to + INTERVAL '1 day'
    ),
    targets AS (
        -- Assume monthly target of 50 students reached per ambassador
        SELECT 50 as monthly_target
    )
    SELECT
        vs.school_count::INTEGER,
        vs.visit_count::INTEGER,
        vs.students_total::INTEGER,
        vs.duration_total::INTEGER,
        ts.completed_count::INTEGER,
        ts.pending_count::INTEGER,
        ts.overdue_count::INTEGER,
        vs.avg_students,
        vs.last_visit,
        COALESCE(ad.performance_score, 0)::INTEGER,
        t.monthly_target::INTEGER,
        CASE 
            WHEN date_from IS NULL OR date_from >= DATE_TRUNC('month', CURRENT_DATE) 
            THEN vs.students_total::INTEGER
            ELSE 0
        END
    FROM ambassador_data ad
    CROSS JOIN visit_stats vs
    CROSS JOIN task_stats ts
    CROSS JOIN targets t;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced function to get country statistics with performance metrics
CREATE OR REPLACE FUNCTION get_country_stats(
    country_code_param VARCHAR(3),
    include_inactive BOOLEAN DEFAULT FALSE,
    date_from DATE DEFAULT NULL,
    date_to DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    total_schools INTEGER,
    prospect_schools INTEGER,
    contacted_schools INTEGER,
    visited_schools INTEGER,
    partnered_schools INTEGER,
    inactive_schools INTEGER,
    total_ambassadors INTEGER,
    active_ambassadors INTEGER,
    total_visits INTEGER,
    total_students_reached INTEGER,
    total_events INTEGER,
    upcoming_events INTEGER,
    completed_events INTEGER,
    average_students_per_visit DECIMAL(10,2),
    conversion_rate DECIMAL(5,2),
    monthly_growth_rate DECIMAL(5,2)
) AS $$
DECLARE
    start_date DATE;
BEGIN
    -- Validate inputs
    IF country_code_param IS NULL OR LENGTH(country_code_param) != 3 THEN
        RAISE EXCEPTION 'Invalid country code: %', country_code_param;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM countries WHERE code = country_code_param) THEN
        RAISE EXCEPTION 'Country with code % not found', country_code_param;
    END IF;
    
    start_date := COALESCE(date_from, CURRENT_DATE - INTERVAL '30 days');

    RETURN QUERY
    WITH country_data AS (
        SELECT c.code, c.name
        FROM countries c
        WHERE c.code = country_code_param
    ),
    school_stats AS (
        SELECT
            COUNT(*) as total_count,
            COUNT(CASE WHEN s.status = 'prospect' THEN 1 END) as prospect_count,
            COUNT(CASE WHEN s.status = 'contacted' THEN 1 END) as contacted_count,
            COUNT(CASE WHEN s.status = 'visited' THEN 1 END) as visited_count,
            COUNT(CASE WHEN s.status = 'partnered' THEN 1 END) as partnered_count,
            COUNT(CASE WHEN s.status = 'inactive' THEN 1 END) as inactive_count
        FROM country_data cd
        JOIN schools s ON s.country_code = cd.code
        WHERE include_inactive OR s.status != 'inactive'
    ),
    ambassador_stats AS (
        SELECT
            COUNT(*) as total_count,
            COUNT(CASE WHEN u.status = 'active' AND u.last_activity > CURRENT_DATE - INTERVAL '7 days' THEN 1 END) as active_count
        FROM country_data cd
        JOIN users u ON u.country_code = cd.code AND u.role = 'ambassador'
        WHERE include_inactive OR u.status = 'active'
    ),
    visit_stats AS (
        SELECT
            COUNT(v.id) as visit_count,
            COALESCE(SUM(v.students_reached), 0) as students_total,
            CASE 
                WHEN COUNT(v.id) > 0 THEN ROUND(COALESCE(SUM(v.students_reached), 0)::DECIMAL / COUNT(v.id), 2)
                ELSE 0
            END as avg_students
        FROM country_data cd
        JOIN schools s ON s.country_code = cd.code
        JOIN visits v ON v.school_id = s.id
        WHERE v.visit_date BETWEEN start_date AND date_to
    ),
    event_stats AS (
        SELECT
            COUNT(*) as total_count,
            COUNT(CASE WHEN e.event_date >= CURRENT_DATE THEN 1 END) as upcoming_count,
            COUNT(CASE WHEN e.status = 'completed' THEN 1 END) as completed_count
        FROM country_data cd
        JOIN events e ON e.country_code = cd.code
        WHERE e.event_date BETWEEN start_date AND date_to + INTERVAL '90 days'
    ),
    conversion_data AS (
        SELECT
            ss.prospect_count + ss.contacted_count as pipeline_count,
            ss.partnered_count,
            CASE 
                WHEN (ss.prospect_count + ss.contacted_count) > 0 
                THEN ROUND((ss.partnered_count::DECIMAL / (ss.prospect_count + ss.contacted_count)) * 100, 2)
                ELSE 0
            END as conversion_rate
        FROM school_stats ss
    ),
    growth_data AS (
        SELECT
            CASE 
                WHEN COUNT(*) > 0 AND LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', v.visit_date)) > 0
                THEN ROUND(((COUNT(*) - LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', v.visit_date)))::DECIMAL / 
                           LAG(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', v.visit_date))) * 100, 2)
                ELSE 0
            END as growth_rate
        FROM country_data cd
        JOIN schools s ON s.country_code = cd.code
        JOIN visits v ON v.school_id = s.id
        WHERE v.visit_date >= CURRENT_DATE - INTERVAL '2 months'
        GROUP BY DATE_TRUNC('month', v.visit_date)
        ORDER BY DATE_TRUNC('month', v.visit_date) DESC
        LIMIT 1
    )
    SELECT
        ss.total_count::INTEGER,
        ss.prospect_count::INTEGER,
        ss.contacted_count::INTEGER,
        ss.visited_count::INTEGER,
        ss.partnered_count::INTEGER,
        ss.inactive_count::INTEGER,
        ast.total_count::INTEGER,
        ast.active_count::INTEGER,
        vs.visit_count::INTEGER,
        vs.students_total::INTEGER,
        es.total_count::INTEGER,
        es.upcoming_count::INTEGER,
        es.completed_count::INTEGER,
        vs.avg_students,
        cd.conversion_rate,
        COALESCE(gd.growth_rate, 0.00)::DECIMAL(5,2)
    FROM school_stats ss
    CROSS JOIN ambassador_stats ast
    CROSS JOIN visit_stats vs
    CROSS JOIN event_stats es
    CROSS JOIN conversion_data cd
    LEFT JOIN growth_data gd ON TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enhanced management dashboard stats with comprehensive metrics
CREATE OR REPLACE FUNCTION get_management_stats(
    date_from DATE DEFAULT NULL,
    date_to DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    total_countries INTEGER,
    active_countries INTEGER,
    total_schools INTEGER,
    total_ambassadors INTEGER,
    active_ambassadors INTEGER,
    total_visits INTEGER,
    total_students_reached INTEGER,
    total_events INTEGER,
    active_tasks INTEGER,
    completed_tasks INTEGER,
    overdue_tasks INTEGER,
    completion_rate DECIMAL(5,2),
    average_students_per_visit DECIMAL(10,2),
    top_performing_country VARCHAR(100),
    schools_by_status JSONB,
    monthly_trends JSONB
) AS $$
DECLARE
    start_date DATE;
    top_country VARCHAR(100);
    status_breakdown JSONB;
    trends_data JSONB;
BEGIN
    start_date := COALESCE(date_from, CURRENT_DATE - INTERVAL '30 days');
    
    -- Get top performing country
    SELECT c.name INTO top_country
    FROM countries c
    JOIN visits v ON v.school_id IN (SELECT id FROM schools WHERE country_code = c.code)
    WHERE v.visit_date BETWEEN start_date AND date_to
    GROUP BY c.code, c.name
    ORDER BY SUM(v.students_reached) DESC
    LIMIT 1;
    
    -- Get schools breakdown by status
    SELECT jsonb_object_agg(status, count) INTO status_breakdown
    FROM (
        SELECT status, COUNT(*) as count
        FROM schools
        GROUP BY status
    ) t;
    
    -- Get monthly trends
    SELECT jsonb_agg(
        jsonb_build_object(
            'month', month,
            'visits', visits,
            'students', students,
            'schools', schools
        )
    ) INTO trends_data
    FROM (
        SELECT
            TO_CHAR(DATE_TRUNC('month', v.visit_date), 'YYYY-MM') as month,
            COUNT(v.id) as visits,
            SUM(v.students_reached) as students,
            COUNT(DISTINCT v.school_id) as schools
        FROM visits v
        WHERE v.visit_date >= CURRENT_DATE - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', v.visit_date)
        ORDER BY DATE_TRUNC('month', v.visit_date)
    ) monthly_data;

    RETURN QUERY
    WITH stats AS (
        SELECT
            COUNT(DISTINCT c.code) as country_count,
            COUNT(DISTINCT CASE WHEN c.active THEN c.code END) as active_country_count,
            COUNT(DISTINCT s.id) as school_count,
            COUNT(DISTINCT u.id) as ambassador_count,
            COUNT(DISTINCT CASE WHEN u.status = 'active' AND u.last_activity > CURRENT_DATE - INTERVAL '7 days' THEN u.id END) as active_ambassador_count,
            COUNT(v.id) as visit_count,
            COALESCE(SUM(v.students_reached), 0) as students_total,
            COUNT(DISTINCT e.id) as event_count,
            COUNT(CASE WHEN t.status IN ('Pending', 'In Progress') THEN 1 END) as active_task_count,
            COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) as completed_task_count,
            COUNT(CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'Completed' THEN 1 END) as overdue_task_count,
            CASE 
                WHEN COUNT(t.id) > 0 
                THEN ROUND((COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::DECIMAL / COUNT(t.id)) * 100, 2)
                ELSE 0
            END as completion_rate,
            CASE 
                WHEN COUNT(v.id) > 0 
                THEN ROUND(COALESCE(SUM(v.students_reached), 0)::DECIMAL / COUNT(v.id), 2)
                ELSE 0
            END as avg_students
        FROM countries c
        LEFT JOIN schools s ON s.country_code = c.code
        LEFT JOIN users u ON u.country_code = c.code AND u.role = 'ambassador'
        LEFT JOIN visits v ON v.ambassador_id = u.id AND v.visit_date BETWEEN start_date AND date_to
        LEFT JOIN events e ON e.country_code = c.code AND e.event_date BETWEEN start_date AND date_to
        LEFT JOIN tasks t ON t.ambassador_id = u.id AND t.created_at BETWEEN start_date AND date_to + INTERVAL '1 day'
    )
    SELECT
        s.country_count::INTEGER,
        s.active_country_count::INTEGER,
        s.school_count::INTEGER,
        s.ambassador_count::INTEGER,
        s.active_ambassador_count::INTEGER,
        s.visit_count::INTEGER,
        s.students_total::INTEGER,
        s.event_count::INTEGER,
        s.active_task_count::INTEGER,
        s.completed_task_count::INTEGER,
        s.overdue_task_count::INTEGER,
        s.completion_rate,
        s.avg_students,
        COALESCE(top_country, 'N/A')::VARCHAR(100),
        COALESCE(status_breakdown, '{}'::jsonb),
        COALESCE(trends_data, '[]'::jsonb)
    FROM stats s;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- ENHANCED VIEWS
-- ================================================

-- Enhanced monthly reports view with more metrics
DROP VIEW IF EXISTS monthly_reports;
CREATE VIEW monthly_reports AS
WITH monthly_data AS (
    SELECT
        DATE_TRUNC('month', v.visit_date) as report_month,
        c.code as country_code,
        c.name as country_name,
        COUNT(DISTINCT v.ambassador_id) as active_ambassadors,
        COUNT(DISTINCT v.school_id) as schools_visited,
        COUNT(v.id) as total_visits,
        SUM(v.students_reached) as students_reached,
        SUM(v.duration_minutes) as total_duration_minutes,
        ROUND(AVG(v.students_reached), 2) as avg_students_per_visit,
        COUNT(DISTINCT CASE WHEN s.status = 'partnered' THEN s.id END) as new_partnerships
    FROM visits v
    JOIN schools s ON v.school_id = s.id
    JOIN countries c ON s.country_code = c.code
    WHERE v.visit_date >= CURRENT_DATE - INTERVAL '12 months'
    GROUP BY DATE_TRUNC('month', v.visit_date), c.code, c.name
),
previous_month AS (
    SELECT
        report_month,
        country_code,
        LAG(students_reached) OVER (PARTITION BY country_code ORDER BY report_month) as prev_students,
        LAG(total_visits) OVER (PARTITION BY country_code ORDER BY report_month) as prev_visits
    FROM monthly_data
)
SELECT
    md.*,
    ROUND(md.total_duration_minutes::DECIMAL / 60, 2) as total_duration_hours,
    CASE 
        WHEN pm.prev_students > 0 
        THEN ROUND(((md.students_reached - pm.prev_students)::DECIMAL / pm.prev_students) * 100, 2)
        ELSE 0
    END as students_growth_rate,
    CASE 
        WHEN pm.prev_visits > 0 
        THEN ROUND(((md.total_visits - pm.prev_visits)::DECIMAL / pm.prev_visits) * 100, 2)
        ELSE 0
    END as visits_growth_rate
FROM monthly_data md
LEFT JOIN previous_month pm ON md.report_month = pm.report_month AND md.country_code = pm.country_code
ORDER BY md.report_month DESC, md.country_name;

-- Enhanced task summary view
DROP VIEW IF EXISTS task_summary;
CREATE VIEW task_summary AS
SELECT
    u.id as ambassador_id,
    u.full_name as ambassador_name,
    u.country_code,
    c.name as country_name,
    u.status as ambassador_status,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN t.status = 'Completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status IN ('Pending', 'In Progress') THEN 1 END) as active_tasks,
    COUNT(CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'Completed' THEN 1 END) as overdue_tasks,
    COUNT(CASE WHEN t.priority = 'High' THEN 1 END) as high_priority_tasks,
    COUNT(CASE WHEN t.priority = 'Urgent' THEN 1 END) as urgent_tasks,
    ROUND(
        CASE 
            WHEN COUNT(*) > 0 
            THEN (COUNT(CASE WHEN t.status = 'Completed' THEN 1 END)::DECIMAL / COUNT(*)) * 100
            ELSE 0
        END, 2
    ) as completion_rate,
    AVG(CASE WHEN t.status = 'Completed' AND t.completed_date IS NOT NULL 
        THEN EXTRACT(DAY FROM t.completed_date - t.created_at) 
        END) as avg_completion_days,
    MAX(t.created_at) as last_task_created,
    MAX(t.completed_date) as last_task_completed
FROM tasks t
JOIN users u ON t.ambassador_id = u.id
JOIN countries c ON u.country_code = c.code
WHERE u.role = 'ambassador'
GROUP BY u.id, u.full_name, u.country_code, c.name, u.status;

-- ================================================
-- PIPELINE & ANALYTICS FUNCTIONS
-- ================================================

-- Enhanced school pipeline function with conversion tracking
CREATE OR REPLACE FUNCTION get_school_pipeline(
    country_code_param VARCHAR(3) DEFAULT NULL,
    region_param VARCHAR(100) DEFAULT NULL,
    ambassador_id_param UUID DEFAULT NULL,
    include_metrics BOOLEAN DEFAULT TRUE
)
RETURNS TABLE(
    status TEXT,
    count INTEGER,
    percentage DECIMAL(5,2),
    avg_days_in_status INTEGER,
    conversion_rate DECIMAL(5,2),
    trend_direction TEXT
) AS $$
DECLARE
    total_schools INTEGER;
BEGIN
    -- Get total count for percentage calculation
    SELECT COUNT(*) INTO total_schools
    FROM schools s
    WHERE (country_code_param IS NULL OR s.country_code = country_code_param)
    AND (region_param IS NULL OR s.region = region_param)
    AND (ambassador_id_param IS NULL OR s.ambassador_id = ambassador_id_param);
    
    IF total_schools = 0 THEN
        total_schools := 1; -- Prevent division by zero
    END IF;

    RETURN QUERY
    WITH status_data AS (
        SELECT
            s.status,
            COUNT(*) as status_count,
            ROUND((COUNT(*)::DECIMAL / total_schools) * 100, 2) as status_percentage,
            ROUND(AVG(EXTRACT(DAY FROM CURRENT_DATE - s.created_at))) as avg_days,
            -- Calculate conversion rate (simplified)
            CASE 
                WHEN s.status = 'partnered' THEN 100.00
                WHEN s.status = 'visited' THEN 75.00
                WHEN s.status = 'contacted' THEN 50.00
                WHEN s.status = 'prospect' THEN 25.00
                ELSE 0.00
            END as conversion_rate
        FROM schools s
        WHERE (country_code_param IS NULL OR s.country_code = country_code_param)
        AND (region_param IS NULL OR s.region = region_param)
        AND (ambassador_id_param IS NULL OR s.ambassador_id = ambassador_id_param)
        GROUP BY s.status
    ),
    trend_data AS (
        SELECT
            s.status,
            COUNT(*) as current_count,
            COUNT(CASE WHEN s.created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as recent_count,
            COUNT(CASE WHEN s.created_at >= CURRENT_DATE - INTERVAL '60 days' 
                      AND s.created_at < CURRENT_DATE - INTERVAL '30 days' THEN 1 END) as previous_count
        FROM schools s
        WHERE (country_code_param IS NULL OR s.country_code = country_code_param)
        AND (region_param IS NULL OR s.region = region_param)
        AND (ambassador_id_param IS NULL OR s.ambassador_id = ambassador_id_param)
        GROUP BY s.status
    )
    SELECT
        sd.status::TEXT,
        sd.status_count::INTEGER,
        sd.status_percentage,
        sd.avg_days::INTEGER,
        sd.conversion_rate,
        CASE 
            WHEN td.recent_count > td.previous_count THEN 'up'
            WHEN td.recent_count < td.previous_count THEN 'down'
            ELSE 'stable'
        END::TEXT as trend
    FROM status_data sd
    LEFT JOIN trend_data td ON sd.status = td.status
    ORDER BY 
        CASE sd.status
            WHEN 'prospect' THEN 1
            WHEN 'contacted' THEN 2
            WHEN 'visited' THEN 3
            WHEN 'proposal' THEN 4
            WHEN 'partnered' THEN 5
            ELSE 6
        END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- PERFORMANCE & OPTIMIZATION FUNCTIONS
-- ================================================

-- Function to calculate performance scores
CREATE OR REPLACE FUNCTION calculate_performance_score(user_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    visit_score INTEGER := 0;
    task_score INTEGER := 0;
    engagement_score INTEGER := 0;
    total_score INTEGER := 0;
BEGIN
    -- Visit performance (40% weight)
    SELECT 
        LEAST(40, (COUNT(v.id) * 2) + (COALESCE(SUM(v.students_reached), 0) / 10))
    INTO visit_score
    FROM visits v
    WHERE v.ambassador_id = user_uuid
    AND v.visit_date >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Task completion (30% weight)
    SELECT 
        LEAST(30, 
            CASE 
                WHEN COUNT(*) > 0 
                THEN ROUND((COUNT(CASE WHEN status = 'Completed' THEN 1 END)::DECIMAL / COUNT(*)) * 30)
                ELSE 0
            END
        )
    INTO task_score
    FROM tasks
    WHERE ambassador_id = user_uuid
    AND created_at >= CURRENT_DATE - INTERVAL '30 days';
    
    -- Engagement score (30% weight)
    SELECT 
        LEAST(30,
            CASE 
                WHEN last_activity >= CURRENT_DATE - INTERVAL '1 day' THEN 30
                WHEN last_activity >= CURRENT_DATE - INTERVAL '3 days' THEN 25
                WHEN last_activity >= CURRENT_DATE - INTERVAL '7 days' THEN 20
                WHEN last_activity >= CURRENT_DATE - INTERVAL '14 days' THEN 15
                WHEN last_activity >= CURRENT_DATE - INTERVAL '30 days' THEN 10
                ELSE 0
            END
        )
    INTO engagement_score
    FROM users
    WHERE id = user_uuid;
    
    total_score := visit_score + task_score + engagement_score;
    
    -- Update user's performance score
    UPDATE users 
    SET performance_score = total_score, updated_at = NOW()
    WHERE id = user_uuid;
    
    RETURN total_score;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error calculating performance score for user %: %', user_uuid, SQLERRM;
        RETURN 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update all performance scores
CREATE OR REPLACE FUNCTION update_all_performance_scores()
RETURNS INTEGER AS $$
DECLARE
    user_record RECORD;
    updated_count INTEGER := 0;
BEGIN
    FOR user_record IN 
        SELECT id FROM users WHERE role = 'ambassador' AND status = 'active'
    LOOP
        PERFORM calculate_performance_score(user_record.id);
        updated_count := updated_count + 1;
    END LOOP;
    
    RAISE NOTICE 'Updated performance scores for % ambassadors', updated_count;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- MAINTENANCE & CLEANUP FUNCTIONS
-- ================================================

-- Function to archive old data
CREATE OR REPLACE FUNCTION archive_old_data(archive_before_date DATE DEFAULT NULL)
RETURNS TABLE(
    table_name TEXT,
    archived_count INTEGER
) AS $$
DECLARE
    cutoff_date DATE;
    archived_visits INTEGER;
    archived_tasks INTEGER;
    archived_events INTEGER;
BEGIN
    cutoff_date := COALESCE(archive_before_date, CURRENT_DATE - INTERVAL '2 years');
    
    -- Archive old visits (move to archive table or mark as archived)
    UPDATE visits 
    SET updated_at = NOW()
    WHERE visit_date < cutoff_date;
    
    GET DIAGNOSTICS archived_visits = ROW_COUNT;
    
    -- Archive completed tasks older than cutoff
    UPDATE tasks 
    SET updated_at = NOW()
    WHERE status = 'Completed' 
    AND completed_date < cutoff_date;
    
    GET DIAGNOSTICS archived_tasks = ROW_COUNT;
    
    -- Archive old events
    UPDATE events 
    SET updated_at = NOW()
    WHERE event_date < cutoff_date 
    AND status = 'completed';
    
    GET DIAGNOSTICS archived_events = ROW_COUNT;
    
    RETURN QUERY VALUES 
        ('visits'::TEXT, archived_visits),
        ('tasks'::TEXT, archived_tasks),
        ('events'::TEXT, archived_events);
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- SCHEDULER COMPATIBLE FUNCTIONS
-- ================================================

-- Daily maintenance function
CREATE OR REPLACE FUNCTION daily_maintenance()
RETURNS VOID AS $$
BEGIN
    -- Update performance scores
    PERFORM update_all_performance_scores();
    
    -- Check for overdue tasks
    UPDATE tasks 
    SET status = 'Overdue', updated_at = NOW()
    WHERE due_date < CURRENT_DATE 
    AND status IN ('Pending', 'In Progress');
    
    -- Clean up old notifications (if table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
        DELETE FROM notifications 
        WHERE created_at < CURRENT_DATE - INTERVAL '30 days'
        AND is_read = true;
    END IF;
    
    RAISE NOTICE 'Daily maintenance completed at %', NOW();
END;
$$ LANGUAGE plpgsql;

-- Create maintenance schedule (if pg_cron is available)
-- SELECT cron.schedule('daily-maintenance', '0 2 * * *', 'SELECT daily_maintenance();');