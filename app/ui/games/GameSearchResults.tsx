import { searchGames } from "@/app/lib/data";
import GameCover from "@/app/ui/GameCover";
import { GameCoverSkeleton } from "@/app/ui/GameCover";

import type { GameCoverType } from "@/app/lib/definitions";

export default async function GameSearchResults({
  searchParams,
}: {
  searchParams?: {
    genre?: string;
    search?: string;
    page?: string;
  };
}) {
  const search = searchParams?.search || "";
  const genre = searchParams?.genre || "";
  const currentPage = Number(searchParams?.page) || 1;

  const games = await searchGames(search, genre);

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

export function GameSearchResultsSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-2 mt-6">
      {Array.from({ length: 36 }).map((_, index) => (
        <GameCoverSkeleton key={index} />
      ))}
    </div>
  );
}
