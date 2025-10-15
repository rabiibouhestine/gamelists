"use client";

import { useState, useActionState } from "react";
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

import type { GameListType } from "@/lib/definitions";
import { Grip, Trash } from "lucide-react";
import Link from "next/link";

type GameType = {
  igdb_id: number;
  image_id: string;
  name: string;
  slug: string;
  first_release_date: number;
};

type IGDBGameType = {
  id: number;
  cover: {
    id: number;
    image_id: string;
  };
  name: string;
  slug: string;
  first_release_date: number;
};

const initialState = {
  validationErrors: {
    errors: [],
    properties: undefined,
  },
};

type ValidationErrorsType = {
  errors: string[];
  properties?: {
    name?: { errors: string[] };
    is_public?: { errors: string[] };
    is_ranked?: { errors: string[] };
    games?: {
      errors: string[];
      items?: {
        errors: string[];
        properties?: {
          id?: { errors: string[] };
          name?: { errors: string[] };
          slug?: { errors: string[] };
          cover?:
            | { errors: string[] }
            | {
                errors: string[];
                properties?: { image_id?: { errors: string[] } };
              };
        };
      }[];
    };
    description?: { errors: string[] };
  };
};

type ValidationErrorsState = {
  validationErrors: ValidationErrorsType;
};

type ListFormProps = {
  title: string;
  action: (
    initialState: ValidationErrorsState,
    formData: FormData
  ) => Promise<{
    validationErrors: ValidationErrorsType;
  }>;
  gameList?: GameListType;
  gameListGames?: GameType[];
};

export default function ListForm({
  title,
  action,
  gameList,
  gameListGames,
}: ListFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [games, setGames] = useState<GameType[]>(gameListGames || []);

  const is_public_default = gameList ? gameList.is_public.toString() : "true";
  const is_ranked_default = gameList ? gameList.is_ranked.toString() : "false";

  function onGameSelect(game: IGDBGameType) {
    const newGame = {
      igdb_id: game.id,
      name: game.name,
      slug: game.slug,
      image_id: game.cover?.image_id || "",
      first_release_date: game.first_release_date,
    };
    setGames((prev: GameType[]) => {
      if (prev.some((g) => g.igdb_id === game.id)) return prev;
      return [newGame, ...prev];
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
    <form action={formAction}>
      <input type="hidden" name="id" value={gameList?.list_id} />
      <div className="flex items-center justify-between border-b py-2 mb-6">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          <Button variant={"outline"} asChild>
            <Link href="/lists">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            Save
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="flex flex-col gap-4 col-span-6">
          <div>
            <Label className="mb-2" htmlFor="name">
              Name
              <span aria-live="polite" className="text-destructive">
                {state?.validationErrors.properties?.name?.errors}
              </span>
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="My awesome List!"
              defaultValue={gameList?.title}
            />
          </div>
          <div>
            <Label className="mb-2" htmlFor="is_public">
              Visibility
            </Label>
            <Select defaultValue={is_public_default} name="is_public">
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
            <Select defaultValue={is_ranked_default} name="is_ranked">
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
            defaultValue={gameList?.description}
          />
        </div>
      </div>
      <GameSearchInput onGameSelect={onGameSelect} />
      <input type="hidden" name="games" value={JSON.stringify(games)} />
      <p
        aria-live="polite"
        className="text-destructive mt-3 text-sm leading-none font-medium"
      >
        {state?.validationErrors.properties?.games?.errors}
      </p>
      <div className="mt-4 flex flex-col gap-2">
        {games.map((game) => (
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
                setGames((prev) =>
                  prev.filter((g) => g.igdb_id !== game.igdb_id)
                )
              }
            >
              <Trash size={24} />
            </button>
          </div>
        ))}
      </div>
    </form>
  );
}
