import React, { Suspense } from "react";
import TableActions from "./_component/table-actions";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import Listing from "./_component/listing";
import { searchParams, searchParamsCache, serialize } from "@/lib/searchparams";

export default async function MyStudentsPage() {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <div>
      <TableActions />
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <Listing />
      </Suspense>
    </div>
  );
}
