import GameSearchResults from "@/components/GameSearchResults";
import SearchInput from "@/components/searchParamsInputs/SearchInput";
import { GameSearchResultsSkeleton } from "@/components/GameSearchResults";
import SelectInput from "@/components/searchParamsInputs/SelectInput";
import { gameGenres, platform_families } from "@/lib/igdb";
import { Suspense } from "react";

export default async function Page(props: {
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
      <div className="flex gap-2 justify-between items-center border-b py-3">
        <SearchInput placeholder="Search Game" />
        <div className="flex gap-2">
          <SelectInput className="w-60" param="genre" options={gameGenres} />
          <SelectInput
            className="w-40"
            param="platform"
            options={platform_families}
          />
        </div>
      </div>
      <Suspense fallback={<GameSearchResultsSkeleton />}>
        <GameSearchResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}
