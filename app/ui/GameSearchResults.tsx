import { searchGames } from "@/app/lib/data";
import GameCover from "@/app/ui/GameCover";

import type { GameCoverType } from "@/app/lib/definitions";

export default async function GameSearchResults({
  searchParams,
}: {
  searchParams?: {
    search?: string;
    page?: string;
  };
}) {
  const search = searchParams?.search || "";
  const currentPage = Number(searchParams?.page) || 1;

  const games = await searchGames(search);

  return (
    <div className="grid grid-cols-6 gap-2 mt-6">
      {games.map((game: GameCoverType) => (
        <GameCover
          key={game.id}
          cover_id={game.cover?.image_id}
          alt={game.name}
        />
      ))}
    </div>
  );
}
