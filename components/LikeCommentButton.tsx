"use client";

import { useActionState, useState } from "react";
import { LikeComment } from "@/lib/actions/likeComment";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

import { CommentType } from "@/lib/definitions";

type LikeCommentButtonprops = {
  comment: CommentType;
};

export default function LikeCommentButton({ comment }: LikeCommentButtonprops) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, pending] = useActionState(LikeComment, null);
  const [isLiked, setIsLiked] = useState(comment.is_liked);
  const [nbLikes, setNbLikes] = useState(+comment.nb_likes);

  function HandleClick() {
    setIsLiked(!isLiked);
    setNbLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  }

  return (
    <form action={formAction}>
      <input
        type="number"
        name="comment_id"
        defaultValue={comment.id}
        className="hidden"
      />
      <Button
        type="submit"
        disabled={pending}
        variant={"outline"}
        className={isLiked ? "text-pink-300 hover:text-pink-300" : ""}
        onClick={HandleClick}
      >
        {nbLikes}
        <Heart fill={isLiked ? "currentColor" : ""} />{" "}
        {isLiked ? "Liked" : "Like"}
      </Button>
    </form>
  );
}
