import GameCover from "@/components/GameCover";
import { fetchTrendingGames } from "@/lib/igdb/fetchTrendingGames";
import { GameCoverSkeleton } from "@/components/GameCover";

import type { GameIGDBType } from "@/lib/definitions";

export default async function TrendingGames() {
  const trendingGames = await fetchTrendingGames();

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 mt-6">
      {trendingGames.map((game: GameIGDBType) => (
        <GameCover
          key={game.id}
          cover_id={game.cover?.image_id}
          alt={game.name}
          slug={game.slug}
        />
      ))}
    </div>
  );
}

export function TrendingGamesSkeleton() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2 mt-6">
      <GameCoverSkeleton />
      <GameCoverSkeleton />
      <GameCoverSkeleton />
      <GameCoverSkeleton />
      <GameCoverSkeleton />
      <GameCoverSkeleton />
    </div>
  );
}
