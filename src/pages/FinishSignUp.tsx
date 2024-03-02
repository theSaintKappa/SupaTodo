import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import supabase from "@/supabase";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@supabase/supabase-js";
import { Loader2, UserRound } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const FormSchema = z.object({
    userName: z.string().min(3, { message: "Username must be at least 3 characters." }).max(16, { message: "Username must be at most 16 characters." }),
    avatarUrl: z.union([z.string().url({ message: "Please enter a valid URL." }), z.literal("")]),
});

export function FinishSignUp({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: { userName: "", avatarUrl: "" },
    });

    async function handleSubmit({ userName, avatarUrl }: z.infer<typeof FormSchema>) {
        setLoading(true);
        await supabase.from("email_profiles").insert({ id: user.id, user_name: userName, avatar_url: avatarUrl === "" ? null : avatarUrl });
        setLoading(false);
        navigate("/");
    }

    return (
        <main className="w-full flex justify-center items-center p-4">
            <Card className="animate-fly-in">
                <CardHeader>
                    <CardTitle className="text-2xl text-center font-extrabold px-4 py-2">Finish creating your account to continue</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="px-6 py-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-6 w-full max-w-sm mx-auto">
                            <FormField
                                control={form.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>User name</FormLabel>
                                        <FormControl>
                                            <Input placeholder={user.email?.split("@")[0]} className="tracking-tight" {...field} />
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
                                                <Input placeholder="https://avatars.githubusercontent.com/u/124599" className="tracking-tight" onInput={(e: React.ChangeEvent<HTMLInputElement>) => setAvatarUrl(e.target.value)} {...field} />
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
                            <Button type="submit" className="m-auto mt-4 px-8" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Submit
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </main>
    );
}
