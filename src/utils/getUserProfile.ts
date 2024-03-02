import supabase from "@/supabase";
import { User } from "@supabase/supabase-js";

interface UserProfile {
    user_name: string;
    avatar_url: string;
}

export async function getUserProfile(user: User): Promise<UserProfile | null> {
    const { user_name, avatar_url } = user.user_metadata;

    if (user.app_metadata.provider === "email") {
        const { data, error } = await supabase.from("email_profiles").select("user_name, avatar_url").eq("id", user.id);
        if (error) throw error;
        if (data.length === 0) return null;
        return data[0] as UserProfile;
    }

    return { user_name, avatar_url };
}
