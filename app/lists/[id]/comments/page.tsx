import Link from "next/link";
import { getGameListInfo } from "@/lib/data/getGameListInfo";
import { CommentType } from "@/lib/definitions";
import { createClient } from "@/utils/supabase/server";
import { ChevronLeft } from "lucide-react";
import Pagination from "@/components/searchParamsInputs/Pagination";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { getGameListComments } from "@/lib/data/getGameListComments";
import CommentCard from "@/components/CommentCard";

export default async function CommentsPage(props: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await props.params;
  const list_id = params.id;

  const searchParams = await props.searchParams;
  const page = searchParams?.page;
  const limit = 24;

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  const gameList = await getGameListInfo(Number(list_id));

  if (
    !gameList.is_public &&
    (!data.user || data.user.id !== gameList.creator_id)
  ) {
    redirect("/lists");
  }

  const gameListComments = await getGameListComments(
    Number(list_id),
    Number(page),
    limit
  );

  return (
    <>
      <h1 className="text-3xl font-bold">{gameList.title}</h1>
      <p>{gameList.description}</p>
      <div className="flex flex-wrap gap-2 justify-between items-center border-b py-3 mt-3">
        <h2 className="text-2xl font-bold">Comments</h2>
        <Button asChild variant={"outline"}>
          <Link href={`/lists/${gameList.list_id}`}>
            <ChevronLeft size={14} />
            Back to games
          </Link>
        </Button>
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {gameListComments.comments.map((comment: CommentType) => (
          <CommentCard key={comment.id} comment={comment} />
        ))}
      </div>
      <Pagination
        limit={limit}
        total={gameListComments.total}
        resultsCount={gameListComments.comments.length}
      />
    </>
  );
}
