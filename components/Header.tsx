import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/lib/actions";

export default async function Header() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  return (
    <header className="flex justify-between max-w-5xl mx-auto p-6">
      <Link href="/">GameLists</Link>
      <nav className="flex items-center gap-3">
        <Link href="/games">Games</Link>
        <Link href="/lists">Lists</Link>
        {data.user ? (
          <>
            <Link href="/profile">Profile</Link>
            <form>
              <button formAction={signout}>Signout</button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/signup">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
