import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TodosView } from "@/pages/TodosView";
import { UserProfile } from "@/pages/UserProfile";
import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import { getUserProfile } from "@/utils/getUserProfile";
import type { Session } from "@supabase/supabase-js";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TodoOrderProvider } from "./TodoOrderProvider";

export function AuthenticatedUser({ session, isLoading }: { session: Session | null; isLoading: boolean }) {
    // const { user } = session;
    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState<Tables<"profiles"> | null>(null);

    async function handleSignOut() {
        await supabase.auth.signOut();
        toast("You have been signed out.");
        navigate("/login", { replace: true });
    }

    useEffect(() => {
        async function fetchUserProfile() {
            if (!session) return;
            const profile = await getUserProfile(session.user);
            setUserProfile(profile);
        }

        fetchUserProfile();

        const profileChannel = supabase
            .channel("profile_updates")
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, (payload) => setUserProfile(payload.new as Tables<"profiles">))
            .subscribe();

        return () => {
            supabase.removeChannel(profileChannel);
        };
    }, [session]);

    useEffect(() => {
        if (!session && !isLoading) navigate("/login");
    }, [session, isLoading, navigate]);

    if (!session && isLoading) return <h1>Loading todos...</h1>;

    if (session)
        return (
            <>
                <nav className="absolute flex right-0 gap-2 m-2">
                    <ThemeToggle />
                    {userProfile && userProfile.user_name !== null ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Avatar>
                                    <AvatarImage src={userProfile.avatar_url ?? undefined} alt={userProfile.user_name[0]} />
                                    <AvatarFallback>{userProfile.user_name[0]}</AvatarFallback>
                                </Avatar>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuLabel>Hello, {userProfile.user_name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => navigate("/profile")} className="flex gap-2 items-center cursor-pointer">
                                    <User className="h-4 min-w-4" />
                                    Edit profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleSignOut} className="flex gap-2 items-center cursor-pointer">
                                    <LogOut className="h-4 min-w-4" />
                                    Log out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button onClick={handleSignOut}>Log out</Button>
                    )}
                </nav>

                <Routes>
                    <Route
                        path="/"
                        element={
                            <TodoOrderProvider>
                                <TodosView user={session.user} userProfile={userProfile} />
                            </TodoOrderProvider>
                        }
                    />
                    <Route path="/profile" element={<UserProfile userProfile={userProfile} user={session.user} />} />
                </Routes>
            </>
        );
}
