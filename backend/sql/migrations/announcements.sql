-- ================================================
-- HELPER FUNCTIONS (in public schema)
-- ================================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT role FROM users WHERE id = auth.uid()
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get current user's country
CREATE OR REPLACE FUNCTION get_current_user_country()
RETURNS TEXT AS $$
BEGIN
    RETURN (
        SELECT country_code FROM users WHERE id = auth.uid()
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ================================================
-- ANNOUNCEMENTS SYSTEM
-- ================================================

-- Main announcements table
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    summary VARCHAR(500), -- Short summary for previews
    type VARCHAR(50) DEFAULT 'general' CHECK (type IN ('general', 'urgent', 'maintenance', 'update', 'event', 'policy', 'celebration')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived', 'expired')),
    
    -- Targeting options
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'management', 'country_leads', 'ambassadors', 'support', 'custom')),
    target_countries VARCHAR(3)[], -- Array of country codes
    target_regions VARCHAR(100)[], -- Array of regions
    target_roles VARCHAR(50)[], -- Array of roles
    target_users UUID[], -- Specific user IDs for custom targeting
    
    -- Scheduling and visibility
    publish_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    featured BOOLEAN DEFAULT FALSE, -- Show prominently
    pinned BOOLEAN DEFAULT FALSE, -- Keep at top
    send_notification BOOLEAN DEFAULT TRUE, -- Create notifications for users
    send_email BOOLEAN DEFAULT FALSE, -- Send email notifications
    
    -- Content and media
    banner_image_url TEXT,
    attachment_urls TEXT[], -- Multiple file attachments
    tags TEXT[], -- For categorization and search
    
    -- Engagement tracking
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Metadata
    author_id UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id), -- For approval workflow
    approved_at TIMESTAMP,
    edited_at TIMESTAMP,
    editor_id UUID REFERENCES users(id),
    
    -- Rich content support
    content_format VARCHAR(20) DEFAULT 'markdown' CHECK (content_format IN ('plain', 'markdown', 'html')),
    call_to_action JSONB DEFAULT '{}', -- Button text, URL, etc.
    metadata JSONB DEFAULT '{}', -- Additional flexible data
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User-announcement interactions (views, likes, etc.)
CREATE TABLE announcement_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interaction_type VARCHAR(20) NOT NULL CHECK (interaction_type IN ('view', 'like', 'bookmark', 'share', 'click_cta')),
    interaction_data JSONB DEFAULT '{}', -- Additional context (e.g., share platform, click details)
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(announcement_id, user_id, interaction_type)
);

-- Comments on announcements
CREATE TABLE announcement_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES announcement_comments(id), -- For replies
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE, -- Pin important comments
    is_hidden BOOLEAN DEFAULT FALSE, -- Hide inappropriate comments
    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Comment likes
CREATE TABLE announcement_comment_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comment_id UUID NOT NULL REFERENCES announcement_comments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

-- Read receipts to track who has seen announcements
CREATE TABLE announcement_read_receipts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    announcement_id UUID NOT NULL REFERENCES announcements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    read_at TIMESTAMP DEFAULT NOW(),
    read_duration INTEGER, -- Time spent reading (seconds)
    read_percentage INTEGER DEFAULT 100 CHECK (read_percentage >= 0 AND read_percentage <= 100),
    UNIQUE(announcement_id, user_id)
);

-- ================================================
-- INDEXES FOR PERFORMANCE
-- ================================================

-- Announcements indexes
CREATE INDEX idx_announcements_status ON announcements(status);
CREATE INDEX idx_announcements_type ON announcements(type);
CREATE INDEX idx_announcements_priority ON announcements(priority);
CREATE INDEX idx_announcements_target_audience ON announcements(target_audience);
CREATE INDEX idx_announcements_publish_at ON announcements(publish_at);
CREATE INDEX idx_announcements_expires_at ON announcements(expires_at);
CREATE INDEX idx_announcements_featured ON announcements(featured);
CREATE INDEX idx_announcements_pinned ON announcements(pinned);
CREATE INDEX idx_announcements_author ON announcements(author_id);
CREATE INDEX idx_announcements_countries ON announcements USING GIN(target_countries);
CREATE INDEX idx_announcements_regions ON announcements USING GIN(target_regions);
CREATE INDEX idx_announcements_roles ON announcements USING GIN(target_roles);
CREATE INDEX idx_announcements_users ON announcements USING GIN(target_users);
CREATE INDEX idx_announcements_tags ON announcements USING GIN(tags);

