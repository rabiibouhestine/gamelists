import Image from "next/image";
import { Dispatch, SetStateAction } from "react";
import { Grip, Trash } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { GameType } from "@/lib/definitions";

type ListFormGameProps = {
  id: number;
  game: GameType;
  setGames: Dispatch<SetStateAction<GameType[]>>;
  isRanked: string;
  rank: number;
};

export default function ListFormGame({
  id,
  game,
  setGames,
  isRanked,
  rank,
}: ListFormGameProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

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
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 px-4 py-2 rounded-md bg-card border"
    >
      <Grip
        size={32}
        className="text-muted-foreground focus:outline-none hover:cursor-grab"
        {...attributes}
        {...listeners}
      />
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {isRanked === "true" && (
          <span className="rounded-full h-10 w-10 flex items-center justify-center font-bold bg-muted">
            {rank}
          </span>
        )}
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
