import Image from "next/image";
import Link from "next/link";
import type { GameListType } from "@/lib/definitions";
import { Heart, MessageCircle } from "lucide-react";
type GameListProps = {
  gamelist: GameListType;
};

export default function GameListCard({ gamelist }: GameListProps) {
  return (
    <div className="mt-6">
      <Link href={`/lists/${gamelist.list_id}`} className="hover:underline">
        <h3 className="font-bold text-2xl">{gamelist.title}</h3>
      </Link>
      <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground font-light">
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
            className="font-bold hover:underline"
          >
            {gamelist.creator_username}
          </Link>
        </div>
        <span>{gamelist.total_games_count} Games</span>
        <span className="flex items-center gap-1">
          {gamelist.nb_likes} <Heart size={18} />
        </span>
        <span className="flex items-center gap-1">
          {gamelist.nb_comments} <MessageCircle size={18} />
        </span>
      </div>
      <Link
        href={`/lists/${gamelist.list_id}`}
        className="w-full bg-card rounded-md mt-3 overflow-hidden grid grid-cols-22 hover:ring hover:ring-accent-foreground"
      >
        {gamelist.games.map((game, index) => (
          <Image
            key={game.id}
            src={`https://images.igdb.com/igdb/image/upload/t_cover_big/${game.img}.jpg`}
            alt={game.name}
            width={246}
            height={352}
            className="h-full object-cover rounded-md shadow-[2px_0_7px_#000] col-span-4 row-start-1"
            style={{ zIndex: 8 - index, gridColumnStart: index * 3 + 1 }}
          />
        ))}
      </Link>
    </div>
  );
}
