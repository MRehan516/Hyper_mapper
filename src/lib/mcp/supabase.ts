import { createClient } from "@supabase/supabase-js";

type RuntimeGlobals = typeof globalThis & {
  process?: { env?: Record<string, string | undefined> };
};

function runtimeEnv(name: string): string | undefined {
  const runtime = globalThis as RuntimeGlobals;
  return runtime.process?.env?.[name];
}

function configuredEnv(names: readonly string[]): string | undefined {
  for (const name of names) {
    const fromRuntime = runtimeEnv(name)?.trim();
    if (fromRuntime) return fromRuntime;
    const fromBuild = (import.meta.env as Record<string, string | undefined>)[name]?.trim();
    if (fromBuild) return fromBuild;
  }
  return undefined;
}

function projectUrl(): string {
  const url = configuredEnv(["SUPABASE_URL", "VITE_SUPABASE_URL"]);
  if (!url) throw new Error("Supabase is not connected: VITE_SUPABASE_URL is missing.");
  return url;
}

function publishableKey(): string {
  const key = configuredEnv([
    "SUPABASE_ANON_KEY",
    "VITE_SUPABASE_ANON_KEY",
    "SUPABASE_PUBLISHABLE_KEY",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
  ]);
  if (!key) throw new Error("Supabase is not connected: VITE_SUPABASE_ANON_KEY is missing.");
  return key;
}

/** No caller identity — RLS runs as `anon`, exactly like the public web app. */
export function supabaseAnon() {
  return createClient(projectUrl(), publishableKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
