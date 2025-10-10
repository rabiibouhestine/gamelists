"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";

export default function Pagination({
  limit,
  total,
  resultsCount,
}: {
  limit?: number;
  total?: number;
  resultsCount?: number; // number of results in the current page
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Compute lastPage when total is available
  const lastPage = limit && total ? Math.ceil(total / limit) : undefined;

  const isFirstPage = currentPage <= 1;

  // Determine if it's the last page:
  // 1. If total known -> compare with lastPage
  // 2. If only resultsCount known -> disable when fewer results than limit
  // 3. Otherwise -> assume not last page
  const isLastPage =
    limit && total
      ? currentPage >= (lastPage ?? 1)
      : limit && resultsCount !== undefined
      ? resultsCount < limit
      : false;

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
