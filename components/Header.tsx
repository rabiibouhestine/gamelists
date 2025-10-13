import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import sql from "@/lib/db";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  let username = "";
  if (data.user) {
    const results = await sql<{ username: string }[]>`
    SELECT username
    FROM users
    WHERE id = ${data.user.id}
    `;
    username = results[0].username;
  }

  return (
    <header className="flex justify-between max-w-5xl mx-auto p-6">
      <Link href="/">GameLists</Link>
      <nav className="flex items-center gap-3">
        <Link href="/games">Games</Link>
        <Link href="/lists">Lists</Link>
        {data.user ? (
          <>
            <Link href={`/users/${username}`}>Profile</Link>
            <form>
              <Button asChild variant={"outline"}>
                <button formAction={signout}>Signout</button>
              </Button>
            </form>
          </>
        ) : (
          <>
            <Button asChild variant={"outline"}>
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </>
        )}
      </nav>
    </header>
  );
}
