import { TodosPage } from "@/pages/TodosPage";
import { SignInCard } from "@/components/SignInCard";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSession } from "@/components/SessionProvider";
import { ProfilePage } from "@/pages/ProfilePage";
import { useEffect } from "react";
import { Navigation } from "@/components/Navigation";

function App() {
    const { session, sessionLoading } = useSession();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!session && !sessionLoading) return navigate("/login");
        if (location.pathname === "/" || location.pathname === "/login") navigate("/todos");
    }, [session, sessionLoading, navigate, location.pathname]);

    return (
        <>
            <Navigation />
            <Routes>
                <Route path="/" element={!session && !sessionLoading ? <Navigate to="/login" /> : <Navigate to="/todos" />} />
                <Route path="/login" element={<SignInCard />} />
                <Route path="/todos" element={<TodosPage key={session?.user.id} />} />
                <Route path="/profile" element={<ProfilePage />} />
            </Routes>
        </>
    );
}

export default App;
