-- ================================================
-- COMPLETE SEED DATA FOR AFROSCHOLARHUB AMBASSADORS
-- ================================================
-- This file contains comprehensive seed data for all tables
-- to support the full application functionality

-- ================================================
-- COUNTRIES DATA
-- ================================================

INSERT INTO countries (code, name, flag_emoji, currency, timezone, active, settings) VALUES
('USA', 'United States', '🇺🇸', 'USD', 'America/New_York', true, '{"region": "North America", "language": "en"}'),
('KEN', 'Kenya', '🇰🇪', 'KES', 'Africa/Nairobi', true, '{"region": "East Africa", "language": "en"}'),
('NGA', 'Nigeria', '🇳🇬', 'NGN', 'Africa/Lagos', true, '{"region": "West Africa", "language": "en"}'),
('ZAF', 'South Africa', '🇿🇦', 'ZAR', 'Africa/Johannesburg', true, '{"region": "Southern Africa", "language": "en"}'),
('GHA', 'Ghana', '🇬🇭', 'GHS', 'Africa/Accra', true, '{"region": "West Africa", "language": "en"}'),
('ETH', 'Ethiopia', '🇪🇹', 'ETB', 'Africa/Addis_Ababa', true, '{"region": "East Africa", "language": "en"}'),
('UGA', 'Uganda', '🇺🇬', 'UGX', 'Africa/Kampala', true, '{"region": "East Africa", "language": "en"}'),
('TZA', 'Tanzania', '🇹🇿', 'TZS', 'Africa/Dar_es_Salaam', true, '{"region": "East Africa", "language": "en"}');

-- ================================================
-- USERS DATA (Matching LoginPage.tsx demo accounts)
-- ================================================

-- Management user (COO)
INSERT INTO users (id, email, full_name, role, country_code, status, onboarding_completed, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'coo@afroscholarhub.org', 'Chief Operating Officer', 'management', NULL, 'active', true, '{"theme": "dark", "notifications": true}');

-- Country lead (Nigeria)
INSERT INTO users (id, email, full_name, role, country_code, status, onboarding_completed, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'aisha.lead@afroscholarhub.org', 'Aisha Okafor', 'country_lead', 'NGA', 'active', true, '{"theme": "light", "notifications": true}');

-- Ambassador
INSERT INTO users (id, email, full_name, role, country_code, status, onboarding_completed, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'john.amb@afroscholarhub.org', 'John Ambassador', 'ambassador', 'NGA', 'active', true, '{"theme": "light", "notifications": true}');

-- Additional users for comprehensive testing
INSERT INTO users (id, email, full_name, role, country_code, status, onboarding_completed, preferences) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'sarah.johnson@afroscholarhub.org', 'Sarah Johnson', 'country_lead', 'USA', 'active', true, '{"theme": "light", "notifications": true}'),
('550e8400-e29b-41d4-a716-446655440004', 'david.kiprop@afroscholarhub.org', 'David Kiprop', 'country_lead', 'KEN', 'active', true, '{"theme": "light", "notifications": true}'),
('550e8400-e29b-41d4-a716-446655440005', 'thabo.nkosi@afroscholarhub.org', 'Thabo Nkosi', 'country_lead', 'ZAF', 'active', true, '{"theme": "light", "notifications": true}'),
('550e8400-e29b-41d4-a716-446655440006', 'grace.mwangi@afroscholarhub.org', 'Grace Mwangi', 'ambassador', 'KEN', 'active', true, '{"theme": "light", "notifications": true}'),
('550e8400-e29b-41d4-a716-446655440007', 'chinedu.adebayo@afroscholarhub.org', 'Chinedu Adebayo', 'ambassador', 'NGA', 'active', true, '{"theme": "light", "notifications": true}'),
('550e8400-e29b-41d4-a716-446655440008', 'support@afroscholarhub.org', 'Support Team', 'support', NULL, 'active', true, '{"theme": "light", "notifications": true}');

-- Update countries with lead IDs
UPDATE countries SET lead_id = '550e8400-e29b-41d4-a716-446655440003' WHERE code = 'USA';
UPDATE countries SET lead_id = '550e8400-e29b-41d4-a716-446655440004' WHERE code = 'KEN';
UPDATE countries SET lead_id = '550e8400-e29b-41d4-a716-446655440001' WHERE code = 'NGA';
UPDATE countries SET lead_id = '550e8400-e29b-41d4-a716-446655440005' WHERE code = 'ZAF';

