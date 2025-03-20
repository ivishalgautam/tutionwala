"use client";
import { endpoints } from "@/utils/endpoints";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Muted } from "./ui/typography";
import Link from "next/link";
import moment from "moment";
import http from "@/utils/http";
import Loading from "./loading";
import { Skeleton } from "./ui/skeleton";

export default function Notification() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: notifications,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      const { data } = await http().get(
        endpoints.notifications.getAll + "/all",
      );
      return data;
    },
    queryKey: ["notifications"],
  });

  if (isLoading) return <Skeleton className={"size-10"} />;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative focus-visible:outline-0 focus-visible:ring-0"
        >
          <Bell className="h-5 w-5" />
          {notifications.length > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notifications.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <Card className="border-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 px-4 py-2">
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-auto px-0 py-0">
            {isError ? (
              (error?.message ?? "Error loading notifications.")
            ) : notifications?.length > 0 ? (
              <div>
                {notifications?.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`flex cursor-pointer flex-col items-start px-4 py-3 ${
                      !notification.read ? "bg-muted/50" : ""
                    }`}
                  >
                    <Link
                      href={
                        notification.type === "enquiry"
                          ? `/dashboard/enquiries`
                          : notification.type === "chat"
                            ? `/dashboard/tutor-student-chats/${notification.chat_id}`
                            : notification.type === "enquiry_chat"
                              ? `/dashboard/enquiries/${notification.enquiry_id}/chat`
                              : "#"
                      }
                      className="w-full"
                    >
                      <div className="flex w-full items-start gap-2">
                        <div className="relative flex-1">
                          <p className="text-sm font-medium leading-none">
                            {notification.type === "enquiry" ? "Enquiry" : ""}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {notification.message}
                          </p>
                          <Muted className="absolute right-0 top-0 text-[10px] text-gray-400">
                            {moment(notification.createdAt).format(
                              "DD MMM YY, HH:mm",
                            )}
                          </Muted>
                        </div>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-center text-muted-foreground">
                No notifications
              </div>
            )}
          </CardContent>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
