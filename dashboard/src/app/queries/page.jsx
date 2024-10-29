import { Suspense } from "react";
import QueriesTableActions from "./_component/queries-table-actions";
import { serialize, searchParamsCache } from "@/lib/searchparams";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { Heading } from "@/components/ui/heading";
import QueryListing from "./_component/query-listing";
import PageContainer from "@/components/layout/page-container";

export const metadata = {
  title: "Queries",
};

export default async function Queries({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <Heading
          title={"Queries"}
          description={"Manage queries (View, Delete)."}
        />
      </div>
      <QueriesTableActions />

      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <QueryListing />
      </Suspense>
    </PageContainer>
  );
}
