"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import GameSearchInput from "@/components/GameSearchInput";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateList } from "@/lib/actions";

import type { InvolvedCompany } from "@/lib/definitions";
import { Grip, Trash } from "lucide-react";
import Link from "next/link";

type GameType = {
  id: number;
  cover: {
    id: number;
    image_id: string;
  };
  name: string;
  slug: string;
  first_release_date: number;
  involved_companies: {
    id: number;
    developer: boolean;
    company: {
      id: number;
      name: string;
    };
  }[];
  platforms: {
    id: number;
    name: string;
  }[];
};

export default function CreateListPage() {
  const [games, setGames] = useState<GameType[]>([]);

  function onGameSelect(game: GameType) {
    setGames((prev: GameType[]) => {
      if (prev.some((g) => g.id === game.id)) return prev;
      return [game, ...prev];
    });
  }

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
    <form>
      <div className="flex items-center justify-between border-b py-2 mb-6">
        <h1 className="text-3xl font-bold">Create List</h1>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/lists">Cancel</Link>
          </Button>
          <Button formAction={CreateList}>Save</Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="flex flex-col gap-4 col-span-6">
          <div>
            <Label className="mb-2" htmlFor="name">
              Name
            </Label>
            <Input type="text" name="name" placeholder="My awesome List!" />
          </div>
          <div>
            <Label className="mb-2" htmlFor="is_public">
              Visibility
            </Label>
            <Select value={"true"} name="is_public">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"true"}>Public</SelectItem>
                <SelectItem value={"false"}>Private</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2" htmlFor="is_ranked">
              Type
            </Label>
            <Select value={"false"} name="is_ranked">
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"false"}>Normal</SelectItem>
                <SelectItem value={"true"}>Ranked</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="col-span-6">
          <Label className="mb-2" htmlFor="description">
            Description
          </Label>
          <Textarea
            className="min-h-46 resize-none"
            name="description"
            placeholder="A list of all the awesome games I played recently..."
          />
        </div>
      </div>
      <GameSearchInput onGameSelect={onGameSelect} />
      <input type="hidden" name="games" value={JSON.stringify(games)} />
      <div className="mt-4 flex flex-col gap-2">
        {games.map((game) => (
          <div
            key={game.slug}
            className="flex items-center gap-4 px-4 py-2 rounded-md bg-card border"
          >
            <Grip size={32} className="text-muted-foreground" />
            <Image
              className="w-14 rounded-sm"
              src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover?.image_id}.jpg`}
              alt={game.name}
              width={90}
              height={128}
            />
            <div className="flex flex-col gap-1">
              <span className="font-bold">{game.name}</span>
              <div className="text-muted-foreground">
                <span>Released on </span>
                <span className="font-semibold">
                  {formatDate(game.first_release_date)}
                </span>
                <span> by </span>
                <span className="font-semibold">
                  {game.involved_companies &&
                    game.involved_companies
                      .filter((c: InvolvedCompany) => c.developer)
                      .map((c: InvolvedCompany) => c.company?.name)
                      .join(", ")}
                </span>
              </div>
            </div>
            <button
              className="ml-auto text-muted-foreground hover:text-destructive hover:cursor-pointer"
              onClick={() =>
                setGames((prev) => prev.filter((g) => g.id !== game.id))
              }
            >
              <Trash size={32} />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}
