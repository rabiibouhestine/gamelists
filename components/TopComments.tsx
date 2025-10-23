import { getTopComments } from "@/lib/data/getTopComments";
import Link from "next/link";
import CommentCard from "@/components/CommentCard";

type TopCommentsProps = {
  list_id: number;
};

export default async function TopComments({ list_id }: TopCommentsProps) {
  const comments = await getTopComments(list_id);

  return (
    <>
      <div className="flex justify-between items-center border-b py-2 mt-8 mb-4">
        <h2 className="text-3xl font-semibold">Top Comments</h2>
        <Link href={`/lists/${list_id}/comments`}>See More</Link>
      </div>
      <div className="flex flex-col gap-4">
        {comments.map((comment) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
    </>
  );
}
