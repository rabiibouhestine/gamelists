import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";
import type { CommentType } from "@/lib/definitions";

type CommentCardProps = {
  comment: CommentType;
};

export default function CommentCard({ comment }: CommentCardProps) {
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div key={comment.id} className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <Avatar className="hover:cursor-pointer hover:ring-2 hover:ring-accent-foreground h-8 w-8">
          <AvatarImage src={comment.profile_image} className="object-cover" />
          <AvatarFallback>
            {comment.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col text-sm">
          <span className="flex items-center gap-1">
            {comment.username}
            <Heart size={14} />
            {comment.nb_likes}
          </span>
          <span className="text-muted-foreground">
            last updated on {formatDate(comment.updated_at)}
          </span>
        </div>
      </div>
      <p>{comment.content}</p>
    </div>
  );
}
