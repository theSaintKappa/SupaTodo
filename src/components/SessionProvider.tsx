import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import { getUserProfile } from "@/utils/getUserProfile";
import type { AuthError, PostgrestError, Session } from "@supabase/supabase-js";
import { type PropsWithChildren, createContext, useEffect, useMemo, useState, useContext } from "react";

interface SessionContext {
    sessionLoading: boolean;
    session: Session | null;
    profileLoading: boolean;
    profile: Tables<"profiles"> | null;
    error: AuthError | PostgrestError | null;
}

const initialState: SessionContext = {
    sessionLoading: true,
    session: null,
    profileLoading: true,
    profile: null,
    error: null,
};

const SessionProviderContext = createContext<SessionContext>(initialState);

export const SessionProvider = ({ children }: PropsWithChildren) => {
    const [sessionLoading, setSessionLoading] = useState<typeof initialState.sessionLoading>(initialState.sessionLoading);
    const [session, setSession] = useState<typeof initialState.session>(initialState.session);
    const [profileLoading, setProfileLoading] = useState<typeof initialState.profileLoading>(initialState.profileLoading);
    const [profile, setProfile] = useState<typeof initialState.profile>(initialState.profile);
    const [error, setError] = useState<typeof initialState.error>(initialState.error);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session }, error }) => {
            setSessionLoading(false);
            if (!error) return setSession(session);
            setError(error);
            setProfileLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    // useEffect(() => {
    //     console.log({ sessionLoading, session, profileLoading, profile, error });
    // }, [sessionLoading, session, profileLoading, profile, error]);

    useEffect(() => {
        if (!session?.user) return;

        getUserProfile(session.user).then((profile) => {
            setProfile(profile);
            setProfileLoading(false);
        });

        const profileChannel = supabase
            .channel("profile_updates")
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, () => getUserProfile(session.user).then((profile) => setProfile(profile)))
            .subscribe();

        return () => {
            profileChannel.unsubscribe();
        };
    }, [session?.user]);

    const value: SessionContext = useMemo(() => ({ sessionLoading, session, profileLoading, profile, error }), [sessionLoading, session, profileLoading, profile, error]);

    return <SessionProviderContext.Provider value={value}>{children}</SessionProviderContext.Provider>;
};

export const useSession = () => {
    const context = useContext(SessionProviderContext);

    if (context === undefined) throw new Error("useSession must be used within a SessionProvider");

    return context;
};
