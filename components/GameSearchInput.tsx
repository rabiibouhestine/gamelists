"use client";

import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

import type { InvolvedCompany } from "@/lib/definitions";

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

type GameSearchInputProps = {
  onGameSelect?: (game: GameType) => void;
};

export default function GameSearchInput({
  onGameSelect,
}: GameSearchInputProps) {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<GameType[]>([]);
  const [loading, setLoading] = useState(false);

  const showDropdown = searchResults.length > 0;

  const debouncedSearch = useDebouncedCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/games?search=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

      const data = await res.json();

      setSearchResults(data);
    } catch (err) {
      console.error("Error searching game:", err);
    } finally {
      setLoading(false);
    }
  }, 300);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearch(value);
    debouncedSearch(value);
  }

  function handleGameClick(game: GameType) {
    setSearch("");
    setSearchResults([]);
    onGameSelect?.(game);
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
    <div className="relative">
      <div className="relative w-full">
        <Input
          type="text"
          placeholder="Search Games..."
          className="peer pl-10"
          value={search}
          onChange={handleChange}
        />
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-input peer-focus:text-ring" />

        {loading && (
          <p className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            Searching...
          </p>
        )}
      </div>
      {showDropdown && (
        <div className="absolute top-10 w-full bg-card border rounded-md max-h-60 overflow-auto">
          {searchResults.map((game) => (
            <div
              key={game.slug}
              className="flex items-center gap-4 px-4 py-2 hover:bg-muted-foreground/20 hover:cursor-pointer"
              onClick={() => handleGameClick(game)}
            >
              <Image
                className="w-10 rounded-sm"
                src={`https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover?.image_id}.jpg`}
                alt={game.name}
                width={90}
                height={128}
              />
              <div className="flex flex-col gap-1">
                <span className="font-bold">{game.name}</span>
                <span className="text-muted-foreground">
                  Released on {formatDate(game.first_release_date)} by{" "}
                  {game.involved_companies &&
                    game.involved_companies
                      .filter((c: InvolvedCompany) => c.developer)
                      .map((c: InvolvedCompany) => c.company?.name)
                      .join(", ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
