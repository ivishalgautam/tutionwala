"use client";
import React, { Suspense, useContext } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { MainContext } from "@/store/context";
import { cn } from "@/lib/utils";
import AllEnquiries from "@/components/table/enquiries/main";
import TableActions from "../students/_component/table-actions";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import StudentsListing from "../students/_component/listing";
import TutorsListing from "../tutors/_component/listing";

export default function ChatsPage() {
  const { user } = useContext(MainContext);

  return (
    <Tabs defaultValue={"enquiries"} className="w-full">
      <TabsList className="w-full">
        <TabsTrigger value="enquiries" className={cn("w-1/2")}>
          <Link href={`?tab=enquiries`}>Enquiries</Link>
        </TabsTrigger>
        <TabsTrigger
          value={user.role === "tutor" ? "students" : "tutors"}
          className="w-1/2"
        >
          <Link href={user.role === "tutor" ? `?tab=students` : `?tab=tutors`}>
            {user.role === "tutor" ? "Students" : "Tutors"}
          </Link>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="enquiries">
        <AllEnquiries />
      </TabsContent>
      <TabsContent value={user.role === "tutor" ? "students" : "tutors"}>
        <div>
          <TableActions />
          <Suspense
            key={"287"}
            fallback={<DataTableSkeleton columnCount={4} rowCount={10} />}
          >
            {user.role === "tutor" ? <StudentsListing /> : <TutorsListing />}
          </Suspense>
        </div>
      </TabsContent>
    </Tabs>
  );
}