-- ================================================
-- SCHOOLS DATA
-- ================================================

INSERT INTO schools (id, name, location, address, city, country_code, region, type, status, contact_person, contact_email, contact_phone, student_count, ambassador_id, notes, score, conversion_probability, potential, facilities, demographics, challenges, opportunities, metadata) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Lincoln High School', 'Springfield, IL', '123 Main St, Springfield, IL 62701', 'Springfield', 'USA', 'Midwest', 'secondary', 'partnered', 'Principal Adams', 'adams@lincoln.edu', '+1-217-555-0123', 1200, '550e8400-e29b-41d4-a716-446655440002', 'Excellent STEM program already in place', 85, 95, 'high', '{"library": true, "computer_lab": true, "internet": true, "science_lab": true}', '{"age_groups": {"13-15": 40, "16-18": 60}, "gender_distribution": {"male": 48, "female": 52}}', ARRAY['Limited international partnerships', 'Budget constraints'], ARRAY['Strong community support', 'Active alumni network'], '{"partnership_date": "2023-09-15", "last_contact": "2024-01-15"}'),
('660e8400-e29b-41d4-a716-446655440001', 'Washington Elementary', 'Seattle, WA', '456 Oak Ave, Seattle, WA 98101', 'Seattle', 'USA', 'West', 'primary', 'visited', 'Principal Brown', 'brown@washington.edu', '+1-206-555-0456', 450, '550e8400-e29b-41d4-a716-446655440002', 'Very interested in digital literacy programs', 70, 75, 'medium', '{"library": true, "computer_lab": true, "internet": true}', '{"age_groups": {"5-8": 60, "9-12": 40}, "gender_distribution": {"male": 50, "female": 50}}', ARRAY['Technology access inequality'], ARRAY['Strong parental involvement', 'Community center nearby'], '{"last_visit": "2024-01-20", "next_action": "Follow-up meeting"}'),
('660e8400-e29b-41d4-a716-446655440002', 'Nairobi International School', 'Nairobi', 'Westlands Road, Nairobi, Kenya', 'Nairobi', 'KEN', 'Nairobi', 'secondary', 'partnered', 'Principal Kiprop', 'kiprop@nairobi.edu', '+254-20-555-0123', 950, '550e8400-e29b-41d4-a716-446655440006', 'Leading school in international education', 90, 98, 'high', '{"library": true, "computer_lab": true, "internet": true, "science_lab": true, "language_lab": true}', '{"age_groups": {"13-15": 45, "16-18": 55}, "gender_distribution": {"male": 47, "female": 53}}', ARRAY['High operational costs'], ARRAY['Strong international partnerships', 'Excellent facilities'], '{"partnership_date": "2023-08-20", "programs": ["STEM", "Leadership"]}'),
('660e8400-e29b-41d4-a716-446655440003', 'Lagos Grammar School', 'Lagos', 'Victoria Island, Lagos, Nigeria', 'Lagos', 'NGA', 'Lagos', 'secondary', 'partnered', 'Principal Adebayo', 'adebayo@lagos.edu', '+234-1-555-0123', 1100, '550e8400-e29b-41d4-a716-446655440007', 'Premier school with strong academic reputation', 88, 92, 'high', '{"library": true, "computer_lab": true, "internet": true, "science_lab": true, "auditorium": true}', '{"age_groups": {"12-15": 50, "16-18": 50}, "gender_distribution": {"male": 51, "female": 49}}', ARRAY['Traffic congestion affects scheduling'], ARRAY['Business community connections', 'Alumni in tech industry'], '{"partnership_date": "2023-10-05", "focus_areas": ["Technology", "Business"]}'),
('660e8400-e29b-41d4-a716-446655440004', 'Abuja International School', 'Abuja', 'Wuse II, Abuja, Nigeria', 'Abuja', 'NGA', 'FCT', 'primary', 'prospect', 'Principal Okoro', 'okoro@abuja.edu', '+234-9-555-0456', 750, '550e8400-e29b-41d4-a716-446655440002', 'Modern facilities, government school', 65, 70, 'medium', '{"library": true, "computer_lab": true, "internet": true, "playground": true}', '{"age_groups": {"4-8": 55, "9-12": 45}, "gender_distribution": {"male": 50, "female": 50}}', ARRAY['Bureaucratic processes'], ARRAY['Government partnerships', 'Central location'], '{"initial_contact": "2024-01-15", "priority": "high"}');

