import GameCover from "@/components/GameCover";
import { fetchGameListGames, fetchGameListInfo } from "@/lib/data";
import { GameListGameType } from "@/lib/definitions";
import Pagination from "@/components/searchParamsInputs/Pagination";
import Image from "next/image";

export default async function Page(props: {
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
            <span className="font-bold">{gameList.creator_username}</span>
          </div>
          <span>{gameList.nb_likes} Likes</span>
          <span>{gameList.nb_comments} Comments</span>
        </div>
        <span>{gameList.total_games_count} Games</span>
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
