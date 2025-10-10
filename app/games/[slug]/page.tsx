import GameListCard from "@/components/GameListCard";
import GameInfoCard from "@/components/GameInfoCard";
import { GameInfoCardSkeleton } from "@/components/GameInfoCard";
import { Suspense } from "react";
import SearchInput from "@/components/searchParamsInputs/SearchInput";
import SelectPlatformInput from "@/components/searchParamsInputs/SelectPlatformInput";
import { getRecentGameLists } from "@/lib/data";

export default async function Page(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const slug = params.slug;

  const gameLists = await getRecentGameLists();

  return (
    <>
      <Suspense fallback={<GameInfoCardSkeleton />}>
        <GameInfoCard slug={slug} />
      </Suspense>
      <div className="flex gap-2 justify-between items-center border-b py-3 mt-6">
        <h2 className="text-3xl font-semibold">Related Lists</h2>
        <div className="flex gap-2">
          <SearchInput placeholder="Search List" />
          <SelectPlatformInput />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {gameLists.map((list) => (
          <GameListCard key={list.list_id} gamelist={list} />
        ))}
      </div>
    </>
  );
}
