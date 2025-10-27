import GameListCard from "@/components/GameListCard";
import UserInfoCard from "@/components/UserInfoCard";
import SelectInput from "@/components/searchParamsInputs/SelectInput";
import Pagination from "@/components/searchParamsInputs/Pagination";
import { sortOptions, orderOptions } from "@/lib/data/filters";
import { getUserInfo } from "@/lib/data/getUserInfo";
import { getGameListsByUsername } from "@/lib/data/getGameListsByUsername";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";

export default async function UserPage(props: {
  params: Promise<{ username: string }>;
  searchParams?: Promise<{
    sort?: "created_at" | "nb_likes" | "total_games_count";
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

  const userInfo = await getUserInfo(username);

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  const gameLists = await getGameListsByUsername({
    page: Number(page),
    limit: limit,
    sortColumn: sortColumn,
    orderDirection: orderDirection,
    username: username,
    publicOnly: !data.user,
  });

  const showFollowBtn = !!data.user && data.user.id !== userInfo.id;
  const showEditBtns = !!data.user && data.user.id === userInfo.id;

  let is_following = false;
  if (data.user) {
    const { data: existingFollow } = await supabase
      .from("follows")
      .select("*")
      .eq("follower_id", data.user.id)
      .eq("followed_id", userInfo.id)
      .maybeSingle();
    if (existingFollow) {
      is_following = true;
    }
  }

  return (
    <>
      <UserInfoCard
        userInfo={userInfo}
        showEditBtns={showEditBtns}
        showFollowBtn={showFollowBtn}
        is_following={is_following}
      />
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b py-3 mt-6">
        <h2 className="text-3xl font-semibold">Lists</h2>
        <div className="flex flex-wrap gap-2">
          <SelectInput
            param="sort"
            options={sortOptions}
            className="flex-1 min-w-60"
          />
          <SelectInput
            param="order"
            options={orderOptions}
            className="flex-1 min-w-40"
          />
          {data.user?.id === userInfo.id && (
            <Button asChild className="flex-1 min-w-40">
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
