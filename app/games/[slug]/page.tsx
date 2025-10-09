import GameListCard from "@/components/page/GameListCard";
import GameInfoCard from "@/components/games/GameInfoCard";
import { GameInfoCardSkeleton } from "@/components/games/GameInfoCard";
import { gameLists } from "@/lib/placeholder-data";
import { Suspense } from "react";
import SearchInput from "@/components/page/SearchInput";
import SelectPlatformInput from "@/components/games/SelectPlatformInput";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const slug = params.slug;

  return (
    <>
      <Suspense fallback={<GameInfoCardSkeleton />}>
        <GameInfoCard slug={slug} />
      </Suspense>
      <div className="flex gap-2 justify-between items-center border-b py-3 mt-6">
        <h2 className="text-3xl font-semibold">Lists containing this game</h2>
        <div className="flex gap-2">
          <SearchInput placeholder="Search List" />
          <SelectPlatformInput />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {gameLists.map((list) => (
          <GameListCard key={list.id} gamelist={list} />
        ))}
      </div>
    </>
  );
}
