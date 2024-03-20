import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { LogOut, User, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSession } from "@/components/SessionProvider";
import supabase from "@/supabase";

export function Navigation() {
    const { session, profile } = useSession();
    const navigate = useNavigate();

    async function handleSignOut() {
        await supabase.auth.signOut();
        sessionStorage.removeItem("hasCompletedSignup");
        toast("You have been signed out.");
        navigate("/login");
    }

    return (
        <nav className="absolute flex right-0 top-0 gap-2 m-2">
            <ThemeToggle />
            {session && (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Avatar>
                            <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.user_name?.[0] ?? undefined} />
                            <AvatarFallback>
                                <UserRound />
                            </AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {profile?.user_name && (
                            <>
                                <DropdownMenuLabel className="font-medium">Hi there, {profile?.user_name}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                            </>
                        )}
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
            )}
        </nav>
    );
}
