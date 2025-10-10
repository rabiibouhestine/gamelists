"use client";

import { gameGenres } from "@/lib/igdb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SelectGenreInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [genreValue, setGenreValue] = useState(
    searchParams.get("genre")?.toString() ?? gameGenres[0].value
  );

  useEffect(() => {
    const currentSort =
      searchParams.get("genre")?.toString() ?? gameGenres[0].value;
    setGenreValue(currentSort);
  }, [searchParams]);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value) {
      params.set("genre", value);
    } else {
      params.delete("genre");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleSelect} value={genreValue}>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Select Genre" />
      </SelectTrigger>
      <SelectContent>
        {gameGenres.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
