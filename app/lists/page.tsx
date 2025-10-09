import SearchInput from "@/components/page/SearchInput";
import GameListCard from "@/components/page/GameListCard";
import SelectGenreInput from "@/components/games/SelectGenreInput";
import Pagination from "@/components/games/Pagination";
import { getRecentGameLists } from "@/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    genre?: string;
    platform?: string;
    search?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const gameLists = await getRecentGameLists();
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Browse Lists</h1>
      <div className="flex gap-2 justify-between items-center border-b py-3">
        <SearchInput placeholder="Search List" />
        <SelectGenreInput />
      </div>
      <div className="flex flex-col gap-6">
        {gameLists.map((list) => (
          <GameListCard key={list.list_id} gamelist={list} />
        ))}
      </div>
      <Pagination />
    </>
  );
}
