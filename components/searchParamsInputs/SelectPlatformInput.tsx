"use client";

import { platform_families } from "@/lib/igdb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function SelectPlatformInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [platformValue, setPlatformValue] = useState(
    searchParams.get("platform")?.toString() ?? platform_families[0].value
  );

  useEffect(() => {
    const currentSort =
      searchParams.get("platform")?.toString() ?? platform_families[0].value;
    setPlatformValue(currentSort);
  }, [searchParams]);

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value) {
      params.set("platform", value);
    } else {
      params.delete("platform");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleSelect} value={platformValue}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Select Platform" />
      </SelectTrigger>
      <SelectContent>
        {platform_families.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
