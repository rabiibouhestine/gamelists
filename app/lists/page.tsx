import SearchInput from "@/components/page/SearchInput";
import GameListCard from "@/components/page/GameListCard";
import SelectSortInput from "@/components/lists/SelectSortInput";
import SelectSortOrderInput from "@/components/lists/SelectSortOrderInput";
import Pagination from "@/components/games/Pagination";
import { getGameLists } from "@/lib/data";

export default async function Page(props: {
  searchParams?: Promise<{
    search?: string;
    sort?: "created_at" | "nb_likes" | "nb_comments" | "total_games_count";
    order?: "ASC" | "DESC";
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 1;
  const searchTerm = searchParams?.search || "";
  const sort = searchParams?.sort || "created_at";
  const order = searchParams?.order || "DESC";
  const gameLists = await getGameLists({
    page: currentPage,
    searchTerm: searchTerm,
    sortColumn: sort,
    orderDirection: order,
  });
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Browse Lists</h1>
      <div className="flex gap-2 justify-between items-center border-b py-3">
        <SearchInput placeholder="Search List" />
        <SelectSortInput />
        <SelectSortOrderInput />
      </div>
      <div className="flex flex-col gap-6">
        {gameLists.results.map((list) => (
          <GameListCard key={list.list_id} gamelist={list} />
        ))}
      </div>
      <Pagination limit={10} total={gameLists.total} />
    </>
  );
}
