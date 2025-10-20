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
import { Pen } from "lucide-react";
import { EditUsername } from "@/lib/actions/editUsername";
import { useActionState, useState } from "react";

const initialState = {
  validationErrors: {
    errors: [],
  },
};

type UsernameFormProps = {
  username: string;
};

export default function UsernameForm({ username }: UsernameFormProps) {
  const [usernameInput, setUsernameInput] = useState<string>(username);
  const [state, formAction, pending] = useActionState(
    EditUsername,
    initialState
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Pen />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={formAction}>
          <DialogHeader>
            <DialogTitle>Edit Username</DialogTitle>
            <DialogDescription>
              Make changes to your username here.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 my-6">
            <div className="grid gap-3">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={usernameInput}
                onChange={(e) => {
                  setUsernameInput(e.target.value);
                }}
              />
            </div>
            <p className="text-sm text-destructive">
              {state?.validationErrors?.properties?.username?.errors}
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
