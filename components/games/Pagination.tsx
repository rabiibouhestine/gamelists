"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({
  limit,
  total,
}: {
  limit?: number;
  total?: number;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Compute last page only if both limit and total exist
  const lastPage = limit && total ? Math.ceil(total / limit) : undefined;

  const isFirstPage = currentPage <= 1;
  const isLastPage = lastPage ? currentPage >= lastPage : false;

  return (
    <div className="mt-8 flex justify-between">
      <Button asChild={!isFirstPage} variant="outline" disabled={isFirstPage}>
        {isFirstPage ? (
          <>Previous Page</>
        ) : (
          <Link href={createPageURL(currentPage - 1)}>Previous Page</Link>
        )}
      </Button>

      <Button asChild={!isLastPage} variant="outline" disabled={isLastPage}>
        {isLastPage ? (
          <>Next Page</>
        ) : (
          <Link href={createPageURL(currentPage + 1)}>Next Page</Link>
        )}
      </Button>
    </div>
  );
}
