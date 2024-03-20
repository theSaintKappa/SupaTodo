import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import type { User, UserIdentity } from "@supabase/supabase-js";

export async function getUserProfile(user: User): Promise<Tables<"profiles">> {
    const getCurrentIdentity = () => (Object.keys(user.user_metadata) ? user.user_metadata : (user.identities?.findLast((identity) => identity.provider !== "email")?.identity_data as UserIdentity["identity_data"]));

    const { data, error } = await supabase.from("profiles").select().eq("id", user.id).limit(1).single();
    if (error) throw error;

    // User data from database
    const { has_finished_signup, sync_with_provider } = data;

    if (!sync_with_provider) return data;

    const currentIdentity = getCurrentIdentity();

    // User data from provider
    return {
        id: user.id,
        user_name: currentIdentity?.preferred_username ?? currentIdentity?.user_name ?? currentIdentity?.name ?? currentIdentity?.full_name ?? null,
        avatar_url: currentIdentity?.avatar_url ?? null,
        has_finished_signup,
        sync_with_provider,
    };
}
