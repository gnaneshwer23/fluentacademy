
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarded boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS role app_role,
  ADD COLUMN IF NOT EXISTS grade text,
  ADD COLUMN IF NOT EXISTS subjects text[],
  ADD COLUMN IF NOT EXISTS goals text,
  ADD COLUMN IF NOT EXISTS learning_style text,
  ADD COLUMN IF NOT EXISTS experience_years integer,
  ADD COLUMN IF NOT EXISTS bio text,
  ADD COLUMN IF NOT EXISTS availability text,
  ADD COLUMN IF NOT EXISTS child_name text,
  ADD COLUMN IF NOT EXISTS child_grade text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  chosen_role app_role;
BEGIN
  chosen_role := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'role', '')::app_role,
    'parent'::app_role
  );
  -- Never let users self-assign admin
  IF chosen_role = 'admin' THEN
    chosen_role := 'parent';
  END IF;

  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email, chosen_role);

  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, chosen_role);
  RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
