import GameListCard from "@/app/ui/GameListCard";
import GameInfoCard from "@/app/ui/games/GameInfoCard";
import { GameInfoCardSkeleton } from "@/app/ui/games/GameInfoCard";
import { gameLists } from "@/app/lib/placeholder-data";
import { Suspense } from "react";
import SearchInput from "@/app/ui/SearchInput";
import SelectGenreInput from "@/app/ui/games/SelectGenreInput";
import SelectPlatformInput from "@/app/ui/games/SelectPlatformInput";

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
