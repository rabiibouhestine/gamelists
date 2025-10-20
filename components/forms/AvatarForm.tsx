"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useActionState } from "react";
import { EditAvatar } from "@/lib/actions/editAvatar";

const initialState = {
  validationErrors: {
    errors: [],
  },
};

type AvatarFormProps = {
  profile_image: string;
  username: string;
};

export default function AvatarForm({
  profile_image,
  username,
}: AvatarFormProps) {
  const [state, formAction, pending] = useActionState(EditAvatar, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Avatar className="hover:cursor-pointer hover:ring-2 hover:ring-accent-foreground h-20 w-20">
          <AvatarImage src={profile_image} className="object-cover" />
          <AvatarFallback>{username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Edit Avatar</DialogTitle>
            <DialogDescription>
              Make changes to your avatar here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 my-6">
            <div className="grid gap-3">
              <Label htmlFor="avatar">Image</Label>
              <Input id="avatar" name="avatar" type="file" />
              <input
                id="username"
                name="username"
                type="text"
                defaultValue={username}
                className="hidden"
              />
            </div>
            <p className="text-sm text-destructive">
              {state?.validationErrors?.errors}
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={pending}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
