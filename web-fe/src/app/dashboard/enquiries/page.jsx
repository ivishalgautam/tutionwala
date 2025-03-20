"use client";
import { useContext } from "react";

import { MainContext } from "@/store/context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import FollowUps from "@/components/tutor-follow-ups";
import { cn } from "@/lib/utils";
import AllEnquiries from "@/components/table/enquiries/main";

export default function Page() {
  const { user } = useContext(MainContext);
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "enquiries";

  return (
    <>
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger
            value="enquiries"
            className={cn("w-full", { "w-1/2": user?.role == "tutor" })}
          >
            <Link href={`?tab=enquiries`}>Enquiries</Link>
          </TabsTrigger>
          {user?.role == "tutor" && (
            <TabsTrigger value="follow-ups" className="w-1/2">
              <Link href={`?tab=follow-ups`}>Follow Ups</Link>
            </TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="enquiries">
          <AllEnquiries />
        </TabsContent>
        {user?.role == "tutor" && (
          <TabsContent value="follow-ups">
            <FollowUps />
          </TabsContent>
        )}
      </Tabs>
    </>
  );
}
