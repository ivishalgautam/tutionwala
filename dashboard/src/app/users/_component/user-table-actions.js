"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useUserTableFilters } from "./use-user-table-filters";

export default function UserTableActions() {
  const { resetFilters, searchQuery, setPage, setSearchQuery } =
    useUserTableFilters();

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
