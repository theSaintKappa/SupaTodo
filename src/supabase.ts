import { createClient } from "@supabase/supabase-js";
import { Database } from "./types/db.types";

const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default supabase;
