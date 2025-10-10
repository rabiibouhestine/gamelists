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

const orderOptions = [
  {
    value: "DESC",
    label: "Descending",
  },
  {
    value: "ASC",
    label: "Ascending",
  },
];

export default function SelectSortOrderInput() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [orderValue, setOrderValue] = useState(
    searchParams.get("sort")?.toString() ?? "created_at"
  );

  useEffect(() => {
    const currentOrder = searchParams.get("order")?.toString() ?? "DESC";
    setOrderValue(currentOrder);
  }, [searchParams]);

  const handleSelect = (value: string) => {
    setOrderValue(value);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value) {
      params.set("order", value);
    } else {
      params.delete("order");
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleSelect} value={orderValue}>
      <SelectTrigger className="w-40">
        <SelectValue placeholder="Sort Order" />
      </SelectTrigger>
      <SelectContent>
        {orderOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
