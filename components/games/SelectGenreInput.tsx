"use client";

import { Combobox } from "@/components/ui/combobox";
import { gameGenres } from "@/lib/data";

import { useSearchParams, usePathname } from "next/navigation";

export default function SelectGenreInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value) {
      params.set("genre", value);
    } else {
      params.delete("genre");
    }

    window.location.href = `${pathname}?${params.toString()}`;
  };

  return (
    <Combobox
      options={gameGenres}
      onSelect={handleSelect}
      select_placeholder="All genres"
      search_placeholder="Search genres"
      initialValue={searchParams.get("genre")?.toString() ?? ""}
    />
  );
}
