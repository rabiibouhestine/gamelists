import GameListCard from "@/components/GameListCard";
import SelectInput from "@/components/searchParamsInputs/SelectInput";
import { sortOptions, orderOptions } from "@/lib/data";
import { getUsernameLists, fetchUserInfo } from "@/lib/data";
import Pagination from "@/components/searchParamsInputs/Pagination";
import Image from "next/image";

export default async function Page(props: {
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
  const formattedUserInfoCreatedAt = new Date(
    userInfo.created_at
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const gameLists = await getUsernameLists({
    page: Number(page),
    limit: limit,
    sortColumn: sortColumn,
    orderDirection: orderDirection,
    username: username,
  });

  return (
    <>
      <div className="bg-card border rounded-md p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Image
            src={userInfo.profile_image}
            alt={userInfo.username}
            width={80}
            height={80}
            className="rounded-full w-20 h-20"
          />
          <div>
            <h1 className="text-3xl font-bold">{userInfo.username}</h1>
            <span className="text-muted-foreground">
              Member since {formattedUserInfoCreatedAt}
            </span>
          </div>
        </div>
        <div className="flex items-center divide-x-2">
          <div className="flex flex-col items-center py-1 px-4">
            <span className="text-2xl font-bold">{userInfo.nb_likes_made}</span>
            <span className="text-muted-foreground text-sm">Likes</span>
          </div>
          <div className="flex flex-col items-center py-1 px-4">
            <span className="text-2xl font-bold">
              {userInfo.nb_comments_made}
            </span>
            <span className="text-muted-foreground text-sm">Comments</span>
          </div>
          <div className="flex flex-col items-center py-1 px-4">
            <span className="text-2xl font-bold">
              {userInfo.nb_lists_created}
            </span>
            <span className="text-muted-foreground text-sm">Lists</span>
          </div>
          <div className="flex flex-col items-center py-1 px-4">
            <span className="text-2xl font-bold">{userInfo.nb_following}</span>
            <span className="text-muted-foreground text-sm">Following</span>
          </div>
          <div className="flex flex-col items-center py-1 px-4">
            <span className="text-2xl font-bold">{userInfo.nb_followers}</span>
            <span className="text-muted-foreground text-sm">Followers</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-between items-center border-b py-3 mt-6">
        <h2 className="text-3xl font-semibold">Lists</h2>
        <div className="flex gap-2">
          <SelectInput param="sort" options={sortOptions} />
          <SelectInput param="order" options={orderOptions} />
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