-- ================================================
-- VISITS DATA
-- ================================================

INSERT INTO visits (id, school_id, ambassador_id, visit_date, start_time, end_time, duration_minutes, students_reached, activities, notes, photos, documents, leads_generated, feedback, follow_up_required, follow_up_date, weather_conditions, transportation_used, challenges_faced, success_metrics, status) VALUES
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', '2024-01-15', '09:00:00', '11:00:00', 120, 150, ARRAY['STEM Workshop', 'Career Guidance'], 'Great engagement with students, teachers very receptive', ARRAY['https://photos.afroscholarhub.com/visit1_1.jpg', 'https://photos.afroscholarhub.com/visit1_2.jpg'], ARRAY['https://docs.afroscholarhub.com/attendance_sheet.pdf'], 25, '{"rating": 5, "comments": "Excellent session, students were very engaged"}', true, '2024-02-15', 'Clear skies, 15°C', 'Personal vehicle', ARRAY['Parking was limited'], '{"engagement_rate": 0.85, "knowledge_gain": 0.78, "interest_level": 0.92}', 'completed'),
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', '2024-01-20', '10:00:00', '11:30:00', 90, 80, ARRAY['Digital Literacy Session'], 'Students showed high interest, some had basic coding experience already', ARRAY['https://photos.afroscholarhub.com/visit2_1.jpg'], ARRAY['https://docs.afroscholarhub.com/session_notes.pdf'], 15, '{"rating": 4, "comments": "Good foundation, need more advanced content"}', true, '2024-02-10', 'Overcast, 12°C', 'Public transport', ARRAY['Late arrival due to traffic'], '{"engagement_rate": 0.78, "knowledge_gain": 0.65, "interest_level": 0.88}', 'completed'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', '2024-01-25', '08:30:00', '11:00:00', 150, 200, ARRAY['Science Fair', 'Mentorship Program'], 'Very successful visit, students presented amazing projects', ARRAY['https://photos.afroscholarhub.com/visit3_1.jpg', 'https://photos.afroscholarhub.com/visit3_2.jpg', 'https://photos.afroscholarhub.com/visit3_3.jpg'], ARRAY['https://docs.afroscholarhub.com/project_presentations.pdf'], 45, '{"rating": 5, "comments": "Outstanding student projects, very impressed"}', false, NULL, 'Sunny, 28°C', 'School transport', ARRAY['None'], '{"engagement_rate": 0.95, "knowledge_gain": 0.88, "interest_level": 0.97}', 'completed');

-- ================================================
-- TASKS DATA
-- ================================================

INSERT INTO tasks (id, title, description, priority, status, due_date, completed_date, progress, school_id, ambassador_id, created_by, assignor_id, tags, attachments, estimated_hours, actual_hours, dependencies, watchers, recurring_pattern, parent_task_id) VALUES
('880e8400-e29b-41d4-a716-446655440000', 'Follow up with Lincoln High', 'Schedule next STEM workshop and follow up on partnership renewal', 'High', 'Pending', '2024-02-15', NULL, 25, '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', ARRAY['STEM', 'Workshop', 'Partnership'], ARRAY['https://docs.afroscholarhub.com/stem_proposal.pdf'], 8.0, NULL, ARRAY[], ARRAY['550e8400-e29b-41d4-a716-446655440001'], NULL, NULL),
('880e8400-e29b-41d4-a716-446655440001', 'Prepare workshop materials', 'Create presentation and materials for digital literacy workshop', 'Medium', 'In Progress', '2024-02-10', NULL, 60, '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', ARRAY['Digital', 'Literacy', 'Materials'], ARRAY['https://docs.afroscholarhub.com/workshop_slides.pptx'], 12.0, 7.5, ARRAY[], ARRAY['550e8400-e29b-41d4-a716-446655440001'], NULL, NULL),
('880e8400-e29b-41d4-a716-446655440002', 'Contact Nairobi International', 'Discuss partnership renewal and new program opportunities', 'High', 'Completed', '2024-01-30', '2024-01-28', 100, '660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', ARRAY['Partnership', 'Renewal', 'Programs'], ARRAY['https://docs.afroscholarhub.com/partnership_agreement.pdf'], 4.0, 3.5, ARRAY[], ARRAY['550e8400-e29b-41d4-a716-446655440004'], NULL, NULL);

-- ================================================
-- EVENTS DATA
-- ================================================

