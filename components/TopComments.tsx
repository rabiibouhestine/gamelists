import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getTopComments } from "@/lib/data/getTopComments";
import { Heart } from "lucide-react";
import Link from "next/link";

type TopCommentsProps = {
  list_id: number;
};

export default async function TopComments({ list_id }: TopCommentsProps) {
  const comments = await getTopComments(list_id);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <>
      <div className="flex justify-between items-center border-b py-2 mt-8 mb-4">
        <h2 className="text-3xl font-semibold">Top Comments</h2>
        <Link href={`/lists/${list_id}/comments`}>See More</Link>
      </div>
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <Avatar className="hover:cursor-pointer hover:ring-2 hover:ring-accent-foreground h-8 w-8">
                <AvatarImage
                  src={comment.profile_image}
                  className="object-cover"
                />
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
        ))}
      </div>
    </>
  );
}
