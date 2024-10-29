import { columns } from "./columns";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "@/components/ui/table/data-table";
import SubcatTableActions from "./_component/subcat-table-actions";
import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import SubCategoryListing from "./_component/subcat-listing";
import PageContainer from "@/components/layout/page-container";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Sub categories",
};

export default async function Page({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading
          title="Sub Categories"
          description="Manage sub categories (Create, Update, Delete)."
        />
        <Link
          className={buttonVariants({ variant: "primary" })}
          href={"/sub-categories/create"}
        >
          <Plus size={20} /> <span className="ml-1">Add new</span>
        </Link>
      </div>
      <SubcatTableActions />
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <SubCategoryListing />
      </Suspense>
    </PageContainer>
  );
}