INSERT INTO events (id, name, description, event_date, start_time, end_time, location, address, country_code, region, event_type, expected_attendance, actual_attendance, budget, actual_cost, status, organizer_id, created_by, participants, speakers, agenda, resources_needed, equipment_needed, catering_required, registration_link, meeting_link, outcomes, feedback, photos, documents, social_media_posts) VALUES
('990e8400-e29b-41d4-a716-446655440000', 'STEM Career Day', 'Interactive STEM workshops for high school students featuring industry professionals', '2024-03-15', '09:00:00', '16:00:00', 'Lincoln High School', '123 Main St, Springfield, IL 62701', 'USA', 'Midwest', 'workshop', 200, NULL, 5000.00, NULL, 'planned', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '[{"name": "John Ambassador", "role": "facilitator"}, {"name": "Aisha Okafor", "role": "coordinator"}]', '[{"name": "Dr. Sarah Johnson", "topic": "Future of Technology"}, {"name": "Prof. Mike Wilson", "topic": "Engineering Careers"}]', '{"09:00-09:30": "Registration", "09:30-10:30": "Opening Keynote", "10:30-12:00": "Workshop Session 1", "12:00-13:00": "Lunch Break", "13:00-14:30": "Workshop Session 2", "14:30-15:30": "Panel Discussion", "15:30-16:00": "Closing"}', ARRAY['Projector', 'Microphones', 'Workshop materials'], ARRAY['Laptops (20)', 'Projector', 'Sound system', 'Whiteboards'], true, 'https://events.afroscholarhub.com/stem-career-day', NULL, NULL, '{}', ARRAY['https://photos.afroscholarhub.com/event1_promo.jpg'], ARRAY['https://docs.afroscholarhub.com/event_budget.xlsx'], ARRAY['https://twitter.com/afroscholarhub/status/123456']),
('990e8400-e29b-41d4-a716-446655440001', 'Digital Skills Workshop', 'Introduction to coding and digital tools for primary students', '2024-02-20', '10:00:00', '15:00:00', 'Nairobi International School', 'Westlands Road, Nairobi, Kenya', 'KEN', 'Nairobi', 'workshop', 150, NULL, 3000.00, NULL, 'planned', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440004', '[{"name": "Grace Mwangi", "role": "lead_facilitator"}, {"name": "David Kiprop", "role": "coordinator"}]', '[{"name": "Ms. Amina Hassan", "topic": "Basic Coding"}, {"name": "Mr. Peter Oduya", "topic": "Digital Safety"}]', '{"10:00-10:30": "Welcome and Icebreakers", "10:30-12:00": "Coding Basics", "12:00-13:00": "Lunch", "13:00-14:30": "Digital Tools", "14:30-15:00": "Q&A and Certificates"}', ARRAY['Coding software licenses', 'Tablets for students'], ARRAY['Tablets (30)', 'Projector', 'Internet connection', 'Coding software'], true, 'https://events.afroscholarhub.com/digital-skills', NULL, NULL, '{}', ARRAY['https://photos.afroscholarhub.com/digital_workshop.jpg'], ARRAY['https://docs.afroscholarhub.com/workshop_materials.zip'], ARRAY['https://facebook.com/afroscholarhub/posts/789012']);

-- ================================================
-- RESOURCES DATA
-- ================================================

INSERT INTO resources (id, title, description, category, sub_category, type, file_url, file_type, file_size, thumbnail_url, tags, country_specific, applicable_countries, access_level, featured, downloads, views, rating, rating_count, version, language, prerequisites, learning_objectives, duration_minutes, difficulty_level, created_by, approved_by, approved_at, expires_at) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', 'STEM Workshop Guide', 'Comprehensive guide for conducting STEM workshops in high schools', 'Education', 'STEM', 'guide', 'https://resources.afroscholarhub.com/stem-guide.pdf', 'pdf', 2048576, 'https://resources.afroscholarhub.com/thumbnails/stem-guide.jpg', ARRAY['STEM', 'Workshop', 'Guide', 'High School'], false, NULL, 'all', true, 245, 890, 4.8, 45, '2.1', 'en', ARRAY['Basic teaching experience'], ARRAY['Plan effective STEM workshops', 'Engage students in hands-on learning', 'Assess workshop outcomes'], NULL, 'intermediate', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', '2024-01-01 10:00:00', NULL),
('aa0e8400-e29b-41d4-a716-446655440001', 'Digital Literacy Curriculum', 'Complete curriculum for digital literacy programs in primary schools', 'Curriculum', 'Digital Literacy', 'document', 'https://resources.afroscholarhub.com/digital-curriculum.docx', 'docx', 1048576, 'https://resources.afroscholarhub.com/thumbnails/digital-curriculum.jpg', ARRAY['Digital', 'Literacy', 'Curriculum', 'Primary'], false, NULL, 'all', true, 189, 567, 4.6, 32, '1.5', 'en', ARRAY['Basic computer skills'], ARRAY['Teach fundamental digital skills', 'Promote digital citizenship', 'Prepare students for technology careers'], NULL, 'beginner', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', '2024-01-01 10:00:00', NULL),
('aa0e8400-e29b-41d4-a716-446655440002', 'Mentorship Program Video', 'Introduction video for mentorship programs and best practices', 'Training', 'Mentorship', 'video', 'https://resources.afroscholarhub.com/mentorship-intro.mp4', 'mp4', 52428800, 'https://resources.afroscholarhub.com/thumbnails/mentorship-intro.jpg', ARRAY['Mentorship', 'Video', 'Training', 'Best Practices'], false, NULL, 'ambassadors', false, 67, 234, 4.9, 18, '1.0', 'en', ARRAY['None'], ARRAY['Understand mentorship principles', 'Learn effective communication', 'Build successful mentor relationships'], 25, 'beginner', '550e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440000', '2024-01-01 10:00:00', NULL);

-- ================================================
-- TEAMS DATA
-- ================================================

INSERT INTO teams (id, name, description, country_code, region, lead_id, status, team_type, target_schools, current_schools, performance_score, goals, settings) VALUES
('bb0e8400-e29b-41d4-a716-446655440000', 'Nigeria Innovation Team', 'Innovation and technology programs in Nigeria', 'NGA', 'Lagos', '550e8400-e29b-41d4-a716-446655440001', 'active', 'specialist', 25, 10, 88, '{"schools_target": 25, "students_target": 4000, "workshops_target": 40}', '{"focus": "Innovation", "budget": 45000}'),
('bb0e8400-e29b-41d4-a716-446655440001', 'Kenya Education Team', 'Comprehensive education support in Kenya', 'KEN', 'Nairobi', '550e8400-e29b-41d4-a716-446655440004', 'active', 'general', 30, 15, 92, '{"schools_target": 30, "students_target": 6000, "workshops_target": 60}', '{"focus": "General Education", "budget": 60000}'),
('bb0e8400-e29b-41d4-a716-446655440002', 'USA STEM Team', 'Focused on STEM education in the United States', 'USA', 'Midwest', '550e8400-e29b-41d4-a716-446655440003', 'active', 'specialist', 20, 8, 85, '{"schools_target": 20, "students_target": 3000, "workshops_target": 30}', '{"focus": "STEM", "budget": 35000}');

-- ================================================
-- TEAM MEMBERS DATA
-- ================================================

INSERT INTO team_members (id, team_id, ambassador_id, role_in_team, status, joined_at, permissions) VALUES
('cc0e8400-e29b-41d4-a716-446655440000', 'bb0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'member', 'active', '2024-01-01 10:00:00', '{"can_create_tasks": true, "can_view_reports": true}'),
('cc0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440007', 'coordinator', 'active', '2024-01-01 10:00:00', '{"can_create_tasks": true, "can_manage_members": true, "can_view_reports": true}'),
('cc0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440006', 'coordinator', 'active', '2024-01-01 10:00:00', '{"can_create_tasks": true, "can_manage_members": true, "can_view_reports": true}'),
('cc0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'member', 'active', '2024-01-01 10:00:00', '{"can_create_tasks": true, "can_view_reports": true}');

-- ================================================
-- ESCALATIONS DATA
-- ================================================

INSERT INTO escalations (id, ticket_number, title, description, priority, status, category, sub_category, urgency, impact, escalated_by, assigned_to, school_id, task_id, team_id, due_date, resolution_notes, resolution_time_hours, customer_satisfaction, tags, attachments, watchers) VALUES
('dd0e8400-e29b-41d4-a716-446655440000', '2024-01-15-001', 'School Partnership Delay', 'Lincoln High School partnership agreement is delayed due to administrative issues', 'High', 'In Progress', 'partnership', 'agreement_delay', 'High', 'Medium', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440000', NULL, 'bb0e8400-e29b-41d4-a716-446655440002', '2024-02-01', NULL, NULL, NULL, ARRAY['partnership', 'urgent', 'administrative'], ARRAY['https://docs.afroscholarhub.com/partnership_docs.pdf'], ARRAY['550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003']),
('dd0e8400-e29b-41d4-a716-446655440001', '2024-01-20-002', 'Technical Equipment Issue', 'Projector malfunction during workshop presentation', 'Medium', 'Resolved', 'technical', 'equipment_failure', 'Medium', 'Low', '550e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440008', NULL, NULL, NULL, '2024-01-25', 'Replaced projector with backup unit. Issue resolved within 30 minutes.', 2, 4, ARRAY['technical', 'equipment', 'workshop'], ARRAY['https://docs.afroscholarhub.com/incident_report.pdf'], ARRAY['550e8400-e29b-41d4-a716-446655440001']);

-- ================================================
-- ESCALATION COMMENTS DATA
-- ================================================

INSERT INTO escalation_comments (id, escalation_id, user_id, comment, is_internal, attachments) VALUES
('ee0e8400-e29b-41d4-a716-446655440000', 'dd0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Following up with school administration to get the required signatures. Will update by end of day.', false, ARRAY[]),
('ee0e8400-e29b-41d4-a716-446655440001', 'dd0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Please ensure all compliance documents are in order before proceeding. Check with legal team.', true, ARRAY['https://docs.afroscholarhub.com/compliance_checklist.pdf']),
('ee0e8400-e29b-41d4-a716-446655440002', 'dd0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'Equipment failure occurred during setup. Need immediate replacement for tomorrow''s session.', false, ARRAY[]),
('ee0e8400-e29b-41d4-a716-446655440003', 'dd0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440008', 'Replacement equipment dispatched. Should arrive within 2 hours. Please confirm receipt.', true, ARRAY[]);

-- ================================================
-- NOTIFICATIONS DATA
-- ================================================

INSERT INTO notifications (id, user_id, title, message, type, category, priority, is_read, read_at, action_required, action_url, action_text, related_entity_type, related_entity_id, expires_at, metadata) VALUES
('ff0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'New Task Assigned', 'You have been assigned a new task: Follow up with Lincoln High', 'info', 'task', 'normal', false, NULL, true, '/tasks/880e8400-e29b-41d4-a716-446655440000', 'View Task', 'task', '880e8400-e29b-41d4-a716-446655440000', NULL, '{"priority": "High", "due_date": "2024-02-15"}'),
('ff0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440007', 'Workshop Materials Due', 'Workshop materials preparation is due in 3 days', 'warning', 'task', 'high', false, NULL, true, '/tasks/880e8400-e29b-41d4-a716-446655440001', 'View Task', 'task', '880e8400-e29b-41d4-a716-446655440001', NULL, '{"progress": 60, "due_date": "2024-02-10"}'),
('ff0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Escalation Update', 'School partnership delay requires your attention', 'warning', 'escalation', 'urgent', false, NULL, true, '/escalations/dd0e8400-e29b-41d4-a716-446655440000', 'View Escalation', 'escalation', 'dd0e8400-e29b-41d4-a716-446655440000', NULL, '{"priority": "High", "category": "partnership"}'),
('ff0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440006', 'Team Meeting Reminder', 'Kenya Education Team meeting scheduled for tomorrow at 2 PM', 'info', 'team', 'normal', true, '2024-01-20 14:30:00', false, '/teams/bb0e8400-e29b-41d4-a716-446655440001', 'View Team', 'team', 'bb0e8400-e29b-41d4-a716-446655440001', NULL, '{"meeting_time": "2024-01-21 14:00:00"}');

-- ================================================
-- REPORTS DATA
-- ================================================

INSERT INTO reports (id, title, description, type, sub_type, format, parameters, filters, file_url, file_size, status, generated_by, downloads, expires_at, error_message, generation_time, scheduled_for, is_recurring, recurring_pattern) VALUES
('gg0e8400-e29b-41d4-a716-446655440000', 'Monthly School Visits Report', 'Summary of all school visits conducted in January 2024', 'visits', 'monthly', 'pdf', '{"date_range": {"start": "2024-01-01", "end": "2024-01-31"}}', '{"country": "NGA", "status": "completed"}', 'https://reports.afroscholarhub.com/monthly_visits_jan_2024.pdf', 245760, 'ready', '550e8400-e29b-41d4-a716-446655440001', 15, NULL, NULL, '00:02:30', NULL, true, 'monthly'),
('gg0e8400-e29b-41d4-a716-446655440001', 'Ambassador
