import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { signout } from "@/lib/actions/signout";
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
import {
  Folders,
  Gamepad,
  LogIn,
  LogOut,
  Menu,
  User,
  UserPlus,
} from "lucide-react";

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
    <header className="fixed top-0 w-full bg-card border-b z-99">
      <div className="flex justify-between max-w-5xl mx-auto px-6 py-4">
        <Link href="/">GameLists</Link>
        <nav className="hidden sm:flex items-center gap-3">
          <Link href="/games">Games</Link>
          <Link href="/lists">Lists</Link>
          {data.user ? (
            <DropdownMenu dir="rtl">
              <DropdownMenuTrigger asChild>
                <Avatar className="hover:cursor-pointer hover:ring-2 hover:ring-accent-foreground">
                  <AvatarImage src={profile_image} className="object-cover" />
                  <AvatarFallback>
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40 z-999" align="start">
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
        <nav className="block sm:hidden">
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Menu className="hover:cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="z-999" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href={"/games"}>
                    <div className="flex items-center justify-between w-full">
                      <DropdownMenuShortcut>
                        <Gamepad />
                      </DropdownMenuShortcut>
                      <span>Games</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={"/lists"}>
                    <div className="flex items-center justify-between w-full">
                      <DropdownMenuShortcut>
                        <Folders />
                      </DropdownMenuShortcut>
                      <span>Lists</span>
                    </div>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              {data.user ? (
                <>
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
                </>
              ) : (
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href={"/login"}>
                      <div className="flex items-center justify-between w-full">
                        <DropdownMenuShortcut>
                          <LogIn />
                        </DropdownMenuShortcut>
                        <span>Login</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={"/signup"}>
                      <div className="flex items-center justify-between w-full">
                        <DropdownMenuShortcut>
                          <UserPlus />
                        </DropdownMenuShortcut>
                        <span>Signup</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
