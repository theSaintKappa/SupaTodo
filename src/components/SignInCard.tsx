import { EmailAuthDialog } from "@/components/EmailAuthDialog";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import supabase from "@/supabase";
import { Github, Loader2, Twitter } from "lucide-react";
import { useState } from "react";

type Provider = "Github" | "Google" | "Twitter";

const providers: { name: Provider; icon: JSX.Element }[] = [
    {
        name: "Github",
        icon: <Github className="h-6 min-w-6" />,
    },
    {
        name: "Google",
        icon: (
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 min-w-6">
                <path
                    d="M23 12.769C23 19.3304 18.6316 24 12.1803 24C5.99508 24 1 18.8621 1 12.5C1 6.1379 5.99508 1 12.1803 1C14.8096 1 17.0745 1.86599 18.9063 3.33257C19.3454 3.68414 19.3476 4.33571 18.9476 4.73125L17.3388 6.3223C16.9487 6.70809 16.3245 6.69881 15.879 6.37868C11.7874 3.43897 5.25123 6.42588 5.25123 12.5C5.25123 16.5111 8.36639 19.7617 12.1803 19.7617C15.7539 19.7617 17.5239 17.6345 18.211 15.9241C18.4396 15.3552 17.9747 14.8046 17.3615 14.8046H13.1803C12.628 14.8046 12.1803 14.3569 12.1803 13.8046V11.8492C12.1803 11.2969 12.628 10.8492 13.1803 10.8492H21.9849C22.4703 10.8492 22.8931 11.197 22.9444 11.6797C22.9794 12.0085 23 12.3603 23 12.769Z"
                    stroke="white"
                    strokeWidth="2"
                />
            </svg>
        ),
    },
    {
        name: "Twitter",
        icon: <Twitter className="h-6 min-w-6" />,
    },
];

export function SignInCard() {
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState<Provider>();

    async function signInWithProvider(provider: Provider) {
        setLoading(true);
        setProvider(provider);
        await supabase.auth.signInWithOAuth({ provider: provider.toLowerCase() as Lowercase<Provider>, options: { redirectTo: window.location.origin } });
    }

    return (
        <>
            <div className="absolute right-0 m-2">
                <ThemeToggle />
            </div>
            <main className="w-full flex justify-center items-center p-4">
                <Card className="w-full max-w-xl py-8 flex flex-col items-center gap-4 animate-fly-in">
                    <CardHeader className="flex flex-col items-center">
                        <CardTitle className="text-3xl text-center font-extrabold">Log in to continue</CardTitle>
                        <CardDescription className="text-sm text-center font-light">Your todos will be synced to your account</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-8 px-0">
                        <div className="flex flex-col gap-3">
                            {providers.map(({ name, icon }) => (
                                <Button key={name} className="gap-2" onClick={() => signInWithProvider(name)} disabled={loading}>
                                    {provider === name ? <Loader2 className="mr-2 h-4 min-w-4 animate-spin" /> : icon}
                                    Continue with {name}
                                </Button>
                            ))}
                        </div>
                        <Separator className="relative flex justify-center items-center before:absolute before:content-['or'] before:font-medium text-xs before:bg-card before:px-1 before:leading-3 before:text-slate-400" />
                        <EmailAuthDialog />
                    </CardContent>
                </Card>
            </main>
        </>
    );
}
