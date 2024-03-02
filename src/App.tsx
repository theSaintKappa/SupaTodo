import { SignInCard } from "@/components/SignInCard";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import supabase from "@/supabase";
import { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { SignOutButton } from "./components/SignOutButton";

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
        <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
            <ThemeToggle />
            {session ? <SignOutButton /> : <SignInCard />}
        </ThemeProvider>
    );
}

export default App;
