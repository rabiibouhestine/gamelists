import { searchGames } from "@/lib/igdb";
import GameCover from "@/components/GameCover";
import { GameCoverSkeleton } from "@/components/GameCover";
import Pagination from "@/components/searchParamsInputs/Pagination";

import type { GameCoverType } from "@/lib/definitions";

export default async function GameSearchResults({
  searchParams,
}: {
  searchParams?: {
    genre?: string;
    platform?: string;
    search?: string;
    page?: string;
  };
}) {
  const search = searchParams?.search || "";
  const genre = Number(searchParams?.genre) || 0;
  const platform = Number(searchParams?.platform) || 0;
  const currentPage = Number(searchParams?.page) || 1;

  const games = await searchGames(search, genre, platform, currentPage);

  return (
    <>
      <div className="grid grid-cols-6 gap-2 mt-6">
        {games.map((game: GameCoverType) => (
          <GameCover
            key={game.id}
            cover_id={game.cover?.image_id}
            alt={game.name}
            slug={game.slug}
          />
        ))}
      </div>
      <Pagination limit={36} resultsCount={games.length} />
    </>
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
