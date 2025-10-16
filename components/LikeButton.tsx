"use client";

import { LikeList } from "@/lib/actions/likeList";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function LikeButton({ list_id }: { list_id: number }) {
  return (
    <form action={LikeList}>
      <input
        type="number"
        name="list_id"
        defaultValue={list_id}
        className="hidden"
      />
      <Button type="submit" variant="outline">
        <Heart /> Like
      </Button>
    </form>
  );
}
