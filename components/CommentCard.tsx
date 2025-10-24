import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import LikeCommentButton from "@/components/LikeCommentButton";
import type { CommentType } from "@/lib/definitions";

type CommentCardProps = {
  comment: CommentType;
  showCommentLikeButton: boolean;
};

export default function CommentCard({
  comment,
  showCommentLikeButton,
}: CommentCardProps) {
  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="bg-card border rounded-md p-4 flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Avatar className="hover:cursor-pointer hover:ring-2 hover:ring-accent-foreground h-8 w-8">
            <AvatarImage src={comment.profile_image} className="object-cover" />
            <AvatarFallback>
              {comment.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span>{comment.username}</span>
            <span className="text-muted-foreground">
              last updated on {formatDate(comment.updated_at)}
            </span>
          </div>
        </div>
        <p>{comment.content}</p>
      </div>
      {showCommentLikeButton && <LikeCommentButton comment={comment} />}
    </div>
  );
}
