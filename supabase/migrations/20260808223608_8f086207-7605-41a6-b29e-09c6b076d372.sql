ALTER TABLE public.tester_feedback
  ADD COLUMN IF NOT EXISTS tester_email text,
  ADD COLUMN IF NOT EXISTS tester_id text;