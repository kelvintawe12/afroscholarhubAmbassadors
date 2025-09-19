-- Seed data for AfroScholarHub Ambassadors Site

-- Insert countries
INSERT INTO countries (code, name, flag_url) VALUES
('USA', 'United States', 'https://flagcdn.com/us.svg'),
('KEN', 'Kenya', 'https://flagcdn.com/ke.svg'),
('NGA', 'Nigeria', 'https://flagcdn.com/ng.svg'),
('ZAF', 'South Africa', 'https://flagcdn.com/za.svg'),
('GHA', 'Ghana', 'https://flagcdn.com/gh.svg'),
('ETH', 'Ethiopia', 'https://flagcdn.com/et.svg'),
('UGA', 'Uganda', 'https://flagcdn.com/ug.svg'),
('TZA', 'Tanzania', 'https://flagcdn.com/tz.svg');

-- Insert management user
INSERT INTO users (id, email, full_name, role, country_code) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'admin@afroscholarhub.com', 'System Administrator', 'management', NULL);

-- Insert country leads
INSERT INTO users (id, email, full_name, role, country_code) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'lead@usa.afroscholarhub.com', 'Sarah Johnson', 'country_lead', 'USA'),
('550e8400-e29b-41d4-a716-446655440002', 'lead@ken.afroscholarhub.com', 'David Kiprop', 'country_lead', 'KEN'),
('550e8400-e29b-41d4-a716-446655440003', 'lead@nga.afroscholarhub.com', 'Amara Okafor', 'country_lead', 'NGA'),
('550e8400-e29b-41d4-a716-446655440004', 'lead@zaf.afroscholarhub.com', 'Thabo Nkosi', 'country_lead', 'ZAF');

-- Update countries with lead IDs
UPDATE countries SET lead_id = '550e8400-e29b-41d4-a716-446655440001' WHERE code = 'USA';
UPDATE countries SET lead_id = '550e8400-e29b-41d4-a716-446655440002' WHERE code = 'KEN';
UPDATE countries SET lead_id = '550e8400-e29b-41d4-a716-446655440003' WHERE code = 'NGA';
UPDATE countries SET lead_id = '550e8400-e29b-41d4-a716-446655440004' WHERE code = 'ZAF';

-- Insert ambassadors
INSERT INTO users (id, email, full_name, role, country_code) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'john.doe@afroscholarhub.com', 'John Doe', 'ambassador', 'USA'),
('550e8400-e29b-41d4-a716-446655440011', 'jane.smith@afroscholarhub.com', 'Jane Smith', 'ambassador', 'USA'),
('550e8400-e29b-41d4-a716-446655440012', 'mike.wilson@afroscholarhub.com', 'Mike Wilson', 'ambassador', 'KEN'),
('550e8400-e29b-41d4-a716-446655440013', 'grace.mwangi@afroscholarhub.com', 'Grace Mwangi', 'ambassador', 'KEN'),
('550e8400-e29b-41d4-a716-446655440014', 'chinedu.adebayo@afroscholarhub.com', 'Chinedu Adebayo', 'ambassador', 'NGA'),
('550e8400-e29b-41d4-a716-446655440015', 'nkechi.okoro@afroscholarhub.com', 'Nkechi Okoro', 'ambassador', 'NGA');

-- Insert support user
INSERT INTO users (id, email, full_name, role, country_code) VALUES
('550e8400-e29b-41d4-a716-446655440020', 'support@afroscholarhub.com', 'Support Team', 'support', NULL);

