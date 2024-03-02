import { Session } from "@supabase/supabase-js";
// import { SignOutButton } from "../components/SignOutButton";

export function TodosView({ session }: { session: Session }) {
    return <main>Hello {session.user.id}</main>;
}
