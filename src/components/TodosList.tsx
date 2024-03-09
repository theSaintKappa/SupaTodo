import type { Tables } from "@/types/db.types";

export function TodosList({ todos }: { todos: Tables<"todos">[] }) {
    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo.id}>{todo.title}</li>
            ))}
        </ul>
    );
}
