import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

export function createServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
  const supabaseServiceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || "mock-service-key";

  return createClient<Database>(supabaseUrl, supabaseServiceKey);
}
