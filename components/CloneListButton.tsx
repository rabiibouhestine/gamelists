"use client";

import { useActionState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CloneList } from "@/lib/actions/cloneList";

type CloneButtonProps = {
  list_id: number;
  user_id: string;
};

export default function CloneListButton({
  list_id,
  user_id,
}: CloneButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, pending] = useActionState(CloneList, null);

  return (
    <form action={formAction}>
      <input
        type="number"
        name="list_id"
        defaultValue={list_id}
        className="hidden"
      />
      <input
        type="text"
        name="user_id"
        defaultValue={user_id}
        className="hidden"
      />
      <Button type="submit" variant="outline" disabled={pending}>
        <Copy /> Clone List
      </Button>
    </form>
  );
}
