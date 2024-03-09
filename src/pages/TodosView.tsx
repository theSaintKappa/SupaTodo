import { TodoDialog } from "@/components/TodoDialog";
import { TodoOrder } from "@/components/TodoOrder";
import { useTodoOrder } from "@/components/TodoOrderProvider";
import { TodosList } from "@/components/TodosList";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import useMediaQuery from "@/hooks/use-media-query";
import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import { cn } from "@/utils/cn";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function TodosView({ user, userProfile }: { user: User; userProfile: Tables<"profiles"> | null }) {
    const isDesktop = useMediaQuery("(min-width: 1200px)");
    const isTablet = useMediaQuery("(min-width: 768px)");

    const navigate = useNavigate();

    const [alertOpen, setAlertOpen] = useState(false);

    const [todos, setTodos] = useState<Tables<"todos">[]>([]);
    const { sortBy, order } = useTodoOrder();

    useEffect(() => {
        async function fetchTodos() {
            const { data } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", user.id)
                .order(sortBy, { ascending: order === "asc" });
            data && setTodos(data);
            console.log("fetching todos");
        }

        fetchTodos();

        const todosChannel = supabase
            .channel("todo_updates")
            .on("postgres_changes", { event: "*", schema: "public", table: "todos" }, () => fetchTodos())
            .subscribe();

        return () => {
            supabase.removeChannel(todosChannel);
        };
    }, [user.id, sortBy, order]);

    useEffect(() => {
        const alertTimeout = userProfile && !userProfile.has_finished_signup && setTimeout(() => setAlertOpen(true), 1000);

        return () => {
            alertTimeout && clearTimeout(alertTimeout);
        };
    }, [userProfile]);

    return (
        <>
            <main className="w-full max-w-2xl p-6 flex flex-col">
                <div className={cn("flex gap-4 transition-all", isDesktop ? "justify-between" : "justify-start", !isTablet && "absolute bottom-0 right-0 m-4 flex-row-reverse")}>
                    <TodoDialog userId={user.id} />
                    <TodoOrder />
                </div>
                {sortBy} ({order})
                <TodosList todos={todos} />
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
