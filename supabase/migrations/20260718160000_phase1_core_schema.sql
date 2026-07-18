-- Phase 1: schools, classes, enrollments, guardian links

-- ---------------------------------------------------------------------------
-- Helpers (before tables that use defaults)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.generate_join_code(_len int DEFAULT 8)
RETURNS text
LANGUAGE sql
VOLATILE
AS $$
  SELECT upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, _len));
$$;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

CREATE TABLE public.schools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  settings jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.school_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  member_role public.app_role NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'pending', 'inactive')),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (school_id, user_id)
);

CREATE TABLE public.classes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id uuid NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  name text NOT NULL,
  grade text,
  subject text,
  tutor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  join_code text NOT NULL UNIQUE DEFAULT public.generate_join_code(8),
  schedule jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_classes_school_id ON public.classes(school_id);
CREATE INDEX idx_classes_tutor_id ON public.classes(tutor_id);

CREATE TABLE public.enrollments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'withdrawn')),
  enrolled_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (class_id, student_id)
);

CREATE INDEX idx_enrollments_student_id ON public.enrollments(student_id);

CREATE TABLE public.guardian_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship text NOT NULL DEFAULT 'parent',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'revoked')),
  verified_at timestamptz,
  verified_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (guardian_id, student_id)
);

CREATE INDEX idx_guardian_links_guardian ON public.guardian_links(guardian_id);
CREATE INDEX idx_guardian_links_student ON public.guardian_links(student_id);

CREATE TABLE public.guardian_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '30 days'),
  used_by uuid REFERENCES auth.users(id),
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_platform_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(_user_id, 'admin'::public.app_role);
$$;

