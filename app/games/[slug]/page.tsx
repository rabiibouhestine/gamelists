import GameListCard from "@/components/GameListCard";
import GameInfoCard from "@/components/GameInfoCard";
import { GameInfoCardSkeleton } from "@/components/GameInfoCard";
import { Suspense } from "react";
import SelectInput from "@/components/searchParamsInputs/SelectInput";
import { sortOptions, orderOptions } from "@/lib/data/filters";
import { getGameListsBySlug } from "@/lib/data/getGameListsBySlug";
import Pagination from "@/components/searchParamsInputs/Pagination";

export default async function GamePage(props: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{
    sort?: "created_at" | "nb_likes" | "total_games_count";
    order?: "ASC" | "DESC";
    page?: string;
  }>;
}) {
  const limit = 10;

  const params = await props.params;
  const slug = params.slug;

  const searchParams = await props.searchParams;
  const page = searchParams?.page;
  const sortColumn = searchParams?.sort;
  const orderDirection = searchParams?.order;

  const gameLists = await getGameListsBySlug({
    page: Number(page),
    limit: limit,
    sortColumn: sortColumn,
    orderDirection: orderDirection,
    gameSlug: slug,
  });

  return (
    <>
      <Suspense fallback={<GameInfoCardSkeleton />}>
        <GameInfoCard slug={slug} />
      </Suspense>
      <div className="flex flex-wrap gap-2 items-center border-b py-3 mt-6">
        <h2 className="flex-3 min-w-60 text-3xl font-semibold">
          Related Lists
        </h2>
        <div className="flex-1 min-w-80 flex flex-wrap gap-2">
          <SelectInput
            param="sort"
            options={sortOptions}
            className="flex-1 min-w-30"
          />
          <SelectInput
            param="order"
            options={orderOptions}
            className="flex-1 min-w-30"
          />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        {gameLists.results.map((list) => (
          <GameListCard key={list.list_id} gamelist={list} />
        ))}
      </div>
      <Pagination
        limit={limit}
        total={gameLists.total}
        resultsCount={gameLists.results.length}
      />
    </>
  );
}
