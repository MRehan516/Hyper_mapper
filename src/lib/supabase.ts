import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env['VITE_SUPABASE_URL'] as string | undefined;
const anonKey =
  (import.meta.env['VITE_SUPABASE_ANON_KEY'] as string | undefined) ??
  (import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY'] as string | undefined);

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export const MISSING_CONFIG_MESSAGE =
  "Supabase is not connected yet. Add your project URL and anon key (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) in the Integrations panel, then retry.";

export type Mapping = {
  concept_element: string;
  anchor_equivalent: string;
  explanation: string;
};

export type ComprehensionQuestion = {
  question: string;
  options: string[];
  correct_answer?: string;
  correct_index?: number;
  explanation?: string;
};

export type ConceptMapPayload = {
  concept_summary: string;
  mappings: Mapping[];
  comprehension_check: ComprehensionQuestion[];
};
