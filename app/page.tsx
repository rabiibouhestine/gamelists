import Link from "next/link";
import GameListCard from "@/components/page/GameListCard";
import TrendingGames from "@/components/page/TrendingGames";
import { TrendingGamesSkeleton } from "@/components/page/TrendingGames";
import { Suspense } from "react";
import { getRecentGameLists } from "@/lib/data";

export default async function Page() {
  const gameLists = await getRecentGameLists();

  return (
    <>
      <h1 className="text-6xl font-bold mt-20 mb-24">
        Track games you’ve played.
        <br />
        Save those you want to try.
        <br />
        Tell your friends what’s good.
      </h1>
      <div className="flex justify-between items-center border-b py-2">
        <h2 className="text-3xl font-semibold">Trending Games</h2>
        <Link href="/games">See More</Link>
      </div>
      <Suspense fallback={<TrendingGamesSkeleton />}>
        <TrendingGames />
      </Suspense>
      <div className="flex justify-between items-center border-b py-2 mt-20">
        <h2 className="text-3xl font-semibold">Recent Lists</h2>
        <Link href="/lists">See More</Link>
      </div>
      <div className="flex flex-col gap-6">
        {gameLists.map((list) => (
          <GameListCard key={list.list_id} gamelist={list} />
        ))}
      </div>
    </>
  );
}
