import GameCover from "@/app/ui/GameCover";
import { fetchTrendingGames } from "@/app/lib/data";
import { GameCoverSkeleton } from "@/app/ui/GameCover";

import type { GameCoverType } from "@/app/lib/definitions";

export default async function TrendingGames() {
  const trendingGames = await fetchTrendingGames();

  return (
    <div className="grid grid-cols-6 gap-2 mt-6">
      {trendingGames.map((game: GameCoverType) => (
        <GameCover
          key={game.id}
          cover_id={game.cover?.image_id}
          alt={game.name}
        />
      ))}
    </div>
  );
}

export function TrendingGamesSkeleton() {
  return (
    <div className="grid grid-cols-6 gap-2 mt-6">
      <GameCoverSkeleton />
      <GameCoverSkeleton />
      <GameCoverSkeleton />
      <GameCoverSkeleton />
      <GameCoverSkeleton />
      <GameCoverSkeleton />
    </div>
  );
}
