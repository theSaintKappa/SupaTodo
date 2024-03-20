import { Button } from "@/components/ui/button";
import { Dialog as UiDialog, DialogContent as UiDialogContent, DialogTrigger as UiDialogTrigger } from "@/components/ui/dialog";
import { Drawer as UiDrawer, DrawerContent as UiDrawerContent, DrawerTrigger as UiDrawerTrigger } from "@/components/ui/drawer";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useMediaQuery from "@/hooks/use-media-query";
import supabase from "@/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AuthError, AuthResponse, User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function EmailAuthDialog() {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const DialogType = useMemo(() => (isDesktop ? UiDialog : UiDrawer), [isDesktop]);
    const DialogTrigger = useMemo(() => (isDesktop ? UiDialogTrigger : UiDrawerTrigger), [isDesktop]);
    const DialogContent = useMemo(() => (isDesktop ? UiDialogContent : UiDrawerContent), [isDesktop]);
    const dialogProps = useMemo(() => isDesktop && { hideXIcon: true }, [isDesktop]);

    return (
        <DialogType open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="link" className="p-0 h-fit">
                    Continue with Email →
                </Button>
            </DialogTrigger>
            <DialogContent {...dialogProps} className="p-0">
                <EmailAuthForm />
            </DialogContent>
        </DialogType>
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
    const [authResponse, setAuthResponse] = useState<AuthResponse | null>(null);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { email: "", password: "" },
    });

    async function handleAuth({ email, password }: z.infer<typeof FormSchema>) {
        setLoading(true);
        setAuthResponse(null);
        if (action === "signIn") await supabase.auth.signInWithPassword({ email, password }).then((res) => setAuthResponse(res));
        else if (action === "signUp") await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/todos` } }).then((res) => setAuthResponse(res));
        setLoading(false);
    }

    function AuthMessage({ user, error }: { user: User | null; error: AuthError | null }) {
        console.log(authResponse);

        if (error) return <p className="text-destructive text-sm font-bold text-center">{error.message}</p>;
        if (!user) return null;
        if (user.identities && user.identities.length === 0)
            return (
                <p className="text-destructive text-sm font-bold text-center">
                    A user with this email already exists. <span className="text-xs font-normal">Maybe you used an OAuth provider to sign up?</span>
                </p>
            );
        if (!user.email_confirmed_at || user.role === "authenticated") return <p className="text-primary text-sm font-bold text-center">We've sent a verification email to {user?.email}</p>;
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

                    {authResponse && <AuthMessage user={authResponse.data.user} error={authResponse.error} />}

                    <Button type="submit" className="m-auto mt-4 px-8" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 min-w-4 animate-spin" />}
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
