-- Marketing / resource download leads (visa checklist gate, etc.)
-- Public writes via SECURITY DEFINER RPC only; admin read via RLS.

CREATE TABLE public.resource_leads (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type      text NOT NULL CHECK (resource_type = 'visa_checklist'),
  first_name         text NOT NULL CHECK (char_length(trim(first_name)) BETWEEN 1 AND 100),
  last_name          text NOT NULL CHECK (char_length(trim(last_name)) BETWEEN 1 AND 100),
  email              text NOT NULL CHECK (char_length(trim(email)) BETWEEN 3 AND 320),
  linkedin_url       text,
  access_token       uuid NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  token_expires_at   timestamptz NOT NULL,
  created_at         timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_resource_leads_access_token
  ON public.resource_leads (access_token);

CREATE INDEX idx_resource_leads_created_at
  ON public.resource_leads (created_at DESC);

ALTER TABLE public.resource_leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY resource_leads_admin_select ON public.resource_leads
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

-- ---------------------------------------------------------------------------
-- submit_visa_checklist_lead — anon/authenticated may execute; inserts only
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.submit_visa_checklist_lead(
  p_first_name text,
  p_last_name text,
  p_email text,
  p_linkedin_url text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_first_name text;
  v_last_name text;
  v_email text;
  v_linkedin text;
  v_token uuid;
BEGIN
  v_first_name := trim(coalesce(p_first_name, ''));
  v_last_name := trim(coalesce(p_last_name, ''));
  v_email := lower(trim(coalesce(p_email, '')));
  v_linkedin := nullif(trim(coalesce(p_linkedin_url, '')), '');

  IF char_length(v_first_name) < 1 OR char_length(v_first_name) > 100 THEN
    RAISE EXCEPTION 'invalid_first_name' USING ERRCODE = '22023';
  END IF;

  IF char_length(v_last_name) < 1 OR char_length(v_last_name) > 100 THEN
    RAISE EXCEPTION 'invalid_last_name' USING ERRCODE = '22023';
  END IF;

  IF char_length(v_email) < 3 OR char_length(v_email) > 320 THEN
    RAISE EXCEPTION 'invalid_email' USING ERRCODE = '22023';
  END IF;

  IF v_email !~ '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
    RAISE EXCEPTION 'invalid_email' USING ERRCODE = '22023';
  END IF;

  IF v_linkedin IS NOT NULL THEN
    IF v_linkedin !~ '^https?://(www\.)?linkedin\.com/' THEN
      RAISE EXCEPTION 'invalid_linkedin_url' USING ERRCODE = '22023';
    END IF;
    IF char_length(v_linkedin) > 500 THEN
      RAISE EXCEPTION 'invalid_linkedin_url' USING ERRCODE = '22023';
    END IF;
  END IF;

  INSERT INTO public.resource_leads (
    resource_type,
    first_name,
    last_name,
    email,
    linkedin_url,
    token_expires_at
  )
  VALUES (
    'visa_checklist',
    v_first_name,
    v_last_name,
    v_email,
    v_linkedin,
    now() + interval '7 days'
  )
  RETURNING access_token INTO v_token;

  RETURN v_token;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_visa_checklist_lead(text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_visa_checklist_lead(text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.submit_visa_checklist_lead(text, text, text, text) TO authenticated;

-- ---------------------------------------------------------------------------
-- validate_visa_checklist_access — returns boolean only; no PII
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.validate_visa_checklist_access(p_token uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.resource_leads
    WHERE access_token = p_token
      AND resource_type = 'visa_checklist'
      AND token_expires_at > now()
  );
$$;

REVOKE ALL ON FUNCTION public.validate_visa_checklist_access(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.validate_visa_checklist_access(uuid) TO anon;
GRANT EXECUTE ON FUNCTION public.validate_visa_checklist_access(uuid) TO authenticated;
