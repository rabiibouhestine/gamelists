import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/lib/actions/signout";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, Settings, User } from "lucide-react";

export default async function Header() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  let username = "";
  let profile_image = "";
  if (data.user) {
    const { data: profile } = await supabase
      .from("users")
      .select("username, profile_image")
      .eq("id", data.user.id)
      .single();
    username = profile?.username;
    profile_image = profile?.profile_image;
  }

  return (
    <header className="flex justify-between max-w-5xl mx-auto p-6">
      <Link href="/">GameLists</Link>
      <nav className="flex items-center gap-3">
        <Link href="/games">Games</Link>
        <Link href="/lists">Lists</Link>
        {data.user ? (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Avatar className="hover:cursor-pointer hover:ring-2 hover:ring-accent-foreground">
                <AvatarImage src={profile_image} />
                <AvatarFallback>
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={`/users/${username}`}>
                    <div className="flex items-center justify-between w-full">
                      <DropdownMenuShortcut>
                        <User />
                      </DropdownMenuShortcut>
                      <span>Profile</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/users/${username}/settings`}>
                    <div className="flex items-center justify-between w-full">
                      <DropdownMenuShortcut>
                        <Settings />
                      </DropdownMenuShortcut>
                      <span>Settings</span>
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
                    <DropdownMenuShortcut>
                      <LogOut />
                    </DropdownMenuShortcut>
                    <span>Sign out</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Link href="/signup">Signup</Link>
            <Link href="/login">Login</Link>
          </>
        )}
      </nav>
    </header>
  );
}
