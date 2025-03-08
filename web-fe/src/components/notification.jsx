"use client";
import { endpoints } from "@/utils/endpoints";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import useLocalStorage from "@/hooks/useLocalStorage";
import { Button } from "./ui/button";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Blockquote, Muted } from "./ui/typography";
import Link from "next/link";
import moment from "moment";
import http from "@/utils/http";

export default function Notification() {
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const socketRef = useRef();
  const [token] = useLocalStorage("token");
  let wsUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}${endpoints.notifications.getAll}?at=${token}`;

  const queryClient = useQueryClient();
  const { data: notifications } = useQuery({
    queryFn: async () => {
      const { data } = await http().get(
        endpoints.notifications.getAll + "/all",
      );
      return data;
    },
    queryKey: ["notifications", isOpen],
    enabled: isOpen,
  });

  useEffect(() => {
    socketRef.current = new ReconnectingWebSocket(wsUrl);

    socketRef.current.addEventListener("open", (event) => {
      console.log("WebSocket connected!", event);
    });

    socketRef.current.addEventListener("message", (event) => {
      const parsedData = JSON.parse(event.data);

      setNotificationsCount((prev) => prev + 1);
      queryClient.setQueryData([`notifications`], (oldChats = []) => {
        return [...oldChats, parsedData];
      });
    });

    socketRef.current.addEventListener("close", () => {
      console.log("Disconnected");
    });

    return () => {
      socketRef.current.close();
    };
  }, [token, wsUrl, queryClient]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative focus-visible:outline-0 focus-visible:ring-0"
        >
          <Bell className="h-5 w-5" />
          {notificationsCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {notificationsCount}
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
            {notifications?.length > 0 ? (
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
