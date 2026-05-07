
-- Roles enum
CREATE TYPE public.app_role AS ENUM ('admin', 'tutor', 'parent', 'student');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role function (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Profiles policies
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- user_roles policies
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Auto-create profile + default parent role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'parent');
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Demo bookings (public can insert)
CREATE TABLE public.demo_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name TEXT NOT NULL,
  child_name TEXT NOT NULL,
  child_grade TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_time TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.demo_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can book demo" ON public.demo_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view bookings" ON public.demo_bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update bookings" ON public.demo_bookings FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Contact messages
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can contact" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view messages" ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- Blog posts
CREATE TABLE public.blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_emoji TEXT DEFAULT '📚',
  author TEXT DEFAULT 'Fluent Team',
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads published" ON public.blog_posts FOR SELECT USING (published = true);
CREATE POLICY "Admins manage blog" ON public.blog_posts FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Progress reports (parent/student dashboards)
CREATE TABLE public.progress_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tutor_id UUID REFERENCES auth.users(id),
  week_of DATE NOT NULL,
  attendance INT DEFAULT 0,
  marks INT DEFAULT 0,
  confidence_score INT DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.progress_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Student views own reports" ON public.progress_reports FOR SELECT USING (auth.uid() = student_id);
CREATE POLICY "Tutor views own students" ON public.progress_reports FOR SELECT USING (auth.uid() = tutor_id);
CREATE POLICY "Admins view all reports" ON public.progress_reports FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Tutors create reports" ON public.progress_reports FOR INSERT WITH CHECK (auth.uid() = tutor_id AND public.has_role(auth.uid(), 'tutor'));
CREATE POLICY "Tutors update own reports" ON public.progress_reports FOR UPDATE USING (auth.uid() = tutor_id);
CREATE POLICY "Admins manage reports" ON public.progress_reports FOR ALL USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed blog posts
INSERT INTO public.blog_posts (slug, title, excerpt, content, cover_emoji) VALUES
('confidence-first-learning', 'Why we teach confidence first', 'The hidden ingredient behind every top performer.', E'Most learning systems chase marks. We discovered the missing layer beneath them — confidence.\n\nWhen a child believes they can think, speak, and try, marks follow naturally. This article explores how confidence-first pedagogy reshapes outcomes.', '✨'),
('british-method-india', 'The British Method, adapted for India', 'Inquiry-led learning meets Indian classrooms.', E'British classrooms prize understanding over rote. We bring the same inquiry-led method to Indian students — without losing rigor.', '🇬🇧'),
('weekly-accountability', 'Why Sunday reports change everything', 'Transparent progress, every single week.', E'Parents deserve to know what is working and what is not. Our weekly Sunday brief is the heartbeat of the Fluent program.', '📊');
