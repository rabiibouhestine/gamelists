"use client";

import Link from "next/link";
import { useState, useActionState } from "react";
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
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type {
  GameListType,
  GameIGDBType,
  GameType,
  ListFormActionType,
} from "@/lib/definitions";
import ListFormGame from "@/components/forms/ListFormGame";

const initialState = {
  validationErrors: {
    errors: [],
  },
};

type ListFormProps = {
  title: string;
  cancelLink: string;
  gameList?: GameListType;
  gameListGames?: GameType[];
  action: ListFormActionType;
};

export default function ListForm({
  title,
  cancelLink,
  gameList,
  gameListGames,
  action,
}: ListFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [games, setGames] = useState<GameType[]>(gameListGames || []);
  const [name, setName] = useState<string>(gameList?.title || "");
  const [isRanked, setIsRanked] = useState<string>(
    gameList ? gameList.is_ranked.toString() : "false"
  );
  const [description, setDescription] = useState<string>(
    gameList?.description || ""
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const is_public_default = gameList ? gameList.is_public.toString() : "true";

  function onGameSelect(game: GameIGDBType) {
    const newGame = {
      id: game.id,
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;
    if (active.id === over.id) return;

    if (active.id !== over.id) {
      setGames((games) => {
        const oldIndex = games.findIndex((game) => game.id === active.id);
        const newIndex = games.findIndex((game) => game.id === over.id);

        if (oldIndex === -1 || newIndex === -1) return games;

        return arrayMove(games, oldIndex, newIndex);
      });
    }
  }

  return (
    <form action={formAction}>
      <input type="hidden" name="id" value={gameList?.list_id} />
      <div className="flex flex-wrap gap-3 items-center border-b py-2 mb-6">
        <h1 className="flex-2 min-w-60 text-3xl font-bold">{title}</h1>
        <div className="flex-1 min-w-60 flex items-center gap-2">
          <Button variant={"outline"} asChild className="flex-1">
            <Link href={cancelLink}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending} className="flex-1">
            Save
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-6 mb-6">
        <div className="flex-1 min-w-60 flex flex-col gap-4 col-span-6">
          <div>
            <Label className="mb-2" htmlFor="name">
              Name
              <span aria-live="polite" className="text-destructive">
                {state?.validationErrors?.properties?.name?.errors}
              </span>
            </Label>
            <Input
              type="text"
              name="name"
              placeholder="My awesome List!"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
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
            <Select
              value={isRanked}
              name="is_ranked"
              onValueChange={(value) => {
                setIsRanked(value);
              }}
            >
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
        <div className="flex-1 min-w-60">
          <Label className="mb-2" htmlFor="description">
            Description
          </Label>
          <Textarea
            className="min-h-46 resize-none"
            name="description"
            placeholder="A list of all the awesome games I played recently..."
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={games} strategy={verticalListSortingStrategy}>
            {games.map((game, index) => (
              <ListFormGame
                key={game.slug}
                id={game.id}
                game={game}
                setGames={setGames}
                isRanked={isRanked}
                rank={index + 1}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </form>
  );
}
