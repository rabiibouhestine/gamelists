"use client";

import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchInput({ placeholder }: { placeholder: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [term, setTerm] = useState(
    searchParams.get("search")?.toString() ?? ""
  );

  useEffect(() => {
    const currentSearch = searchParams.get("search") ?? "";
    setTerm(currentSearch);
  }, [searchParams]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }

    window.location.href = `${pathname}?${params.toString()}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(term);
    }
  };

  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder={placeholder}
        className="peer pl-10"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-input peer-focus:text-ring" />
    </div>
  );
}
