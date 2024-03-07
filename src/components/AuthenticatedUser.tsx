import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TodosView } from "@/pages/TodosView";
import { UserProfile } from "@/pages/UserProfile";
import supabase from "@/supabase";
import { Tables } from "@/types/db.types";
import { getUserProfile } from "@/utils/getUserProfile";
import { Session } from "@supabase/supabase-js";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function AuthenticatedUser({ session }: { session: Session }) {
    const { user } = session;
    const navigate = useNavigate();

    const [userProfile, setUserProfile] = useState<Tables<"profiles">>({ id: "", user_name: "", avatar_url: "", has_finished_signup: true, sync_with_provider: false });

    async function handleSignOut() {
        await supabase.auth.signOut();
        toast("You have been signed out.");
        navigate("/");
    }

    useEffect(() => {
        async function fetchUserProfile() {
            if (user) {
                const profile = await getUserProfile(user);
                setUserProfile(profile);
            }
        }
        fetchUserProfile();

        supabase
            .channel("profile_updates")
            .on("postgres_changes", { event: "UPDATE", schema: "public", table: "profiles" }, (payload) => {
                setUserProfile(payload.new as Tables<"profiles">);
            })
            .subscribe();
    }, [user]);

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
                <Route path="/" element={<TodosView userProfile={userProfile} />} />
                <Route path="/profile" element={<UserProfile userProfile={userProfile} user={user} />} />
            </Routes>
        </>
    );
}
