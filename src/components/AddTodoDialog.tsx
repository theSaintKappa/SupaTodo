import { Button } from "@/components/ui/button";
import { Dialog as UiDialog, DialogContent as UiDialogContent, DialogTrigger as UiDialogTrigger } from "@/components/ui/dialog";
import { Drawer as UiDrawer, DrawerContent as UiDrawerContent, DrawerTrigger as UiDrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useMediaQuery from "@/hooks/use-media-query";
import supabase from "@/supabase";
import { cn } from "@/utils/cn";
import { zodResolver } from "@hookform/resolvers/zod";
import { CirclePlus, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { FormSchema, type Priority } from "@/utils/todoFormSchema";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { useSession } from "@/components/SessionProvider";

const defaultPriority = "1";
const placeholderTodos = ["Buy eggs", "Call mom", "Go for a run", "Read a book", "Cook dinner", "Do the laundry", "Water the plants"];

export function AddTodoDialog() {
    const { session } = useSession();

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [randomPlaceholder, setRandomPlaceholder] = useState("");

    const isDesktop = useMediaQuery("(min-width: 768px)");

    const DialogType = useMemo(() => (isDesktop ? UiDialog : UiDrawer), [isDesktop]);
    const DialogTrigger = useMemo(() => (isDesktop ? UiDialogTrigger : UiDrawerTrigger), [isDesktop]);
    const DialogContent = useMemo(() => (isDesktop ? UiDialogContent : UiDrawerContent), [isDesktop]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { title: "", description: "", priority: defaultPriority },
    });

    async function handleSubmit({ title, description, priority }: z.infer<typeof FormSchema>) {
        setLoading(true);
        if (!session) return;
        const { error } = await supabase.from("todos").insert({ title, description, priority: priority, user_id: session.user.id });
        setLoading(false);
        setOpen(false);
        error ? toast.error("An error occurred while adding the Todo.", { description: "Try again later." }) : toast.success("Todo added successfully.", { description: title });
    }

    useEffect(() => {
        open && setRandomPlaceholder(placeholderTodos[Math.floor(Math.random() * placeholderTodos.length)]);
    }, [open]);

    return (
        <DialogType open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-3 px-8 py-6">
                    <CirclePlus className="h-7 min-w-7" strokeWidth={2.75} />
                    <span className="font-bold">Add Todo</span>
                </Button>
            </DialogTrigger>
            <DialogContent className={isDesktop ? "py-10" : "pb-8"}>
                <div className="flex flex-col gap-2">
                    <h1 className={cn("text-3xl font-black text-center", !isDesktop && "mt-4")}>Add a Todo ➕</h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-[22rem] mx-auto flex flex-col gap-4">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormControl>
                                            <Input placeholder={randomPlaceholder} {...field} />
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
                                            <Textarea className="max-h-48" {...field} />
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
                                            <ToggleGroup onValueChange={(value: Priority) => form.setValue("priority", value)} defaultValue={defaultPriority} type="single" variant="outline" className="justify-start">
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
                            <Button type="submit" className="mt-4" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 min-w-4 animate-spin" />}Save
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </DialogType>
    );
}
