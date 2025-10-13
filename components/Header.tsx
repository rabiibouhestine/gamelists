import Link from "next/link";
import sql from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User } from "lucide-react";

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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Account</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/users/${username}`}>
                    <div className="flex items-center justify-between w-full">
                      <span>Profile</span>
                      <DropdownMenuShortcut>
                        <User />
                      </DropdownMenuShortcut>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/users/${username}/settings`}>
                    <div className="flex items-center justify-between w-full">
                      <span>Settings</span>
                      <DropdownMenuShortcut>
                        <Settings />
                      </DropdownMenuShortcut>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form>
                  <button
                    formAction={signout}
                    className="flex items-center justify-between w-full"
                  >
                    <span>Sign out</span>
                    <DropdownMenuShortcut>
                      <LogOut />
                    </DropdownMenuShortcut>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
