import GameListCard from "@/components/GameListCard";
import GameInfoCard from "@/components/GameInfoCard";
import { GameInfoCardSkeleton } from "@/components/GameInfoCard";
import { Suspense } from "react";
import { getRecentGameLists } from "@/lib/data";
import SelectInput from "@/components/searchParamsInputs/SelectInput";
import { sortOptions, orderOptions } from "@/lib/data";

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
          <SelectInput param="sort" options={sortOptions} />
          <SelectInput param="order" options={orderOptions} />
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
