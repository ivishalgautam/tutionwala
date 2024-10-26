import BoardsTableActions from "./_component/board-table-actions";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import Link from "next/link";
import { cn } from "@/lib/utils";
import BoardListing from "./_component/board-listing";
import { buttonVariants } from "@/components/ui/button";
import PageContainer from "@/components/layout/page-container";
import { Plus } from "lucide-react";

export default async function Page({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading title="Boards" description="Manage boards and subjects" />
        <Link
          className={cn(buttonVariants({ variant: "primary" }))}
          href={"/boards/create"}
        >
          <Plus size={20} />
          <span className="ml-1">Add new</span>
        </Link>
      </div>
      <BoardsTableActions />
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <BoardListing />
      </Suspense>
    </PageContainer>
  );
}
