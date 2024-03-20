import { useSession } from "@/components/SessionProvider";
import { TodoDialog } from "@/components/TodoDialog";
import { TodoOrder } from "@/components/TodoOrder";
import { useTodoOrder } from "@/components/TodoOrderProvider";
import { TodosList } from "@/components/TodosList";
import useMediaQuery from "@/hooks/use-media-query";
import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import { cn } from "@/utils/cn";
import type { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function TodoList() {
    const isDesktop = useMediaQuery("(min-width: 1200px)");
    const isTablet = useMediaQuery("(min-width: 768px)");

    const { session, sessionLoading } = useSession();

    const [todos, setTodos] = useState<Tables<"todos">[]>([]);
    const { sortBy, order } = useTodoOrder();

    useEffect(() => {
        if (!session) return;

        async function fetchTodos({ id }: User) {
            const { data } = await supabase
                .from("todos")
                .select("*")
                .eq("user_id", id)
                .order("completed")
                .order(sortBy, { ascending: order === "asc" });
            data && setTodos(data);
        }

        fetchTodos(session.user);

        const todosChannel = supabase
            .channel("todo_updates")
            .on("postgres_changes", { event: "*", schema: "public", table: "todos" }, () => fetchTodos(session.user))
            .subscribe();

        return () => {
            supabase.removeChannel(todosChannel);
        };
    }, [session, sortBy, order]);

    if (sessionLoading || !session) return <h1>Loading todos...</h1>;

    return (
        <>
            <main className="w-full max-w-2xl p-6 flex flex-col">
                <div className={cn("flex gap-4 transition-all", isDesktop ? "justify-between" : "justify-start", !isTablet && "absolute bottom-0 right-0 m-4 flex-row-reverse")}>
                    <TodoDialog userId={session.user.id} />
                    <TodoOrder />
                </div>
                <TodosList todos={todos} />
            </main>
        </>
    );
}