CREATE OR REPLACE FUNCTION public.is_school_member(_user_id uuid, _school_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_platform_admin(_user_id)
    OR EXISTS (
      SELECT 1
      FROM public.school_members sm
      WHERE sm.user_id = _user_id
        AND sm.school_id = _school_id
        AND sm.status = 'active'
    );
$$;

-- ---------------------------------------------------------------------------
-- RPC: student joins class by code
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.join_class(p_join_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_class_id uuid;
  v_student_id uuid := auth.uid();
BEGIN
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT public.has_role(v_student_id, 'student'::public.app_role)
     AND NOT public.is_platform_admin(v_student_id) THEN
    RAISE EXCEPTION 'Student role required';
  END IF;

  SELECT c.id INTO v_class_id
  FROM public.classes c
  WHERE upper(c.join_code) = upper(trim(p_join_code));

  IF v_class_id IS NULL THEN
    RAISE EXCEPTION 'Invalid class code';
  END IF;

  INSERT INTO public.enrollments (class_id, student_id, status)
  VALUES (v_class_id, v_student_id, 'active')
  ON CONFLICT (class_id, student_id)
  DO UPDATE SET status = 'active', enrolled_at = now();

  RETURN v_class_id;
END;
$$;

REVOKE ALL ON FUNCTION public.join_class(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.join_class(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- RPC: parent links to student via invite code
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.link_guardian(p_invite_code text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_invite public.guardian_invites%ROWTYPE;
  v_guardian_id uuid := auth.uid();
  v_link_id uuid;
BEGIN
  IF v_guardian_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT * INTO v_invite
  FROM public.guardian_invites gi
  WHERE upper(gi.code) = upper(trim(p_invite_code))
    AND gi.used_by IS NULL
    AND gi.expires_at > now();

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invite code';
  END IF;

  IF v_invite.student_id = v_guardian_id THEN
    RAISE EXCEPTION 'Cannot link to yourself';
  END IF;

  INSERT INTO public.guardian_links (guardian_id, student_id, status, verified_at, verified_by)
  VALUES (v_guardian_id, v_invite.student_id, 'verified', now(), v_invite.student_id)
  ON CONFLICT (guardian_id, student_id) DO UPDATE
    SET status = 'verified',
        verified_at = now(),
        verified_by = EXCLUDED.verified_by
  RETURNING id INTO v_link_id;

  UPDATE public.guardian_invites
  SET used_by = v_guardian_id, used_at = now()
  WHERE id = v_invite.id;

  RETURN v_link_id;
END;
$$;

REVOKE ALL ON FUNCTION public.link_guardian(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.link_guardian(text) TO authenticated;

-- ---------------------------------------------------------------------------
-- RPC: student creates guardian invite code
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_guardian_invite()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_student_id uuid := auth.uid();
  v_code text;
BEGIN
  IF v_student_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NOT public.has_role(v_student_id, 'student'::public.app_role)
     AND NOT public.is_platform_admin(v_student_id) THEN
    RAISE EXCEPTION 'Student role required';
  END IF;

  v_code := public.generate_join_code(8);

  INSERT INTO public.guardian_invites (student_id, code)
  VALUES (v_student_id, v_code);

  RETURN v_code;
END;
$$;

REVOKE ALL ON FUNCTION public.create_guardian_invite() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_guardian_invite() TO authenticated;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guardian_invites ENABLE ROW LEVEL SECURITY;

-- schools
CREATE POLICY "Platform admins manage schools"
  ON public.schools FOR ALL
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

CREATE POLICY "Members view their schools"
  ON public.schools FOR SELECT
  USING (public.is_school_member(auth.uid(), id));

-- school_members
CREATE POLICY "Platform admins manage school members"
  ON public.school_members FOR ALL
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

CREATE POLICY "Users view own membership"
  ON public.school_members FOR SELECT
  USING (auth.uid() = user_id);

-- classes
CREATE POLICY "Platform admins manage classes"
  ON public.classes FOR ALL
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

CREATE POLICY "School members view classes"
  ON public.classes FOR SELECT
  USING (public.is_school_member(auth.uid(), school_id));

CREATE POLICY "Tutors view assigned classes"
  ON public.classes FOR SELECT
  USING (auth.uid() = tutor_id);

CREATE POLICY "Students view enrolled classes"
  ON public.classes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.class_id = classes.id
        AND e.student_id = auth.uid()
        AND e.status = 'active'
    )
  );

-- enrollments
CREATE POLICY "Platform admins manage enrollments"
  ON public.enrollments FOR ALL
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

CREATE POLICY "Students view own enrollments"
  ON public.enrollments FOR SELECT
  USING (auth.uid() = student_id);

CREATE POLICY "Tutors view class enrollments"
  ON public.enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      WHERE c.id = enrollments.class_id
        AND c.tutor_id = auth.uid()
    )
  );

-- guardian_links
CREATE POLICY "Platform admins manage guardian links"
  ON public.guardian_links FOR ALL
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

CREATE POLICY "Guardians view own links"
  ON public.guardian_links FOR SELECT
  USING (auth.uid() = guardian_id);

CREATE POLICY "Students view links to them"
  ON public.guardian_links FOR SELECT
  USING (auth.uid() = student_id);

-- guardian_invites
CREATE POLICY "Students manage own invites"
  ON public.guardian_invites FOR ALL
  USING (auth.uid() = student_id)
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Platform admins manage invites"
  ON public.guardian_invites FOR ALL
  USING (public.is_platform_admin(auth.uid()))
  WITH CHECK (public.is_platform_admin(auth.uid()));

-- Parents can read progress reports for verified linked students
CREATE POLICY "Parents view linked student reports"
  ON public.progress_reports FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.guardian_links gl
      WHERE gl.guardian_id = auth.uid()
        AND gl.student_id = progress_reports.student_id
        AND gl.status = 'verified'
    )
  );

-- Demo seed (optional — platform can rename later)
INSERT INTO public.schools (name, slug)
VALUES ('Fluent Demo School', 'fluent-demo')
ON CONFLICT (slug) DO NOTHING;
