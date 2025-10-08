"use client";

import { Combobox } from "@/components/ui/combobox";
import { platform_families } from "@/app/lib/data";

import { useSearchParams, usePathname } from "next/navigation";

export default function SelectPlatformInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleSelect = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value) {
      params.set("platform", value);
    } else {
      params.delete("platform");
    }

    window.location.href = `${pathname}?${params.toString()}`;
  };

  return (
    <Combobox
      options={platform_families}
      onSelect={handleSelect}
      select_placeholder="All platforms"
      search_placeholder="Search platforms"
      initialValue={searchParams.get("platform")?.toString() ?? ""}
    />
  );
}
