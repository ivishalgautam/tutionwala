"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useCategoryTableFilters } from "./use-category-table-filters";

export default function CategoryTableActions() {
  const { resetFilters, searchQuery, setPage, setSearchQuery } =
    useCategoryTableFilters();

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
