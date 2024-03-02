import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useMediaQuery from "@/hooks/use-media-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

export function EmailSignInDialog() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const ComponentType = useMemo(() => (isDesktop ? Dialog : Drawer), [isDesktop]);
    const ComponentTrigger = useMemo(() => (isDesktop ? DialogTrigger : DrawerTrigger), [isDesktop]);
    const ComponentContent = useMemo(() => (isDesktop ? DialogContent : DrawerContent), [isDesktop]);
    const componentProps = useMemo(() => isDesktop && { hideXIcon: isDesktop }, [isDesktop]);

    return (
        <ComponentType open={open} onOpenChange={setOpen}>
            <ComponentTrigger asChild>
                <Button variant="link" className="p-0 h-fit">
                    Continue with Email →
                </Button>
            </ComponentTrigger>
            <ComponentContent {...componentProps} className="p-0">
                <EmailAuthForm />
            </ComponentContent>
        </ComponentType>
    );
}

const FormSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
});
type AuthAction = "signIn" | "signUp";

function EmailAuthForm({ className }: React.ComponentProps<"form">) {
    const [action, setAction] = useState<AuthAction>("signIn");
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { email: "", password: "" },
    });

    async function handleAuth(data: z.infer<typeof FormSchema>) {
        setLoading(true);
        console.log(data, action);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setLoading(false);
    }

    function FormInputs(header: string, submitText: string) {
        return (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAuth)} className="p-6 w-full mx-auto flex flex-col items-center gap-4 max-w-80">
                    <h1 className="text-2xl font-bold">{header}</h1>
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="you@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="w-full">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="••••••••" className="text-xl tracking-wide" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="m-auto mt-4 px-8" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {submitText}
                    </Button>
                </form>
            </Form>
        );
    }

    return (
        <Tabs defaultValue="signIn" className={className} onValueChange={(value) => setAction(value as AuthAction)}>
            <TabsList className="grid m-6 grid-cols-2">
                <TabsTrigger value="signIn" disabled={loading}>
                    Sign In
                </TabsTrigger>
                <TabsTrigger value="signUp" disabled={loading}>
                    Sign Up
                </TabsTrigger>
            </TabsList>
            <Separator />
            <TabsContent value="signIn" className="mt-0">
                {FormInputs("Welcome back!", "Sign In")}
            </TabsContent>
            <TabsContent value="signUp" className="mt-0">
                {FormInputs("Create a new account", "Sign Up")}
            </TabsContent>
        </Tabs>
    );
}
