import GameCover from "@/components/GameCover";
import { fetchGameListGames, fetchGameListInfo } from "@/lib/data";
import { GameListGameType } from "@/lib/definitions";
import Pagination from "@/components/searchParamsInputs/Pagination";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Pen, Trash } from "lucide-react";

export default async function ListPage(props: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ page?: string }>;
}) {
  const limit = 36;

  const searchParams = await props.searchParams;
  const page = searchParams?.page;

  const params = await props.params;
  const list_id = params.id;

  const gameList = await fetchGameListInfo(Number(list_id));
  const gameListGames = await fetchGameListGames(
    Number(list_id),
    Number(page),
    limit
  );

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <h1 className="text-3xl font-bold ">{gameList.title}</h1>
      <p>{gameList.description}</p>
      <div className="flex gap-2 justify-between items-center border-b py-3 mt-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Image
              src={gameList.creator_profile_img}
              alt={gameList.creator_username}
              width={20}
              height={20}
              className="rounded-full w-4 h-4"
            />
            <Link
              href={`/users/${gameList.creator_username}`}
              className="font-bold"
            >
              {gameList.creator_username}
            </Link>
          </div>
          <span>{gameList.total_games_count} Games</span>
          <span>{gameList.nb_likes} Likes</span>
          <span>{gameList.nb_comments} Comments</span>
        </div>
        {data.user?.id === gameList.creator_id && (
          <div className="flex items-center gap-2">
            <Button asChild variant={"outline"}>
              <Link href="/lists/create">
                <Trash /> Delete List
              </Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href={`/lists/${list_id}/edit`}>
                <Pen /> Edit List
              </Link>
            </Button>
          </div>
        )}
      </div>
      <div className="grid grid-cols-6 gap-2 mt-6">
        {gameListGames.games.map((game: GameListGameType) => (
          <GameCover
            key={game.game_id}
            cover_id={game.image_id}
            alt={game.name}
            slug={game.slug}
          />
        ))}
      </div>
      <Pagination
        limit={limit}
        total={gameListGames.total}
        resultsCount={gameListGames.games.length}
      />
    </>
  );
}
