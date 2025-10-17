"use client";

import { FollowUser } from "@/lib/actions/followUser";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useActionState, useState } from "react";

type FollowButtonProps = {
  user_id: string;
  is_following: boolean;
};

export default function FollowButton({
  user_id,
  is_following,
}: FollowButtonProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, formAction, pending] = useActionState(FollowUser, null);
  const [isFollowed, setIsFollowed] = useState(is_following);

  return (
    <form action={formAction}>
      <input
        type="text"
        name="user_id"
        defaultValue={user_id}
        className="hidden"
      />
      <Button
        type="submit"
        disabled={pending}
        variant="outline"
        className={isFollowed ? "text-pink-300 hover:text-pink-300" : ""}
        onClick={() => {
          setIsFollowed(!isFollowed);
        }}
      >
        <Heart fill={isFollowed ? "currentColor" : ""} />{" "}
        {isFollowed ? "Following" : "Follow"}
      </Button>
    </form>
  );
}
