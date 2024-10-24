"use client";
import { DataTableSearch } from "@/components/ui/table/data-table-search";
import { useBoardsTableFilters } from "./use-boards-table-filters";

export default function BoardsTableActions() {
  const { resetFilters, searchQuery, setPage, setSearchQuery } =
    useBoardsTableFilters();

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
