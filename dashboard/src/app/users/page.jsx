import { Suspense } from "react";
import UserTableActions from "./_component/user-table-actions";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import UserListing from "./_component/user-listing";
import { searchParamsCache, serialize } from "@/lib/searchparams";
import { Heading } from "@/components/ui/heading";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageContainer from "@/components/layout/page-container";
import { Plus } from "lucide-react";

export const metadata = {
  title: "Users",
};

export default async function Users({ searchParams }) {
  searchParamsCache.parse(searchParams);
  const key = serialize({ ...searchParams });

  return (
    <PageContainer>
      <div className="flex items-start justify-between">
        <Heading title="Users" description="Manage users" />
        <NavigateDropdown />
      </div>
      <UserTableActions />
      <Suspense
        key={key}
        fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
      >
        <UserListing />
      </Suspense>
    </PageContainer>
  );
}

function NavigateDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="primary" className="">
          <Plus size={20} />
          <span className="ml-1">Add new</span>
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
