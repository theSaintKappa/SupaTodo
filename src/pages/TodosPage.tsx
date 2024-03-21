import { CompleteProfileAlert } from "@/components/CompleteProfileAlert";
import { useSession } from "@/components/SessionProvider";
import { AddTodoDialog } from "@/components/AddTodoDialog";
import { TodoOrder } from "@/components/TodoOrder";
import { useTodoOrder } from "@/components/TodoOrderProvider";
import { TodosList } from "@/components/TodosList";
import useMediaQuery from "@/hooks/use-media-query";
import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import { cn } from "@/utils/cn";
import { useEffect, useState } from "react";

export function TodosPage() {
    const isDesktop = useMediaQuery("(min-width: 1200px)");
    const isTablet = useMediaQuery("(min-width: 768px)");

    const { session } = useSession();
    const { sortBy, order } = useTodoOrder();

    const [todos, setTodos] = useState<Tables<"todos">[]>([]);
    const [todosLoading, setTodosLoading] = useState(true);

    const fetchTodos = () =>
        session &&
        supabase
            .from("todos")
            .select("*")
            .eq("user_id", session.user.id)
            .order("completed")
            .order(sortBy, { ascending: order === "asc" })
            .then(({ data }) => {
                if (!data) return;
                setTodos(data);
                setTodosLoading(false);
            });

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        session && fetchTodos();
    }, [order, sortBy]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        if (!session) return;

        const todosChannel = supabase
            .channel("todo_updates")
            .on("postgres_changes", { event: "*", schema: "public", table: "todos" }, () => fetchTodos())
            .subscribe();

        return () => {
            supabase.removeChannel(todosChannel);
        };
    }, []);

    return (
        <>
            <main className="w-full max-w-3xl p-6 flex flex-col">
                <div className={cn("flex gap-4", isDesktop ? "justify-between" : "justify-start", !isTablet && "absolute bottom-0 right-0 m-4 flex-row-reverse")}>
                    <AddTodoDialog />
                    <TodoOrder />
                </div>
                <TodosList todos={todos} todosLoading={todosLoading} />
            </main>
            <CompleteProfileAlert />
        </>
    );
}
