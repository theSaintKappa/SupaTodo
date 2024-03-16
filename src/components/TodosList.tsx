import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import { cn } from "@/utils/cn";
import { CheckCheck, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

function setCompleted(id: number, completed: boolean) {
    supabase.from("todos").update({ completed }).eq("id", id).then(console.log);
}

function deleteTodo(id: number) {
    supabase.from("todos").delete().eq("id", id).then(console.log);
}

export function TodosList({ todos }: { todos: Tables<"todos">[] }) {
    const borderColors = ["border-green-500", "border-yellow-300", "border-red-600"];
    const priorityText = ["Low", "Medium", "High"];

    return (
        <div className="flex flex-col gap-4 py-4">
            {todos.map((todo) => (
                <Card key={todo.id} className={cn("flex items-center justify-between p-4 border-2 border-opacity-75", borderColors[todo.priority - 1])}>
                    <CardHeader className={cn("p-0", todo.completed && "opacity-75")}>
                        <CardTitle className={cn("flex items-center gap-2", todo.completed && "line-through")}>
                            {todo.title}
                            <Badge variant="outline" className={cn("border-2 border-opacity-75", borderColors[todo.priority - 1])}>
                                {priorityText[todo.priority - 1]}
                            </Badge>
                        </CardTitle>
                        {todo.description && <CardDescription>{todo.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="p-0 flex gap-2">
                        {!todo.completed ? (
                            <Button variant="outline">
                                <SquarePen className="h-5 min-w-5" />
                            </Button>
                        ) : (
                            <Button variant="destructive" onClick={() => deleteTodo(todo.id)}>
                                <Trash2 className="h-5 min-w-5" />
                            </Button>
                        )}
                        <Button onClick={() => setCompleted(todo.id, !todo.completed)}>
                            <CheckCheck className="h-5 min-w-5" />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
