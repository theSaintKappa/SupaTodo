import { Button } from "@/components/ui/button";
import { Dialog as UiDialog, DialogContent as UiDialogContent, DialogTrigger as UiDialogTrigger } from "@/components/ui/dialog";
import { Drawer as UiDrawer, DrawerContent as UiDrawerContent, DrawerTrigger as UiDrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useMediaQuery from "@/hooks/use-media-query";
import supabase from "@/supabase";
import type { Tables } from "@/types/db.types";
import { cn } from "@/utils/cn";
import type { Priority } from "@/utils/todoFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, SaveAll, SquarePen, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { FormSchema } from "@/utils/todoFormSchema";

export function EditTodoDialog({ todo }: { todo: Tables<"todos"> }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const DialogType = useMemo(() => (isDesktop ? UiDialog : UiDrawer), [isDesktop]);
    const DialogTrigger = useMemo(() => (isDesktop ? UiDialogTrigger : UiDrawerTrigger), [isDesktop]);
    const DialogContent = useMemo(() => (isDesktop ? UiDialogContent : UiDrawerContent), [isDesktop]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { title: todo.title, description: todo.description ?? "", priority: todo.priority.toString() as Priority },
    });

    async function handleSubmit({ title, description, priority }: z.infer<typeof FormSchema>) {
        setLoading(true);
        const { error } = await supabase.from("todos").update({ title, description, priority }).eq("id", todo.id);
        setLoading(false);
        setOpen(false);
        error ? toast.error("An error occurred while editing the Todo.", { description: "Try again later." }) : toast.success("Todo edited successfully.", { description: title });
    }

    async function removeTodo() {
        setOpen(false);
        const { error } = await supabase.from("todos").delete().eq("id", todo.id);
        error ? toast.error("An error occurred while deleting the Todo.", { description: "Try again later." }) : toast.success("Todo deleted successfully.", { description: todo.title });
    }

    return (
        <DialogType open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <SquarePen className="h-5 min-w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className={isDesktop ? "py-10" : "px-6 pb-6"}>
                <div className="flex flex-col gap-2">
                    <h1 className={cn("text-3xl font-black text-center", !isDesktop && "mt-4")}>Edit Todo ✏️</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-[22rem] mx-auto flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder={todo.title} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Description <span className="opacity-50 text-xs">(optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea placeholder={todo.description ?? undefined} className="max-h-48" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="priority"
                                render={() => (
                                    <FormItem>
                                        <FormLabel>Priority</FormLabel>
                                        <FormControl>
                                            <ToggleGroup onValueChange={(value: Priority) => form.setValue("priority", value)} defaultValue={todo.priority.toString()} type="single" variant="outline" className="justify-start">
                                                <ToggleGroupItem value="1" aria-label="Low priority">
                                                    <span className="text-green-500">Low</span>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="2" aria-label="Medium priority">
                                                    <span className="text-yellow-300">Medium</span>
                                                </ToggleGroupItem>
                                                <ToggleGroupItem value="3" aria-label="High priority">
                                                    <span className="text-red-500">High</span>
                                                </ToggleGroupItem>
                                            </ToggleGroup>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="mt-4 flex gap-4">
                                <Button type="button" variant="destructive" className="flex items-center gap-1 w-full" onClick={removeTodo} disabled={loading}>
                                    <Trash2 className="h-4 min-w-4" />
                                    Remove
                                </Button>
                                <Button type="submit" className="flex items-center gap-1 w-full" disabled={loading}>
                                    {loading ? <Loader2 className="h-4 min-w-4 animate-spin" /> : <SaveAll className="h-4 min-w-4" />}Save
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </DialogType>
    );
}
