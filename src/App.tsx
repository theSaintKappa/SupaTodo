import { AuthenticatedUser } from "@/components/AuthenticatedUser";
import { SignInCard } from "@/components/SignInCard";
import supabase from "@/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

function App() {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setIsLoading(false);
        });
        return () => data.subscription.unsubscribe();
    }, []);

    return (
        <Routes>
            <Route path="/" element={session ? <Navigate to="/todos" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<SignInCard />} />
            <Route path="/todos" element={<AuthenticatedUser key={session?.user.id} isLoading={isLoading} session={session} />} />
        </Routes>
    );
}

export default App;
