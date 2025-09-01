-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'student'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Subjects policies
CREATE POLICY "Users can view all active subjects" ON subjects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can create subjects" ON subjects
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update their own subjects" ON subjects
  FOR UPDATE USING (
    auth.uid() = created_by AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Categories policies
CREATE POLICY "Users can view categories for active subjects" ON categories
  FOR SELECT USING (
    is_active = true AND 
    EXISTS (
      SELECT 1 FROM subjects 
      WHERE id = subject_id AND is_active = true
    )
  );

CREATE POLICY "Teachers can create categories" ON categories
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update their own categories" ON categories
  FOR UPDATE USING (
    auth.uid() = created_by AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Study cards policies
CREATE POLICY "Users can view active study cards" ON study_cards
  FOR SELECT USING (
    is_active = true AND 
    EXISTS (
      SELECT 1 FROM categories c
      JOIN subjects s ON c.subject_id = s.id
      WHERE c.id = category_id AND c.is_active = true AND s.is_active = true
    )
  );

CREATE POLICY "Teachers can create study cards" ON study_cards
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update their own study cards" ON study_cards
  FOR UPDATE USING (
    auth.uid() = created_by AND 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'teacher'
    )
  );

-- Game sessions policies
CREATE POLICY "Users can view their own game sessions" ON game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own game sessions" ON game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own game sessions" ON game_sessions
  FOR UPDATE USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
