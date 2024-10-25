"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useCategoryTableFilters } from "./use-category-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";

export default function CategoryTableActions() {
  const {
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    isAnyFilterActive,
  } = useCategoryTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
