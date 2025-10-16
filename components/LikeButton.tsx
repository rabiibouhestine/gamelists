"use client";

import { LikeList } from "@/lib/actions/likeList";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useActionState, useState } from "react";

type LikeButtonProps = {
  list_id: number;
  is_liked: boolean;
};

export default function LikeButton({ list_id, is_liked }: LikeButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, pending] = useActionState(LikeList, null);
  const [isLiked, setIsLiked] = useState(is_liked);

  return (
    <form action={formAction}>
      <input
        type="number"
        name="list_id"
        defaultValue={list_id}
        className="hidden"
      />
      <Button
        type="submit"
        disabled={pending}
        variant="outline"
        className={isLiked ? "text-pink-300 hover:text-pink-300" : ""}
        onClick={() => {
          setIsLiked(!isLiked);
        }}
      >
        <Heart fill={isLiked ? "currentColor" : ""} />{" "}
        {isLiked ? "Liked" : "Like"}
      </Button>
    </form>
  );
}
