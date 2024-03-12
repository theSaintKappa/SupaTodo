import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Tables } from "@/types/db.types";
import { cn } from "@/utils/cn";
import { CheckCheck, SquarePen, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function TodosList({ todos }: { todos: Tables<"todos">[] }) {
    const priorityColors = ["green-500", "yellow-300", "red-600"];
    const priorityText = ["Low", "Medium", "High"];

    return (
        <div className="flex flex-col gap-4 py-4">
            {todos.map((todo) => (
                <Card key={todo.id} className={`flex items-center justify-between p-4 border-2 border-opacity-90 border-${priorityColors[todo.priority - 1]}`}>
                    <CardHeader className="p-0">
                        <CardTitle className={cn("flex items-center gap-2", todo.completed && "line-through")}>
                            {todo.title}
                            <Badge className={`border-2 border-opacity-90 border-${priorityColors[todo.priority - 1]}`}>{priorityText[todo.priority - 1]}</Badge>
                        </CardTitle>
                        {todo.description && <CardDescription>{todo.description}</CardDescription>}
                    </CardHeader>
                    <CardContent className="p-0 flex gap-2">
                        {!todo.completed ? (
                            <Button variant="outline">
                                <SquarePen />
                            </Button>
                        ) : (
                            <Button variant="destructive">
                                <Trash2 />
                            </Button>
                        )}
                        <Button>
                            <CheckCheck />
                        </Button>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
