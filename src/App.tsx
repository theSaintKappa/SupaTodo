import { AuthenticatedUser } from "@/components/AuthenticatedUser";
import { SignInCard } from "@/components/SignInCard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import supabase from "@/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

function App() {
    const [session, setSession] = useState<Session | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));

        return () => subscription.unsubscribe();
    }, []);

    return (
        <ThemeProvider defaultTheme="system" storageKey="theme">
            <Toaster />
            {!session ? <SignInCard /> : <AuthenticatedUser key={session.user.id} session={session} />}
        </ThemeProvider>
    );
}

export default App;