-- Interactions indexes
CREATE INDEX idx_announcement_interactions_announcement ON announcement_interactions(announcement_id);
CREATE INDEX idx_announcement_interactions_user ON announcement_interactions(user_id);
CREATE INDEX idx_announcement_interactions_type ON announcement_interactions(interaction_type);
CREATE INDEX idx_announcement_interactions_created ON announcement_interactions(created_at);

-- Comments indexes
CREATE INDEX idx_announcement_comments_announcement ON announcement_comments(announcement_id);
CREATE INDEX idx_announcement_comments_user ON announcement_comments(user_id);
CREATE INDEX idx_announcement_comments_parent ON announcement_comments(parent_comment_id);
CREATE INDEX idx_announcement_comments_created ON announcement_comments(created_at);
CREATE INDEX idx_announcement_comments_pinned ON announcement_comments(is_pinned);

-- Read receipts indexes
CREATE INDEX idx_announcement_read_receipts_announcement ON announcement_read_receipts(announcement_id);
CREATE INDEX idx_announcement_read_receipts_user ON announcement_read_receipts(user_id);
CREATE INDEX idx_announcement_read_receipts_read_at ON announcement_read_receipts(read_at);

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================

-- Enable RLS on all tables
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_comment_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcement_read_receipts ENABLE ROW LEVEL SECURITY;

-- Announcements policies
CREATE POLICY "Published announcements are viewable by targeted users" ON announcements
  FOR SELECT USING (
    status = 'published' 
    AND (expires_at IS NULL OR expires_at > NOW())
    AND publish_at <= NOW()
    AND (
      target_audience = 'all' OR
      (target_audience = 'management' AND 
       EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'management')) OR
      (target_audience = 'country_leads' AND 
       EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'country_lead')) OR
      (target_audience = 'ambassadors' AND 
       EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'ambassador')) OR
      (target_audience = 'support' AND 
       EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'support')) OR
      (target_audience = 'custom' AND auth.uid() = ANY(target_users)) OR
      (target_countries IS NOT NULL AND 
       EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND country_code = ANY(target_countries))) OR
      (target_roles IS NOT NULL AND 
       EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = ANY(target_roles)))
    )
  );

CREATE POLICY "Management and support can view all announcements" ON announcements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('management', 'support')
    )
  );

CREATE POLICY "Authors can view their own announcements" ON announcements
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Management can create announcements" ON announcements
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('management', 'support')
    ) AND
    auth.uid() = author_id
  );

CREATE POLICY "Authors and management can update announcements" ON announcements
  FOR UPDATE USING (
    auth.uid() = author_id OR 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'management'
    )
  );

CREATE POLICY "Management can delete announcements" ON announcements
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role = 'management'
    )
  );

-- Interaction policies
CREATE POLICY "Users can view interactions on accessible announcements" ON announcement_interactions
  FOR SELECT USING (
    announcement_id IN (
      SELECT id FROM announcements
      WHERE status = 'published' 
      AND (expires_at IS NULL OR expires_at > NOW())
      AND publish_at <= NOW()
    )
  );

CREATE POLICY "Users can create their own interactions" ON announcement_interactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interactions" ON announcement_interactions
  FOR UPDATE USING (auth.uid() = user_id);

-- Comment policies
CREATE POLICY "Users can view comments on accessible announcements" ON announcement_comments
  FOR SELECT USING (
    NOT is_hidden AND
    announcement_id IN (
      SELECT id FROM announcements
      WHERE status = 'published' 
      AND (expires_at IS NULL OR expires_at > NOW())
    )
  );

CREATE POLICY "Users can create comments on accessible announcements" ON announcement_comments
  FOR INSERT WITH CHECK (
    auth.uid() = user_id AND
    announcement_id IN (
      SELECT id FROM announcements
      WHERE status = 'published' 
      AND (expires_at IS NULL OR expires_at > NOW())
    )
  );

CREATE POLICY "Users can update their own comments" ON announcement_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Management can moderate comments" ON announcement_comments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('management', 'support')
    )
  );

-- Comment likes policies
CREATE POLICY "Users can view comment likes" ON announcement_comment_likes
  FOR SELECT USING (TRUE);

CREATE POLICY "Users can like comments" ON announcement_comment_likes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike comments" ON announcement_comment_likes
  FOR DELETE USING (auth.uid() = user_id);

-- Read receipts policies
CREATE POLICY "Users can view their own read receipts" ON announcement_read_receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Management can view all read receipts" ON announcement_read_receipts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() 
      AND role IN ('management', 'support')
    )
  );

