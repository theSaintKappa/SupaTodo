import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { FinishSignUp } from "@/pages/FinishSignUp";
import { TodosView } from "@/pages/TodosView";
import { UserProfile } from "@/pages/UserProfile";
import supabase from "@/supabase";
import { Session } from "@supabase/supabase-js";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";

export function AuthenticatedUser({ session }: { session: Session }) {
    const { user } = session;
    const navigate = useNavigate();

    const [userName, setUserName] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    async function handleSignOut() {
        await supabase.auth.signOut();
        navigate("/");
    }

    useEffect(() => {
        async function fetchProfile() {
            if (user.app_metadata.provider === "email") {
                const { data, error } = await supabase.from("email_profiles").select("user_name, avatar_url").eq("id", user.id);
                if (error) throw error;
                if (data.length === 0) return navigate("/finish-signup");
                setUserName(data[0].user_name);
                setAvatarUrl(data[0].avatar_url);
                return;
            }
            setUserName(user.user_metadata.user_name);
            setAvatarUrl(user.user_metadata.avatar_url);
        }
        fetchProfile();
    }, [user, navigate]);

    return (
        <>
            <nav className="absolute flex right-0 gap-2 m-2">
                <ThemeToggle />
                {userName !== null ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Avatar>
                                <AvatarImage src={avatarUrl ?? undefined} alt={userName[0]} />
                                <AvatarFallback>{userName[0]}</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Hello, {userName}</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => navigate("/profile")} className="flex gap-2 items-center cursor-pointer">
                                <User className="h-4 w-4" />
                                Edit profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleSignOut} className="flex gap-2 items-center cursor-pointer">
                                <LogOut className="h-4 w-4" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <Button onClick={handleSignOut}>Log out</Button>
                )}
            </nav>

            <Routes>
                <Route path="/" element={<TodosView session={session} />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/finish-signup" element={<FinishSignUp user={session.user} />} />
            </Routes>
        </>
    );
}
