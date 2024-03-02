import { Button } from "@/components/ui/button";
import supabase from "@/supabase";
import { Loader2, LogOut } from "lucide-react";
import { useState } from "react";

export function SignOutButton() {
    const [loading, setLoading] = useState(false);

    async function signOut() {
        setLoading(true);
        await supabase.auth.signOut();
    }

    return (
        <Button className="gap-2" onClick={signOut} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut />}
            Sign Out
        </Button>
    );
}
