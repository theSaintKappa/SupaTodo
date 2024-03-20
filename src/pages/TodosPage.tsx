import { TodoList } from "@/components/TodoList";
import { TodoOrderProvider } from "@/components/TodoOrderProvider";
import { CompleteProfileAlert } from "@/components/CompleteProfileAlert";

export function TodosPage() {
    return (
        <>
            <TodoOrderProvider>
                <TodoList />
            </TodoOrderProvider>
            <CompleteProfileAlert />
        </>
    );
}
