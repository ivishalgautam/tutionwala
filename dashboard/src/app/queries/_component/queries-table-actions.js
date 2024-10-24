"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useQueryTableFilters } from "./use-query-table-filters";

export default function QueriesTableActions() {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useQueryTableFilters();

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
    </div>
  );
}
