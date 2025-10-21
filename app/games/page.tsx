import GameSearchResults from "@/components/GameSearchResults";
import SearchInput from "@/components/searchParamsInputs/SearchInput";
import { GameSearchResultsSkeleton } from "@/components/GameSearchResults";
import SelectInput from "@/components/searchParamsInputs/SelectInput";
import { genres, platform_families } from "@/lib/igdb/filters";
import { Suspense } from "react";

export default async function GamesPage(props: {
  searchParams?: Promise<{
    genre?: string;
    platform?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Browse Games</h1>
      <div className="flex flex-wrap gap-2 items-center border-b py-3">
        <SearchInput placeholder="Search Game" className="flex-3 min-w-60" />
        <SelectInput
          className="flex-1 min-w-60"
          param="genre"
          options={genres}
        />
        <SelectInput
          className="flex-1 min-w-40"
          param="platform"
          options={platform_families}
        />
      </div>
      <Suspense fallback={<GameSearchResultsSkeleton />}>
        <GameSearchResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}
