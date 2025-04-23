"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useQueryTableFilters } from "./use-query-table-filters";
import { DataTableResetFilter } from "@/components/ui/table/data-table-reset-filter";
import { DataTableFilterBox } from "@/components/ui/table/data-table-filter-box";

export default function QueriesTableActions() {
  const {
    isAnyFilterActive,
    resetFilters,
    searchQuery,
    setPage,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useQueryTableFilters();

  return (
    <div className="my-3 flex flex-wrap items-center gap-4">
      <DataTableSearch
        searchKey="name"
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setPage={setPage}
      />

      <DataTableFilterBox
        filterKey="status"
        title="Status"
        options={[
          { label: "Pending", value: "pending" },
          { label: "In Progress", value: "in progress" },
          { label: "Resolved", value: "resolved" },
        ]}
        setFilterValue={setStatusFilter}
        filterValue={statusFilter}
      />

      <DataTableResetFilter
        isFilterActive={isAnyFilterActive}
        onReset={resetFilters}
      />
    </div>
  );
}
