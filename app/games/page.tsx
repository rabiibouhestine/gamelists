import GameSearchResults from "@/app/ui/games/GameSearchResults";
import SearchInput from "@/app/ui/SearchInput";
import { Suspense } from "react";
import { GameSearchResultsSkeleton } from "@/app/ui/games/GameSearchResults";
import SelectGenreInput from "@/app/ui/games/SelectGenreInput";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Browse Games</h1>
      <div className="flex justify-between items-center border-b py-2">
        <SearchInput placeholder="Search Game" />
        <SelectGenreInput />
      </div>
      <Suspense fallback={<GameSearchResultsSkeleton />}>
        <GameSearchResults searchParams={searchParams} />
      </Suspense>
    </>
  );
}
