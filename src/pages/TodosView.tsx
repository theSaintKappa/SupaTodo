import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tables } from "@/types/db.types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function TodosView({ userProfile }: { userProfile: Tables<"profiles"> }) {
    const navigate = useNavigate();
    const [alertOpen, setAlertOpen] = useState(false);

    useEffect(() => {
        const alertTimeout = setTimeout(() => !userProfile.has_finished_signup && setAlertOpen(true), 2000);
        return () => clearTimeout(alertTimeout);
    }, [userProfile.has_finished_signup]);

    return (
        <>
            <main>Hello {userProfile?.id}</main>

            <AlertDialog open={alertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Finish creating your account</AlertDialogTitle>
                        <AlertDialogDescription>Customize your profile by adding a user name and avatar</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setAlertOpen(false)}>Later</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                setAlertOpen(false);
                                navigate("/profile");
                            }}
                        >
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
