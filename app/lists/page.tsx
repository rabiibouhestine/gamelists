import SearchInput from "@/components/searchParamsInputs/SearchInput";
import GameListCard from "@/components/GameListCard";
import Pagination from "@/components/searchParamsInputs/Pagination";
import SelectInput from "@/components/searchParamsInputs/SelectInput";
import { sortOptions, orderOptions } from "@/lib/data/filters";
import { getGameLists } from "@/lib/data/getGameLists";
import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ListsPage(props: {
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

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Browse Lists</h1>
      <div className="flex gap-2 justify-between items-center border-b py-3">
        <SearchInput placeholder="Search List" />
        <SelectInput param="sort" options={sortOptions} />
        <SelectInput param="order" options={orderOptions} />
        {data.user && (
          <Button asChild>
            <Link href="/lists/create">
              <Plus /> New List
            </Link>
          </Button>
        )}
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
