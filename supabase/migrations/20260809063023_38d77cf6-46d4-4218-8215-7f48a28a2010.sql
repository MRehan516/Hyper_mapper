-- =========================
-- mapping_sessions lockdown
-- =========================
DROP POLICY IF EXISTS "Allow public read of mapping_sessions" ON public.mapping_sessions;
DROP POLICY IF EXISTS "Allow public update to mapping_sessions" ON public.mapping_sessions;
DROP POLICY IF EXISTS "Allow public insert to mapping_sessions" ON public.mapping_sessions;

REVOKE ALL ON public.mapping_sessions FROM anon;
REVOKE ALL ON public.mapping_sessions FROM authenticated;
GRANT SELECT ON public.mapping_sessions TO authenticated;
GRANT ALL ON public.mapping_sessions TO service_role;

CREATE POLICY "Authenticated users can read mapping sessions"
  ON public.mapping_sessions
  FOR SELECT TO authenticated
  USING (true);

-- =========================
-- tester_feedback lockdown
-- =========================
DROP POLICY IF EXISTS "Allow public read of tester_feedback" ON public.tester_feedback;
DROP POLICY IF EXISTS "Allow public insert to tester_feedback" ON public.tester_feedback;

REVOKE ALL ON public.tester_feedback FROM anon;
REVOKE ALL ON public.tester_feedback FROM authenticated;
GRANT ALL ON public.tester_feedback TO service_role;

-- =========================
-- Validated, least-privilege RPCs for the anonymous web app
-- =========================
CREATE OR REPLACE FUNCTION public.create_mapping_session(
  p_raw_concept text,
  p_cognitive_anchor text,
  p_structured_output jsonb
)
RETURNS TABLE (id uuid, session_token uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_raw_concept IS NULL OR btrim(p_raw_concept) = '' OR length(p_raw_concept) > 20000 THEN
    RAISE EXCEPTION 'Invalid concept';
  END IF;
  IF p_cognitive_anchor IS NULL OR btrim(p_cognitive_anchor) = '' OR length(p_cognitive_anchor) > 500 THEN
    RAISE EXCEPTION 'Invalid cognitive anchor';
  END IF;
  IF p_structured_output IS NULL OR jsonb_typeof(p_structured_output) <> 'object' THEN
    RAISE EXCEPTION 'Invalid structured output';
  END IF;

  RETURN QUERY
  INSERT INTO public.mapping_sessions (raw_concept, cognitive_anchor, structured_output)
  VALUES (btrim(p_raw_concept), btrim(p_cognitive_anchor), p_structured_output)
  RETURNING mapping_sessions.id, mapping_sessions.session_token;
END;
$$;

CREATE OR REPLACE FUNCTION public.set_comprehension_score(
  p_session_id uuid,
  p_session_token uuid,
  p_score integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_updated integer;
BEGIN
  IF p_session_id IS NULL OR p_session_token IS NULL THEN
    RETURN false;
  END IF;
  IF p_score IS NULL OR p_score < 0 OR p_score > 100 THEN
    RAISE EXCEPTION 'Invalid score';
  END IF;

  UPDATE public.mapping_sessions
     SET comprehension_score = p_score
   WHERE id = p_session_id
     AND session_token = p_session_token;

  GET DIAGNOSTICS v_updated = ROW_COUNT;
  RETURN v_updated > 0;
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_tester_feedback(
  p_session_id uuid,
  p_tester_type text,
  p_clarity_rating integer,
  p_friction_rating integer,
  p_notes text,
  p_tester_id text DEFAULT NULL,
  p_tester_email text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_tester_type IS NULL OR btrim(p_tester_type) = '' OR length(p_tester_type) > 200 THEN
    RAISE EXCEPTION 'Invalid tester type';
  END IF;
  IF p_clarity_rating IS NULL OR p_clarity_rating < 1 OR p_clarity_rating > 5 THEN
    RAISE EXCEPTION 'Clarity rating must be between 1 and 5';
  END IF;
  IF p_friction_rating IS NULL OR p_friction_rating < 1 OR p_friction_rating > 5 THEN
    RAISE EXCEPTION 'Friction rating must be between 1 and 5';
  END IF;
  IF p_notes IS NOT NULL AND length(p_notes) > 5000 THEN
    RAISE EXCEPTION 'Notes are too long';
  END IF;
  IF p_tester_id IS NOT NULL AND length(p_tester_id) > 200 THEN
    RAISE EXCEPTION 'Invalid tester id';
  END IF;
  IF p_tester_email IS NOT NULL
     AND btrim(p_tester_email) <> ''
     AND p_tester_email !~* '^[^\s@]+@[^\s@]+\.[^\s@]+$' THEN
    RAISE EXCEPTION 'Invalid tester email';
  END IF;

  INSERT INTO public.tester_feedback (
    session_id, tester_type, clarity_rating, cognitive_friction_reduction_rating,
    qualitative_notes, tester_id, tester_email, is_verified_tester
  ) VALUES (
    p_session_id,
    btrim(p_tester_type),
    p_clarity_rating,
    p_friction_rating,
    NULLIF(btrim(coalesce(p_notes, '')), ''),
    NULLIF(btrim(coalesce(p_tester_id, '')), ''),
    NULLIF(lower(btrim(coalesce(p_tester_email, ''))), ''),
    false
  );

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.create_mapping_session(text, text, jsonb) FROM public;
REVOKE ALL ON FUNCTION public.set_comprehension_score(uuid, uuid, integer) FROM public;
REVOKE ALL ON FUNCTION public.submit_tester_feedback(uuid, text, integer, integer, text, text, text) FROM public;

GRANT EXECUTE ON FUNCTION public.create_mapping_session(text, text, jsonb) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.set_comprehension_score(uuid, uuid, integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.submit_tester_feedback(uuid, text, integer, integer, text, text, text) TO anon, authenticated, service_role;