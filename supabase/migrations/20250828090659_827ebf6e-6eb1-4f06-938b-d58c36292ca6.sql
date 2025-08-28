-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('teacher', 'student');

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'student',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create study cards table
CREATE TABLE public.study_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create game sessions table for tracking
CREATE TABLE public.game_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_type TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  score_correct INTEGER NOT NULL DEFAULT 0,
  score_total INTEGER NOT NULL DEFAULT 0,
  time_spent INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;

-- Create function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for subjects
CREATE POLICY "Everyone can view active subjects" ON public.subjects
  FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can create subjects" ON public.subjects
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'teacher');

CREATE POLICY "Teachers can update their subjects" ON public.subjects
  FOR UPDATE USING (created_by = auth.uid() AND public.get_user_role(auth.uid()) = 'teacher');

-- RLS Policies for categories
CREATE POLICY "Everyone can view active categories" ON public.categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can create categories" ON public.categories
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'teacher');

CREATE POLICY "Teachers can update their categories" ON public.categories
  FOR UPDATE USING (created_by = auth.uid() AND public.get_user_role(auth.uid()) = 'teacher');

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for study cards
CREATE POLICY "Everyone can view active study cards" ON public.study_cards
  FOR SELECT USING (is_active = true);

CREATE POLICY "Teachers can create study cards" ON public.study_cards
  FOR INSERT WITH CHECK (public.get_user_role(auth.uid()) = 'teacher');

CREATE POLICY "Teachers can update their study cards" ON public.study_cards
  FOR UPDATE USING (created_by = auth.uid() AND public.get_user_role(auth.uid()) = 'teacher');

-- RLS Policies for game sessions
CREATE POLICY "Users can view their own game sessions" ON public.game_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own game sessions" ON public.game_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can view all game sessions" ON public.game_sessions
  FOR SELECT USING (public.get_user_role(auth.uid()) = 'teacher');

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_study_cards_updated_at
  BEFORE UPDATE ON public.study_cards
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert some sample data
INSERT INTO public.subjects (name, description) VALUES
  ('Mathematics', 'Basic to advanced mathematical concepts'),
  ('Science', 'Physics, Chemistry, and Biology topics'),
  ('History', 'World history and important events'),
  ('English', 'Language arts and literature');

INSERT INTO public.categories (name, description, subject_id) VALUES
  ('Algebra', 'Linear equations and polynomials', (SELECT id FROM public.subjects WHERE name = 'Mathematics')),
  ('Geometry', 'Shapes, angles, and spatial relationships', (SELECT id FROM public.subjects WHERE name = 'Mathematics')),
  ('Physics', 'Motion, energy, and forces', (SELECT id FROM public.subjects WHERE name = 'Science')),
  ('Chemistry', 'Elements, compounds, and reactions', (SELECT id FROM public.subjects WHERE name = 'Science')),
  ('World War II', 'Events and consequences of WWII', (SELECT id FROM public.subjects WHERE name = 'History')),
  ('Grammar', 'Parts of speech and sentence structure', (SELECT id FROM public.subjects WHERE name = 'English'));