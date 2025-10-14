import GameListCard from "@/components/GameListCard";
import UserInfoCard from "@/components/UserInfoCard";
import SelectInput from "@/components/searchParamsInputs/SelectInput";
import Pagination from "@/components/searchParamsInputs/Pagination";
import { sortOptions, orderOptions } from "@/lib/data";
import { getUsernameLists, fetchUserInfo } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{
    sort?: "created_at" | "nb_likes" | "nb_comments" | "total_games_count";
    order?: "ASC" | "DESC";
    page?: string;
  }>;
}) {
  const limit = 10;

  const params = await props.params;
  const username = params.username;

  const searchParams = await props.searchParams;
  const page = searchParams?.page;
  const sortColumn = searchParams?.sort;
  const orderDirection = searchParams?.order;

  const userInfo = await fetchUserInfo(username);

  const gameLists = await getUsernameLists({
    page: Number(page),
    limit: limit,
    sortColumn: sortColumn,
    orderDirection: orderDirection,
    username: username,
  });

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return (
    <>
      <UserInfoCard userInfo={userInfo} />
      <div className="flex gap-2 justify-between items-center border-b py-3 mt-6">
        <h2 className="text-3xl font-semibold">Lists</h2>
        <div className="flex gap-2">
          <SelectInput param="sort" options={sortOptions} />
          <SelectInput param="order" options={orderOptions} />
          {data.user?.id === userInfo.id && (
            <Button asChild>
              <Link href="/lists/create">
                <Plus /> New List
              </Link>
            </Button>
          )}
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
