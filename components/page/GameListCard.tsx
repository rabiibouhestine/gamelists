import Image from "next/image";
import type { GameListType } from "@/lib/definitions";
type GameListProps = {
  gamelist: GameListType;
};

export default function GameListCard({ gamelist }: GameListProps) {
  return (
    <div className="mt-6">
      <h3 className="font-bold text-2xl">{gamelist.title}</h3>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Image
            src={gamelist.creator_profile_img}
            alt={gamelist.creator_username}
            width={20}
            height={20}
            className="rounded-full w-4 h-4"
          />
          <span className="font-bold">{gamelist.creator_username}</span>
        </div>
        <span>{gamelist.total_games_count} Games</span>
        <span>{gamelist.nb_likes} Likes</span>
        <span>{gamelist.nb_comments} Comments</span>
      </div>
      <p className="mt-2 line-clamp-2">{gamelist.description}</p>
      <div className="w-full bg-card rounded-md mt-3 flex">
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
      </div>
    </div>
  );
}
