import GameSearchResults from "@/app/ui/games/GameSearchResults";
import SearchInput from "@/app/ui/SearchInput";
import { Suspense } from "react";
import { GameSearchResultsSkeleton } from "@/app/ui/games/GameSearchResults";
import SelectGenreInput from "@/app/ui/games/SelectGenreInput";
import SelectPlatformInput from "@/app/ui/games/SelectPlatformInput";
import Pagination from "@/app/ui/games/Pagination";

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
          <SelectGenreInput />
          <SelectPlatformInput />
        </div>
      </div>
      <Suspense fallback={<GameSearchResultsSkeleton />}>
        <GameSearchResults searchParams={searchParams} />
      </Suspense>
      <Pagination />
    </>
  );
}
