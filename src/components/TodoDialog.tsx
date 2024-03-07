import { Button } from "@/components/ui/button";
import { Dialog as UiDialog, DialogContent as UiDialogContent, DialogTrigger as UiDialogTrigger } from "@/components/ui/dialog";
import { Drawer as UiDrawer, DrawerContent as UiDrawerContent, DrawerTrigger as UiDrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useMediaQuery from "@/hooks/use-media-query";
import supabase from "@/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { BadgePlus, BookmarkPlus, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export function TodoDialog({ userId }: { userId: string }) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const DialogType = useMemo(() => (isDesktop ? UiDialog : UiDrawer), [isDesktop]);
    const DialogTrigger = useMemo(() => (isDesktop ? UiDialogTrigger : UiDrawerTrigger), [isDesktop]);
    const DialogContent = useMemo(() => (isDesktop ? UiDialogContent : UiDrawerContent), [isDesktop]);

    return (
        <DialogType open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex gap-2 px-8 py-6">
                    <BookmarkPlus className="h-6 min-w-6" />
                    <span className="font-semibold">Add Todo</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <AddTodoForm userId={userId} setOpen={setOpen} />
            </DialogContent>
        </DialogType>
    );
}

const FormSchema = z.object({
    title: z.string().min(1, { message: "Please provide a Todo title." }).max(64, { message: "The title must be less than 64 characters." }),
    description: z.string().max(256, { message: "The description must be less than 256 characters." }).optional(),
    priority: z.enum(["1", "2", "3"]).default("1"),
});
type Priority = z.infer<typeof FormSchema>["priority"];

const placeholderTodos = ["Buy eggs", "Call mom", "Go for a run", "Read a book", "Cook dinner", "Do the laundry", "Water the plants"];

function AddTodoForm({ userId, setOpen }: { userId: string; setOpen: (open: boolean) => void }) {
    const [loading, setLoading] = useState(false);
    const [priority, setPriority] = useState<Priority>("1");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { title: "", description: "", priority },
    });

    async function handleSubmit({ title, description }: z.infer<typeof FormSchema>) {
        setLoading(true);
        console.log({ title, description, priority });
        const { error } = await supabase.from("todos").insert({ title, description, priority: Number(priority), user_id: userId });
        setOpen(false);
        setLoading(false);
        error ? toast.error("An error occurred while adding the Todo.") : toast.success("Todo added successfully.", { description: title });
    }

    return (
        <div className="my-4 p-6 flex flex-col gap-2">
            <h1 className="text-3xl font-black text-center">Add a Todo</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full max-w-[22rem] mx-auto flex flex-col gap-4">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder={placeholderTodos[Math.floor(Math.random() * placeholderTodos.length)]} {...field} />
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
                                <FormLabel className="">
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
                                    <ToggleGroup onValueChange={(value: Priority) => setPriority(value)} defaultValue="1" type="single" variant="outline" className="justify-start">
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
                        {!loading ? <BadgePlus className="mr-2 h-4 min-w-4" /> : <Loader2 className="mr-2 h-4 min-w-4 animate-spin" />}Add
                    </Button>
                </form>
            </Form>
        </div>
    );
}
