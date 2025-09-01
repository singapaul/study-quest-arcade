-- Seed initial subjects
INSERT INTO subjects (id, name, description, is_active, created_at, updated_at) VALUES
  ('english', 'English', 'Language arts, literature, and communication skills', true, NOW(), NOW()),
  ('maths', 'Maths', 'Mathematics including algebra, geometry, and calculus', true, NOW(), NOW()),
  ('biology', 'Biology', 'Study of living organisms and life processes', true, NOW(), NOW()),
  ('physics', 'Physics', 'Study of matter, energy, and their interactions', true, NOW(), NOW()),
  ('chemistry', 'Chemistry', 'Study of substances and their properties', true, NOW(), NOW()),
  ('religious-education', 'Religious Education', 'Study of world religions and spiritual practices', true, NOW(), NOW()),
  ('history', 'History', 'Study of past events and human societies', true, NOW(), NOW()),
  ('geography', 'Geography', 'Study of Earth''s landscapes and environments', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = NOW();
