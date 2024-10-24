"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useSubCatTableFilters } from "./use-subcat-table-filters";

export default function SubcatTableActions() {
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useSubCatTableFilters();

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
