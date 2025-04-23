import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export function useQueryTableFilters() {
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    searchParams.q
      .withOptions({ shallow: false, throttleMs: 1000 })
      .withDefault(""),
  );

  const [page, setPage] = useQueryState(
    "page",
    searchParams.page.withDefault(1),
  );

  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    searchParams.status.withDefault(""),
  );
  const resetFilters = useCallback(() => {
    setSearchQuery(null);
    setStatusFilter(null);
    setPage(1);
  }, [setSearchQuery, setPage, setStatusFilter]);

  const isAnyFilterActive = useMemo(() => {
    return !!searchQuery || !!statusFilter;
  }, [searchQuery, statusFilter]);

  return {
    searchQuery,
    setSearchQuery,
    page,
    setPage,
    resetFilters,
    isAnyFilterActive,
    statusFilter,
    setStatusFilter,
  };
}