CREATE POLICY "Users can create their own read receipts" ON announcement_read_receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own read receipts" ON announcement_read_receipts
  FOR UPDATE USING (auth.uid() = user_id);

-- ================================================
-- FUNCTIONS AND TRIGGERS
-- ================================================

-- Function to get announcements for a specific user
CREATE OR REPLACE FUNCTION get_user_announcements(
    user_uuid UUID,
    include_read BOOLEAN DEFAULT TRUE,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE(
    id UUID,
    title VARCHAR(255),
    content TEXT,
    summary VARCHAR(500),
    type VARCHAR(50),
    priority VARCHAR(20),
    featured BOOLEAN,
    pinned BOOLEAN,
    banner_image_url TEXT,
    attachment_urls TEXT[],
    tags TEXT[],
    call_to_action JSONB,
    publish_at TIMESTAMP,
    expires_at TIMESTAMP,
    author_name VARCHAR(255),
    view_count INTEGER,
    like_count INTEGER,
    comment_count INTEGER,
    is_read BOOLEAN,
    is_liked BOOLEAN,
    read_at TIMESTAMP
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.id,
        a.title,
        a.content,
        a.summary,
        a.type,
        a.priority,
        a.featured,
        a.pinned,
        a.banner_image_url,
        a.attachment_urls,
        a.tags,
        a.call_to_action,
        a.publish_at,
        a.expires_at,
        u.full_name as author_name,
        a.view_count,
        a.like_count,
        a.comment_count,
        (arr.user_id IS NOT NULL) as is_read,
        (ai.user_id IS NOT NULL) as is_liked,
        arr.read_at
    FROM announcements a
    JOIN users u ON a.author_id = u.id
    LEFT JOIN announcement_read_receipts arr ON a.id = arr.announcement_id AND arr.user_id = user_uuid
    LEFT JOIN announcement_interactions ai ON a.id = ai.announcement_id AND ai.user_id = user_uuid AND ai.interaction_type = 'like'
    WHERE a.status = 'published'
    AND (a.expires_at IS NULL OR a.expires_at > NOW())
    AND a.publish_at <= NOW()
    AND (
        include_read = TRUE OR 
        arr.user_id IS NULL
    )
    ORDER BY 
        a.pinned DESC,
        a.featured DESC,
        a.priority DESC,
        a.publish_at DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark announcement as read
CREATE OR REPLACE FUNCTION mark_announcement_read(
    announcement_uuid UUID,
    user_uuid UUID,
    read_duration_seconds INTEGER DEFAULT NULL,
    read_percentage_value INTEGER DEFAULT 100
)
RETURNS BOOLEAN AS $$
DECLARE
    read_receipt_id UUID;
BEGIN
    -- Insert or update read receipt
    INSERT INTO announcement_read_receipts (
        announcement_id, 
        user_id, 
        read_duration, 
        read_percentage
    ) VALUES (
        announcement_uuid, 
        user_uuid, 
        read_duration_seconds, 
        read_percentage_value
    )
    ON CONFLICT (announcement_id, user_id) 
    DO UPDATE SET
        read_at = NOW(),
        read_duration = COALESCE(read_duration_seconds, announcement_read_receipts.read_duration),
        read_percentage = GREATEST(announcement_read_receipts.read_percentage, read_percentage_value)
    RETURNING id INTO read_receipt_id;
    
    -- Track view interaction
    INSERT INTO announcement_interactions (
        announcement_id,
        user_id,
        interaction_type,
        interaction_data
    ) VALUES (
        announcement_uuid,
        user_uuid,
        'view',
        jsonb_build_object(
            'read_duration', read_duration_seconds,
            'read_percentage', read_percentage_value
        )
    )
    ON CONFLICT (announcement_id, user_id, interaction_type) 
    DO UPDATE SET
        interaction_data = jsonb_build_object(
            'read_duration', read_duration_seconds,
            'read_percentage', read_percentage_value,
            'last_viewed', NOW()
        );
    
    RETURN read_receipt_id IS NOT NULL;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error marking announcement as read: %', SQLERRM;
        RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update engagement counters
CREATE OR REPLACE FUNCTION update_announcement_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'announcement_interactions' THEN
        IF TG_OP = 'INSERT' THEN
            IF NEW.interaction_type = 'like' THEN
                UPDATE announcements 
                SET like_count = like_count + 1, updated_at = NOW()
                WHERE id = NEW.announcement_id;
            ELSIF NEW.interaction_type = 'view' THEN
                UPDATE announcements 
                SET view_count = view_count + 1, updated_at = NOW()
                WHERE id = NEW.announcement_id;
            END IF;
        ELSIF TG_OP = 'DELETE' THEN
            IF OLD.interaction_type = 'like' THEN
                UPDATE announcements 
                SET like_count = GREATEST(0, like_count - 1), updated_at = NOW()
                WHERE id = OLD.announcement_id;
            END IF;
        END IF;
    ELSIF TG_TABLE_NAME = 'announcement_comments' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE announcements 
            SET comment_count = comment_count + 1, updated_at = NOW()
            WHERE id = NEW.announcement_id;
            
            -- Update reply count for parent comment
            IF NEW.parent_comment_id IS NOT NULL THEN
                UPDATE announcement_comments 
                SET reply_count = reply_count + 1, updated_at = NOW()
                WHERE id = NEW.parent_comment_id;
            END IF;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE announcements 
            SET comment_count = GREATEST(0, comment_count - 1), updated_at = NOW()
            WHERE id = OLD.announcement_id;
            
            -- Update reply count for parent comment
            IF OLD.parent_comment_id IS NOT NULL THEN
                UPDATE announcement_comments 
                SET reply_count = GREATEST(0, reply_count - 1), updated_at = NOW()
                WHERE id = OLD.parent_comment_id;
            END IF;
        END IF;
    ELSIF TG_TABLE_NAME = 'announcement_comment_likes' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE announcement_comments 
            SET like_count = like_count + 1, updated_at = NOW()
            WHERE id = NEW.comment_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE announcement_comments 
            SET like_count = GREATEST(0, like_count - 1), updated_at = NOW()
            WHERE id = OLD.comment_id;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error updating announcement counters: %', SQLERRM;
        RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for counter updates
CREATE TRIGGER update_announcement_interaction_counters
    AFTER INSERT OR DELETE ON announcement_interactions
    FOR EACH ROW EXECUTE FUNCTION update_announcement_counters();

CREATE TRIGGER update_announcement_comment_counters
    AFTER INSERT OR DELETE ON announcement_comments
    FOR EACH ROW EXECUTE FUNCTION update_announcement_counters();

CREATE TRIGGER update_comment_like_counters
    AFTER INSERT OR DELETE ON announcement_comment_likes
    FOR EACH ROW EXECUTE FUNCTION update_announcement_counters();

-- Function to auto-create notifications when announcements are published (simplified)
CREATE OR REPLACE FUNCTION create_announcement_notifications()
RETURNS TRIGGER AS $$
DECLARE
    target_user_ids UUID[];
    user_id UUID;
BEGIN
    -- Only process when announcement is published and notifications are enabled
    IF NEW.status = 'published' AND NEW.send_notification = TRUE AND 
       (OLD IS NULL OR OLD.status != 'published') THEN
        
        -- Get target user IDs based on targeting criteria
        IF NEW.target_audience = 'all' THEN
            SELECT ARRAY_AGG(id) INTO target_user_ids
            FROM users WHERE status = 'active';
        ELSIF NEW.target_audience = 'custom' AND NEW.target_users IS NOT NULL THEN
            target_user_ids := NEW.target_users;
        ELSE
            SELECT ARRAY_AGG(u.id) INTO target_user_ids
            FROM users u
            WHERE u.status = 'active'
            AND (
                (NEW.target_audience != 'custom' AND u.role = NEW.target_audience) OR
                (NEW.target_countries IS NOT NULL AND u.country_code = ANY(NEW.target_countries)) OR
                (NEW.target_roles IS NOT NULL AND u.role = ANY(NEW.target_roles))
            );
        END IF;
        
        -- Only create notifications if notifications table exists
        IF target_user_ids IS NOT NULL AND EXISTS (
            SELECT 1 FROM information_schema.tables 
            WHERE table_name = 'notifications' AND table_schema = 'public'
        ) THEN
            FOREACH user_id IN ARRAY target_user_ids
            LOOP
                BEGIN
                    INSERT INTO notifications (
                        user_id,
                        type,
                        category,
                        title,
                        message,
                        priority,
                        action_url,
                        action_text,
                        related_entity_type,
                        related_entity_id,
                        metadata
                    ) VALUES (
                        user_id,
                        CASE NEW.type
                            WHEN 'urgent' THEN 'warning'
                            WHEN 'maintenance' THEN 'info'
                            ELSE 'info'
                        END,
                        'announcement',
                        '📢 ' || NEW.title,
                        COALESCE(NEW.summary, LEFT(NEW.content, 200) || '...'),
                        CASE NEW.priority
                            WHEN 'urgent' THEN 'urgent'
                            WHEN 'high' THEN 'high'
                            ELSE 'normal'
                        END,
                        '/announcements/' || NEW.id,
                        'Read More',
                        'announcement',
                        NEW.id,
                        jsonb_build_object(
                            'announcement_type', NEW.type,
                            'featured', NEW.featured,
                            'pinned', NEW.pinned
                        )
                    );
                EXCEPTION
                    WHEN OTHERS THEN
                        -- Skip this notification if it fails
                        CONTINUE;
                END;
            END LOOP;
        END IF;
    END IF;
    
    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        RAISE WARNING 'Error creating announcement notifications: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for notification creation
CREATE TRIGGER create_announcement_notifications_trigger
    AFTER INSERT OR UPDATE ON announcements
    FOR EACH ROW EXECUTE FUNCTION create_announcement_notifications();

-- Function to get announcement analytics
CREATE OR REPLACE FUNCTION get_announcement_analytics(
    announcement_uuid UUID DEFAULT NULL,
    date_from DATE DEFAULT NULL,
    date_to DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE(
    announcement_id UUID,
    announcement_title VARCHAR(255),
    total_views INTEGER,
    unique_views INTEGER,
    total_likes INTEGER,
    total_comments INTEGER,
    read_rate DECIMAL(5,2),
    engagement_rate DECIMAL(5,2),
    avg_read_time INTEGER
) AS $$
DECLARE
    start_date DATE;
BEGIN
    start_date := COALESCE(date_from, CURRENT_DATE - INTERVAL '30 days');
    
    RETURN QUERY
    SELECT
        a.id,
        a.title,
        a.view_count,
        (SELECT COUNT(DISTINCT user_id) FROM announcement_interactions 
         WHERE announcement_id = a.id AND interaction_type = 'view')::INTEGER,
        a.like_count,
        a.comment_count,
        CASE 
            WHEN a.view_count > 0 
            THEN ROUND((SELECT COUNT(*) FROM announcement_read_receipts WHERE announcement_id = a.id)::DECIMAL / a.view_count * 100, 2)
            ELSE 0
        END,
        CASE 
            WHEN a.view_count > 0 
            THEN ROUND((a.like_count + a.comment_count)::DECIMAL / a.view_count * 100, 2)
            ELSE 0
        END,
        COALESCE((SELECT AVG(read_duration) FROM announcement_read_receipts WHERE announcement_id = a.id), 0)::INTEGER
    FROM announcements a
    WHERE (announcement_uuid IS NULL OR a.id = announcement_uuid)
    AND a.publish_at BETWEEN start_date AND date_to + INTERVAL '1 day'
    ORDER BY a.publish_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old announcements
CREATE OR REPLACE FUNCTION cleanup_old_announcements(retention_days INTEGER DEFAULT 365)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Archive old announcements (move to archive status instead of deleting)
    UPDATE announcements 
    SET status = 'archived', updated_at = NOW()
    WHERE status = 'published'
    AND (expires_at < NOW() - INTERVAL '1 day' * retention_days
         OR created_at < NOW() - INTERVAL '1 day' * retention_days);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    RAISE NOTICE 'Archived % old announcements', deleted_count;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- VIEWS FOR EASIER QUERYING
-- ================================================

-- View for active announcements with author info
CREATE VIEW active_announcements AS
SELECT
    a.*,
    u.full_name as author_name,
    u.avatar_url as author_avatar,
    c.name as author_country
FROM announcements a
JOIN users u ON a.author_id = u.id
LEFT JOIN countries c ON u.country_code = c.code
WHERE a.status = 'published'
AND (a.expires_at IS NULL OR a.expires_at > NOW())
AND a.publish_at <= NOW()
ORDER BY a.pinned DESC, a.featured DESC, a.priority DESC, a.publish_at DESC;

-- View for announcement engagement summary
CREATE VIEW announcement_engagement_summary AS
SELECT
    a.id,
    a.title,
    a.type,
    a.publish_at,
    a.view_count,
    a.like_count,
    a.comment_count,
    COUNT(DISTINCT arr.user_id) as readers_count,
    ROUND(AVG(arr.read_percentage), 2) as avg_read_percentage,
    ROUND(AVG(arr.read_duration), 2) as avg_read_duration_seconds
FROM announcements a
LEFT JOIN announcement_read_receipts arr ON a.id = arr.announcement_id
WHERE a.status = 'published'
GROUP BY a.id, a.title, a.type, a.publish_at, a.view_count, a.like_count, a.comment_count;