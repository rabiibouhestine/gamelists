import GameCover from "@/app/ui/GameCover";
import { fetchTrendingGames } from "@/app/lib/data";
import { GameCoverSkeleton } from "@/app/ui/GameCover";

import type { TrendingGame } from "@/app/lib/definitions";

export default async function TrendingGames() {
  const trendingGames = await fetchTrendingGames();

  return (
    <div className="grid grid-cols-6 gap-2 mt-6">
      {trendingGames.map((game: TrendingGame) => (
        <GameCover key={game.id} src={game.cover} alt={game.name} />
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
