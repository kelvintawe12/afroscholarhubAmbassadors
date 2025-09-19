-- Audit log table to track all user actions and data changes
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_values JSONB,
    new_values JSONB,
    changed_fields TEXT[],
    user_id UUID REFERENCES users(id),
    user_role VARCHAR(20),
    user_country_code VARCHAR(3),
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for audit logs
CREATE INDEX idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX idx_audit_logs_record_id ON audit_logs(record_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Enable RLS on audit logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Audit log policies - management and support can view all, others can view their own actions
CREATE POLICY "Management and support can view all audit logs" ON audit_logs
  FOR SELECT USING (auth.user_role() IN ('management', 'support'));

CREATE POLICY "Users can view their own audit logs" ON audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_table_name TEXT,
    p_record_id UUID,
    p_action TEXT,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_changed_fields TEXT[] DEFAULT NULL
) RETURNS VOID AS $$
DECLARE
    v_user_id UUID;
    v_user_role TEXT;
    v_user_country TEXT;
BEGIN
    -- Get current user info
    v_user_id := auth.uid();
    v_user_role := auth.user_role();
    v_user_country := auth.user_country();

    -- Insert audit log
    INSERT INTO audit_logs (
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        changed_fields,
        user_id,
        user_role,
        user_country_code
    ) VALUES (
        p_table_name,
        p_record_id,
        p_action,
        p_old_values,
        p_new_values,
        p_changed_fields,
        v_user_id,
        v_user_role,
        v_user_country
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
