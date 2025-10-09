"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  return (
    <div className="mt-8 flex justify-between">
      {currentPage > 1 ? (
        <Button asChild variant={"outline"}>
          <Link href={createPageURL(currentPage - 1)}>Previous Page</Link>
        </Button>
      ) : (
        <Button variant={"outline"} disabled>
          Previous Page
        </Button>
      )}
      <Button asChild variant={"outline"}>
        <Link href={createPageURL(currentPage + 1)}>Next Page</Link>
      </Button>
    </div>
  );
}
