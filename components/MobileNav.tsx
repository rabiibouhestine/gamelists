"use client";

import Link from "next/link";
import { signout } from "@/lib/actions/signout";
import { Button } from "@/components/ui/button";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";
import { User } from "@supabase/supabase-js";

type MobileNavProps = {
  user: User | null;
  username: string;
};

export default function MobileNav({ user, username }: MobileNavProps) {
  return (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Menu className="hover:cursor-pointer" />
      </DrawerTrigger>
      <DrawerContent className="flex flex-col items-center gap-3 text-xl py-8 z-999">
        <DrawerHeader>
          <VisuallyHidden.Root>
            <DrawerTitle>Navigation Menu</DrawerTitle>
          </VisuallyHidden.Root>
        </DrawerHeader>
        <DrawerClose asChild>
          <Link href={"/games"}>Games</Link>
        </DrawerClose>
        <DrawerClose asChild>
          <Link href={"/lists"}>Lists</Link>
        </DrawerClose>
        {user ? (
          <>
            <DrawerClose asChild>
              <Link href={`/users/${username}`}>Profile</Link>
            </DrawerClose>
            <DrawerClose asChild>
              <form action={signout}>
                <Button type="submit" variant={"outline"}>
                  Sign out
                </Button>
              </form>
            </DrawerClose>
          </>
        ) : (
          <>
            <DrawerClose asChild>
              <Link href={"/login"}>Login</Link>
            </DrawerClose>
            <DrawerClose asChild>
              <Link href={"/signup"}>Signup</Link>
            </DrawerClose>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}
