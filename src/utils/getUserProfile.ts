import supabase from "@/supabase";
import { Tables } from "@/types/db.types";
import { User } from "@supabase/supabase-js";

export async function getUserProfile(user: User): Promise<Tables<"profiles">> {
    const { data, error } = await supabase.from("profiles").select().eq("id", user.id).limit(1).single();
    if (error) throw error;

    // User data from database
    const { id, has_finished_signup, sync_with_provider } = data;

    // User data from provider
    const { user_name, avatar_url } = user.user_metadata;

    if (sync_with_provider) return { id, user_name, avatar_url, has_finished_signup, sync_with_provider };
    return data;
}
