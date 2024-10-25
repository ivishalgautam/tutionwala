"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useSubCatTableFilters } from "./use-subcat-table-filters";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { useFetchCategories } from "@/hooks/useFetchCategories";
import { useMemo } from "react";
import Spinner from "@/components/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubcatTableActions() {
  const { data: categories, isLoading, isError, error } = useFetchCategories();
  const {
    categoriesFilter,
    setCategoriesFilter,
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
  } = useSubCatTableFilters();

  const formattedCategories = useMemo(
    () =>
      categories?.map(({ slug: value, name: label }) => ({
        value,
        label,
      })) ?? [],
    [categories],
  );

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />
      {isLoading && <Skeleton className="h-[40px] w-[135.38px] rounded-md" />}
      {isError && (
        <div className="h-[40px] w-[135.38px] rounded-md">
          {error?.message ?? "Error loading categories"}
        </div>
      )}
      {categories && (
        <DataTableFilterBox
          filterKey="categories"
          title="Categories"
          options={formattedCategories}
          setFilterValue={setCategoriesFilter}
          filterValue={categoriesFilter}
        />
      )}
      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
