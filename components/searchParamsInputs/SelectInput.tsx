"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type SelectInputProps = {
  className?: string;
  param: string;
  options: {
    value: string;
    label: string;
  }[];
};

export default function SelectInput({
  className,
  param,
  options,
}: SelectInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [paramValue, setParamValue] = useState(
    searchParams.get(param)?.toString() ?? options[0].value
  );

  useEffect(() => {
    const currentParamValue =
      searchParams.get(param)?.toString() ?? options[0].value;
    setParamValue(currentParamValue);
  }, [searchParams, options, param]);

  const handleSelect = (value: string) => {
    setParamValue(value);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select onValueChange={handleSelect} value={paramValue}>
      <SelectTrigger className={className ? className : ""}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
