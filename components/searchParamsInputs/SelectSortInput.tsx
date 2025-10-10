"use client";

import { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sortOptions = [
  {
    value: "created_at",
    label: "Sort by Creation Date",
  },
  {
    value: "nb_likes",
    label: "Sort by Likes",
  },
  {
    value: "nb_comments",
    label: "Sort by Comments",
  },
  {
    value: "total_games_count",
    label: "Sort by Games",
  },
];

export default function SelectSortInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [sortValue, setSortValue] = useState(
    searchParams.get("sort")?.toString() ?? "created_at"
  );

  useEffect(() => {
    const currentSort = searchParams.get("sort")?.toString() ?? "created_at";
    setSortValue(currentSort);
  }, [searchParams]);

  const handleSelect = (value: string) => {
    setSortValue(value);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleSelect} value={sortValue}>
      <SelectTrigger className="w-60">
        <SelectValue placeholder="Sort Lists..." />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
