"use client";

import { Button } from "@/components/ui/button";
import { useSearchParams, usePathname } from "next/navigation";
import { useRouter } from "@bprogress/next/app";

export default function Pagination({
  limit,
  total,
  resultsCount,
}: {
  limit?: number;
  total?: number;
  resultsCount?: number; // number of results in the current page
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = Number(searchParams.get("page")) || 1;

  function handlePaginate(pageNumber: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());

    router.replace(`${pathname}?${params.toString()}`);
  }

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
      <Button
        variant="outline"
        disabled={isFirstPage}
        onClick={() => handlePaginate(currentPage - 1)}
      >
        Previous Page
      </Button>
      <Button
        variant="outline"
        disabled={isLastPage}
        onClick={() => handlePaginate(currentPage + 1)}
      >
        Next Page
      </Button>
    </div>
  );
}
