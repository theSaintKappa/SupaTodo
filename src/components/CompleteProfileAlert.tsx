import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "./SessionProvider";
import { ArrowRightCircle } from "lucide-react";

export function CompleteProfileAlert() {
    const [open, setOpen] = useState(false);
    const { profile } = useSession();
    const navigate = useNavigate();

    function closeAlert() {
        setOpen(false);
        window.sessionStorage.setItem("hasCompletedSignup", "true");
    }

    function redirect() {
        closeAlert();
        navigate("/profile");
    }

    useEffect(() => {
        let timeout: Timer;
        if (profile && !profile.has_finished_signup && !window.sessionStorage.getItem("hasCompletedSignup")) timeout = setTimeout(() => setOpen(true), 1000);
        return () => clearTimeout(timeout);
    }, [profile]);

    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-xl mb-1">Finish creating your account ✨</AlertDialogTitle>
                    <AlertDialogDescription>Customize your profile by adding a user name and avatar.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={closeAlert}>I'll do it later</AlertDialogCancel>
                    <AlertDialogAction onClick={redirect} autoFocus={true}>
                        Continue <ArrowRightCircle className="min-w-4 h-4 ml-1" />
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
