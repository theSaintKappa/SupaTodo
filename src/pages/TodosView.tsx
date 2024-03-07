import { TodoDialog } from "@/components/TodoDialog";
import { TodoSort } from "@/components/TodoSort";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
            <main className="w-full max-w-2xl p-6 flex flex-col">
                <div className="flex gap-4 justify-between">
                    <TodoDialog userId={userProfile.id} />
                    <TodoSort />
                </div>
            </main>

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
