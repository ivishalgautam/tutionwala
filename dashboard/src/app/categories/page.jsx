import { Suspense } from "react";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CategoryTableActions from "./_component/category-table-actions";
import CategoryListing from "./_component/category-listing";
import PageContainer from "@/components/layout/page-container";
import { Plus } from "lucide-react";

export default async function Users({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading title="Categories" description="Manage categories" />
        <Link
          className={cn(buttonVariants({ variant: "primary" }))}
          href={"categories/create"}
        >
          <Plus size={20} /> <span className="ml-1">Add new</span>
        </Link>
      </div>
      <CategoryTableActions />
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <CategoryListing />
      </Suspense>
    </PageContainer>
  );
}

function NavigateDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="">
          <DotsVerticalIcon className="h-3 w-3" />
          <span className="ml-1">Create</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <Link href={"/users/create/student"}>Student</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link href={"/users/create/tutor"}>Tutor</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
