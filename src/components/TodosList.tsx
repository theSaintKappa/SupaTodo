import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import { cn } from "@/utils/cn";
import { Square, SquareCheckBig, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EditTodoDialog } from "@/components/EditTodoDialog";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const borderColors = ["border-green-500", "border-yellow-300", "border-red-500"];
const priorityText = ["Low", "Medium", "High"];

export function TodosList({ todos, todosLoading }: { todos: Tables<"todos">[]; todosLoading: boolean }) {
    const setCompleted = (id: number, completed: boolean) =>
        supabase
            .from("todos")
            .update({ completed })
            .eq("id", id)
            .then(() => toast.success(`Set Todo as ${completed ? "completed" : "incomplete"}!`));

    const deleteTodo = (id: number) =>
        supabase
            .from("todos")
            .delete()
            .eq("id", id)
            .then(() => toast.success("Todo has been deleted!"));

    if (!todosLoading && todos.length === 0)
        return (
            <div className="flex flex-col items-center gap-2 h-full justify-center text-center text-balance animate-in zoom-in duration-200">
                <h1 className="text-3xl md:text-4xl font-bold">You haven't added any todos yet!</h1>
                <p className="md:text-2xl text-gray-400">Why don't we get started by adding one shall we?</p>
            </div>
        );

    return (
        <div className="flex flex-col gap-4 py-4">
            {todos.map((todo) => (
                <Card key={todo.id} className={cn("flex flex-col items-start gap-2 md:flex-row md:items-center md:justify-between p-4 border-2 animate-in fade-in-0 slide-in-from-top-4 duration-300", todo.completed ? "border-opacity-40" : "border-opacity-75", borderColors[Number(todo.priority) - 1])}>
                    <CardHeader className={cn("p-0", todo.completed && "opacity-40")}>
                        <CardTitle className="flex items-center gap-2">
                            <span className={cn("break-all", todo.completed && "line-through")}>{todo.title}</span>
                            <Badge variant="outline" className={cn("border-2 border-opacity-75 hidden md:block", borderColors[Number(todo.priority) - 1])}>
                                {priorityText[Number(todo.priority) - 1]}
                            </Badge>
                        </CardTitle>
                        {todo.description && <CardDescription className="break-all">{todo.description}</CardDescription>}
                    </CardHeader>
                    <Separator className="md:hidden" />
                    <CardContent className="p-0 w-full flex items-center justify-between md:w-auto gap-2">
                        <div className="flex flex-row-reverse md:flex-row gap-2">
                            {todo.completed ? (
                                <>
                                    <Button variant="destructive" onClick={() => deleteTodo(todo.id)}>
                                        <Trash2 className="h-5 min-w-5" />
                                    </Button>
                                    <Button onClick={() => setCompleted(todo.id, !todo.completed)} className="px-8">
                                        <SquareCheckBig className="h-5 min-w-5" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <EditTodoDialog todo={todo} />
                                    <Button onClick={() => setCompleted(todo.id, !todo.completed)} className="px-8">
                                        <Square className="h-5 min-w-5" />
                                    </Button>
                                </>
                            )}
                        </div>
                        <Badge variant="outline" className={cn("border-2 border-opacity-75 block md:hidden", borderColors[Number(todo.priority) - 1])}>
                            {priorityText[Number(todo.priority) - 1]}
                        </Badge>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
