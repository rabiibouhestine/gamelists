"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useActionState } from "react";

const initialState = {
  validationErrors: {
    errors: [],
    properties: {
      user_id: {},
      confirmation: {
        errors: [],
      },
    },
  },
};

type DeleteAccountButtonProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  action: any;
  user_id: string;
};

export default function DeleteAccountButton({
  action,
  user_id,
}: DeleteAccountButtonProps) {
  const [confirmationText, setConfirmationText] = useState("");
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Trash /> Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action will permanently delete your account.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="flex flex-col gap-6">
          <div>
            <input className="hidden" name="user_id" defaultValue={user_id} />
            <Label
              className="mb-2 flex flex-col items-start gap-2"
              htmlFor="confirmation"
            >
              {`Confirm by typing 'delete account' below`}
              <span aria-live="polite" className="text-destructive">
                {state?.validationErrors?.properties?.confirmation?.errors}
              </span>
            </Label>
            <Input
              type="text"
              name="confirmation"
              value={confirmationText}
              onChange={(e) => {
                setConfirmationText(e.target.value);
              }}
            />
          </div>
          <div className="flex items-center justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive" disabled={pending}>
              <Trash /> Delete Account
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
