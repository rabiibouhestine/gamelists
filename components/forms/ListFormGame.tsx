import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Grip, Trash } from "lucide-react";

import type { GameType } from "@/lib/definitions";

type ListFormGameProps = {
  game: GameType;
  setGames: Dispatch<SetStateAction<GameType[]>>;
};

export default function ListFormGame({ game, setGames }: ListFormGameProps) {
  function formatDate(date: number) {
    const dateObj = new Date(date * 1000);
    const formattedDateObj = dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
    return formattedDateObj;
  }

  return (
    <div
      key={game.slug}
      className="flex items-center gap-4 px-4 py-2 rounded-md bg-card border"
    >
      <Grip size={32} className="text-muted-foreground" />
      <Image
        className="w-14 rounded-sm"
        src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.image_id}.jpg`}
        alt={game.name}
        width={90}
        height={128}
      />
      <div className="flex flex-col gap-1">
        <span className="font-bold">{game.name}</span>
        <span className="text-muted-foreground">
          Released on {formatDate(game.first_release_date)}
        </span>
      </div>
      <button
        className="ml-auto text-muted-foreground hover:text-destructive hover:cursor-pointer"
        onClick={() =>
          setGames((prev) => prev.filter((g) => g.igdb_id !== game.igdb_id))
        }
      >
        <Trash size={24} />
      </button>
    </div>
  );
}