-- Insert sample schools
INSERT INTO schools (id, name, location, address, contact_person, contact_email, contact_phone, student_count, status, country_code, region, ambassador_id) VALUES
('660e8400-e29b-41d4-a716-446655440000', 'Lincoln High School', 'Springfield, IL', '123 Main St, Springfield, IL 62701', 'Principal Adams', 'adams@lincoln.edu', '+1-217-555-0123', 1200, 'partnered', 'USA', 'Midwest', '550e8400-e29b-41d4-a716-446655440010'),
('660e8400-e29b-41d4-a716-446655440001', 'Washington Elementary', 'Seattle, WA', '456 Oak Ave, Seattle, WA 98101', 'Principal Brown', 'brown@washington.edu', '+1-206-555-0456', 450, 'visited', 'USA', 'West', '550e8400-e29b-41d4-a716-446655440011'),
('660e8400-e29b-41d4-a716-446655440002', 'Jefferson Middle School', 'Austin, TX', '789 Pine St, Austin, TX 73301', 'Principal Davis', 'davis@jefferson.edu', '+1-512-555-0789', 800, 'prospect', 'USA', 'South', '550e8400-e29b-41d4-a716-446655440010'),
('660e8400-e29b-41d4-a716-446655440003', 'Nairobi International School', 'Nairobi', 'Westlands Road, Nairobi, Kenya', 'Principal Kiprop', 'kiprop@nairobi.edu', '+254-20-555-0123', 950, 'partnered', 'KEN', 'Nairobi', '550e8400-e29b-41d4-a716-446655440012'),
('660e8400-e29b-41d4-a716-446655440004', 'Mombasa Academy', 'Mombasa', 'Moi Avenue, Mombasa, Kenya', 'Principal Wanjiku', 'wanjiku@mombasa.edu', '+254-41-555-0456', 600, 'visited', 'KEN', 'Coast', '550e8400-e29b-41d4-a716-446655440013'),
('660e8400-e29b-41d4-a716-446655440005', 'Lagos Grammar School', 'Lagos', 'Victoria Island, Lagos, Nigeria', 'Principal Adebayo', 'adebayo@lagos.edu', '+234-1-555-0123', 1100, 'partnered', 'NGA', 'Lagos', '550e8400-e29b-41d4-a716-446655440014'),
('660e8400-e29b-41d4-a716-446655440006', 'Abuja International School', 'Abuja', 'Wuse II, Abuja, Nigeria', 'Principal Okoro', 'okoro@abuja.edu', '+234-9-555-0456', 750, 'prospect', 'NGA', 'FCT', '550e8400-e29b-41d4-a716-446655440015');

-- Insert sample visits
INSERT INTO visits (id, school_id, ambassador_id, visit_date, duration_minutes, students_reached, activities, notes) VALUES
('770e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '2024-01-15', 120, 150, ARRAY['STEM Workshop', 'Career Guidance'], 'Great engagement with students'),
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '2024-01-20', 90, 80, ARRAY['Digital Literacy Session'], 'Students showed high interest'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440012', '2024-01-25', 150, 200, ARRAY['Science Fair', 'Mentorship Program'], 'Very successful visit'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440014', '2024-02-01', 100, 120, ARRAY['Art and Technology'], 'Creative session with local artists');

