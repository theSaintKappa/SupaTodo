import { useSession } from "@/components/SessionProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import supabase from "@/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftCircle, Loader2, UserRound, BadgeHelp } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

export function ProfilePage() {
    const { profile, session } = useSession();
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string>(profile?.avatar_url ?? "");

    const navigate = useNavigate();

    const FormSchema = z.object({
        userName: z.string().min(3, { message: "Username must be at least 3 characters." }).max(16, { message: "Username must be at most 16 characters." }),
        avatarUrl: z.union([z.string().url({ message: "Please enter a valid URL." }), z.literal("")]),
        syncWithProvider: z.boolean().default(false).optional(),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { userName: profile?.user_name ?? "", avatarUrl: profile?.avatar_url ?? "", syncWithProvider: profile?.sync_with_provider ?? false },
    });

    async function handleSubmit({ userName, avatarUrl, syncWithProvider }: z.infer<typeof FormSchema>) {
        if (!profile) return;

        setLoading(true);
        const { error } = await supabase
            .from("profiles")
            .update({ user_name: userName, avatar_url: avatarUrl === "" ? null : avatarUrl, has_finished_signup: true, sync_with_provider: syncWithProvider })
            .eq("id", profile.id);

        error ? toast.error("An error occurred while updating your profile.") : toast.success("Profile updated successfully.");

        setLoading(false);
        navigate("/");
    }

    useEffect(() => {
        if (!profile) return;
        form.setValue("userName", profile.user_name ?? "");
        form.setValue("avatarUrl", profile.avatar_url ?? "");
        form.setValue("syncWithProvider", profile.sync_with_provider ?? false);
        setAvatarUrl(profile.avatar_url ?? "");
    }, [profile, form]);

    if (!session?.user) return null;

    const hasOAuthMetadata = () => session.user.identities?.some((identity) => identity.provider !== "email") ?? false;

    return (
        <main className="w-full flex justify-center items-center p-4">
            <Card className="w-full max-w-2xl animate-fly-in">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-bold">Edit your profile 👤</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="px-4 py-10">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 w-full max-w-md mx-auto">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>User name</FormLabel>
                                        <FormControl>
                                            <Input placeholder={profile?.user_name ?? undefined} onInput={() => form.setValue("syncWithProvider", false)} disabled={form.getValues("syncWithProvider")} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="avatarUrl"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>
                                            Avatar url <span className="opacity-50 text-xs">(optional)</span>
                                        </FormLabel>
                                        <FormControl>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="https://avatars.githubusercontent.com/u/124599"
                                                    className="tracking-tight"
                                                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => {
                                                        setAvatarUrl(e.target.value);
                                                        form.setValue("syncWithProvider", false);
                                                    }}
                                                    disabled={form.getValues("syncWithProvider")}
                                                    {...field}
                                                />
                                                <Avatar>
                                                    <AvatarImage src={avatarUrl ?? undefined} />
                                                    <AvatarFallback>
                                                        <UserRound />
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="syncWithProvider"
                                render={({ field }) => (
                                    <div className="flex items-center">
                                        <FormItem className="flex gap-2 space-y-0">
                                            <FormControl>
                                                <Checkbox className="rounded-[6px]" checked={field.value} onCheckedChange={field.onChange} disabled={!hasOAuthMetadata()} />
                                            </FormControl>
                                            <FormLabel className="leading-4">Sync profile with provider</FormLabel>
                                        </FormItem>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <BadgeHelp className="w-min-4 h-4" />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>{hasOAuthMetadata() ? "Synchronize the user name and avatar with the provider you used to log in." : "This feature is only available when you sign up through an OAuth provider."}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                )}
                            />
                            <div className="mt-10 flex gap-8 items-center justify-center">
                                <Button variant="outline" asChild>
                                    <Link to="/" className="flex items-center">
                                        <ArrowLeftCircle className="mr-2 h-4 min-w-4" />
                                        Go back
                                    </Link>
                                </Button>
                                <Button type="submit" className="px-10" disabled={loading}>
                                    {loading && <Loader2 className="mr-2 h-4 min-w-4 animate-spin" />}
                                    Submit
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}
