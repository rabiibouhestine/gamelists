import Image from "next/image";
import Link from "next/link";
import type { GameListType } from "@/lib/definitions";
type GameListProps = {
  gamelist: GameListType;
};

export default function GameListCard({ gamelist }: GameListProps) {
  return (
    <div className="mt-6">
      <Link href={`/lists/${gamelist.list_id}`}>
        <h3 className="font-bold text-2xl">{gamelist.title}</h3>
      </Link>
      <p className="line-clamp-2">{gamelist.description}</p>
      <div className="flex items-center gap-2 my-3">
        <div className="flex items-center gap-1">
          <Image
            src={gamelist.creator_profile_img}
            alt={gamelist.creator_username}
            width={20}
            height={20}
            className="rounded-full w-4 h-4"
          />
          <Link
            href={`/users/${gamelist.creator_username}`}
            className="font-bold"
          >
            {gamelist.creator_username}
          </Link>
        </div>
        <span>{gamelist.total_games_count} Games</span>
        <span>{gamelist.nb_likes} Likes</span>
        <span>{gamelist.nb_comments} Comments</span>
      </div>
      <Link
        href={`/lists/${gamelist.list_id}`}
        className="w-full bg-card rounded-md mt-3 flex"
      >
        {gamelist.games.map((game, index) => (
          <Image
            key={game.id}
            src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.img}.jpg`}
            alt={game.name}
            width={246}
            height={352}
            className="object-cover rounded-md -mr-3 shadow-[2px_0_7px_#000]"
            style={{ zIndex: 8 - index }}
          />
        ))}
      </Link>
    </div>
  );
}