-- Insert sample tasks
INSERT INTO tasks (id, title, description, priority, status, due_date, school_id, ambassador_id, created_by) VALUES
('880e8400-e29b-41d4-a716-446655440000', 'Follow up with Lincoln High', 'Schedule next STEM workshop', 'High', 'Pending', '2024-02-15', '660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440001', 'Prepare workshop materials', 'Create presentation for digital literacy', 'Medium', 'In Progress', '2024-02-10', '660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001'),
('880e8400-e29b-41d4-a716-446655440002', 'Contact Nairobi International', 'Discuss partnership renewal', 'High', 'Completed', '2024-01-30', '660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002'),
('880e8400-e29b-41d4-a716-446655440003', 'Organize Lagos event', 'Plan community outreach event', 'Medium', 'Pending', '2024-03-01', '660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample events
INSERT INTO events (id, name, description, event_date, location, country_code, region, expected_attendance, budget, status, created_by) VALUES
('990e8400-e29b-41d4-a716-446655440000', 'STEM Career Day', 'Interactive STEM workshops for high school students', '2024-03-15', 'Lincoln High School', 'USA', 'Midwest', 200, 5000.00, 'planned', '550e8400-e29b-41d4-a716-446655440001'),
('990e8400-e29b-41d4-a716-446655440001', 'Digital Skills Workshop', 'Introduction to coding and digital tools', '2024-02-20', 'Nairobi International School', 'KEN', 'Nairobi', 150, 3000.00, 'planned', '550e8400-e29b-41d4-a716-446655440002'),
('990e8400-e29b-41d4-a716-446655440002', 'Youth Leadership Summit', 'Leadership development for young Africans', '2024-04-10', 'Lagos Grammar School', 'NGA', 'Lagos', 300, 8000.00, 'planned', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample resources
INSERT INTO resources (id, title, description, type, url, file_type, category, tags, created_by) VALUES
('aa0e8400-e29b-41d4-a716-446655440000', 'STEM Workshop Guide', 'Comprehensive guide for conducting STEM workshops', 'guide', 'https://resources.afroscholarhub.com/stem-guide.pdf', 'pdf', 'Education', ARRAY['STEM', 'Workshop', 'Guide'], '550e8400-e29b-41d4-a716-446655440020'),
('aa0e8400-e29b-41d4-a716-446655440001', 'Digital Literacy Curriculum', 'Complete curriculum for digital literacy programs', 'document', 'https://resources.afroscholarhub.com/digital-curriculum.docx', 'docx', 'Curriculum', ARRAY['Digital', 'Literacy', 'Curriculum'], '550e8400-e29b-41d4-a716-446655440020'),
('aa0e8400-e29b-41d4-a716-446655440002', 'Mentorship Program Video', 'Introduction video for mentorship programs', 'video', 'https://resources.afroscholarhub.com/mentorship-intro.mp4', 'mp4', 'Training', ARRAY['Mentorship', 'Video', 'Training'], '550e8400-e29b-41d4-a716-446655440020'),
('aa0e8400-e29b-41d4-a716-446655440003', 'Event Planning Template', 'Template for planning outreach events', 'template', 'https://resources.afroscholarhub.com/event-template.xlsx', 'xlsx', 'Planning', ARRAY['Event', 'Planning', 'Template'], '550e8400-e29b-41d4-a716-446655440020');

-- Insert sample teams
INSERT INTO teams (id, name, description, country_code, lead_id) VALUES
('bb0e8400-e29b-41d4-a716-446655440000', 'Midwest STEM Team', 'Focused on STEM education in the Midwest region', 'USA', '550e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440001', 'West Coast Digital Team', 'Digital literacy initiatives on the West Coast', 'USA', '550e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440002', 'Nairobi Education Team', 'Comprehensive education support in Nairobi', 'KEN', '550e8400-e29b-41d4-a716-446655440002'),
('bb0e8400-e29b-41d4-a716-446655440003', 'Lagos Innovation Team', 'Innovation and technology programs in Lagos', 'NGA', '550e8400-e29b-41d4-a716-446655440003');

-- Insert team members
INSERT INTO team_members (id, team_id, ambassador_id, role_in_team) VALUES
('cc0e8400-e29b-41d4-a716-446655440000', 'bb0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'coordinator'),
('cc0e8400-e29b-41d4-a716-446655440001', 'bb0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'coordinator'),
('cc0e8400-e29b-41d4-a716-446655440002', 'bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'coordinator'),
('cc0e8400-e29b-41d4-a716-446655440003', 'bb0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440014', 'coordinator'),
('cc0e8400-e29b-41d4-a716-446655440004', 'bb0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440013', 'member');

-- Insert sample escalations
INSERT INTO escalations (id, title, description, priority, status, category, escalated_by, assigned_to, school_id, task_id) VALUES
('dd0e8400-e29b-41d4-a716-446655440000', 'Technical Issue with Workshop Materials', 'Digital literacy workshop materials not loading properly on school devices', 'High', 'Open', 'technical', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440020', '660e8400-e29b-41d4-a716-446655440001', '880e8400-e29b-41d4-a716-446655440001'),
('dd0e8400-e29b-41d4-a716-446655440001', 'School Partnership Delay', 'Nairobi International School partnership renewal delayed due to administrative issues', 'Medium', 'In Progress', 'school_issue', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', '880e8400-e29b-41d4-a716-446655440002'),
('dd0e8400-e29b-41d4-a716-446655440002', 'Ambassador Training Required', 'New ambassador needs urgent training on platform usage', 'High', 'Open', 'ambassador_issue', '550e8400-e29b-41d4-a716-446655440014', NULL, NULL, NULL);

-- Insert sample notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, related_entity_type, related_entity_id) VALUES
('ee0e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440010', 'New Task Assigned', 'You have been assigned a new task: Follow up with Lincoln High', 'info', FALSE, 'tasks', '880e8400-e29b-41d4-a716-446655440000'),
('ee0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440011', 'Task Updated', 'Your task "Prepare workshop materials" has been updated', 'info', FALSE, 'tasks', '880e8400-e29b-41d4-a716-446655440001'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440020', 'New Escalation', 'A new escalation has been created: Technical Issue with Workshop Materials', 'warning', FALSE, 'escalations', 'dd0e8400-e29b-41d4-a716-446655440000'),
('ee0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Escalation in Your Country', 'An escalation has been created in your country: School Partnership Delay', 'warning', FALSE, 'escalations', 'dd0e8400-e29b-41d4-a716-446655440001');
