"use client";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useLocalStorage from "@/hooks/useLocalStorage";
import Loading from "@/components/loading";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Badge } from "./ui/badge";

export default function Chat({ tutorStudentMapId }) {
  const [name, setName] = useState("");
  const searchParams = useSearchParams();
  const socketRef = useRef();
  const chatContainerRef = useRef(null);
  const [token] = useLocalStorage("token");
  let wsUrl = `${process.env.NEXT_PUBLIC_SOCKET_URL}${endpoints.myStudents.getAll}/${tutorStudentMapId}/chat?at=${token}`;
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const fetchChats = async () => {
    const { data } = await http().get(
      `${endpoints.myStudents.getAll}/${tutorStudentMapId}/chats`,
    );
    setName(data?.name);
    return data.chats ?? [];
  };

  const { data: chats, isLoading: isChatsLoading } = useQuery({
    queryKey: [`fetchChats-${tutorStudentMapId}`, tutorStudentMapId],
    queryFn: fetchChats,
    enabled: !!tutorStudentMapId,
  });
  useEffect(() => {
    socketRef.current = new ReconnectingWebSocket(wsUrl);

    socketRef.current.addEventListener("open", (event) => {
      console.log("WebSocket connected!", event);
    });

    socketRef.current.addEventListener("message", (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.tutorStudentMapId === tutorStudentMapId) {
        queryClient.setQueryData(
          [`fetchChats-${tutorStudentMapId}`, tutorStudentMapId],
          (oldChats = []) => {
            return [...oldChats, parsedData];
          },
        );
      }
    });

    socketRef.current.addEventListener("close", () => {
      console.log("Disconnected");
    });

    return () => {
      socketRef.current.close();
    };
  }, [tutorStudentMapId, token, wsUrl, queryClient]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [chats]);

  const onSubmit = (data) => {
    const message = data.content;

    if (message.trim() === "" || /\d/.test(message)) {
      alert("Numbers are not allowed in the message.");
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        event: "message",
        content: message,
      }),
    );
    reset();
  };

  if (isChatsLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <Badge variant={"outline"} className={"p-4 py-2"}>
        <ChatBubbleIcon className="size-5" />{" "}
        <span className="ml-2">{name ?? searchParams.get("name")}</span>
      </Badge>
      <div className="flex items-center justify-center bg-gray-100">
        <Card className="w-full ">
          <CardHeader>
            <CardTitle>Chat</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={chatContainerRef}
              className="no-scrollbar h-[60vh] overflow-auto rounded-2xl bg-gray-100 p-4"
            >
              {chats?.map((m) => (
                <div
                  key={m.id}
                  className={`mb-4 ${m.admin ? "text-right" : "text-left"}`}
                >
                  <span
                    className={`inline-block rounded-lg p-2 text-sm ${
                      m.admin
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full space-x-2"
            >
              <Input
                placeholder="Type your message..."
                className="flex-grow"
                {...register("content", { required: "required*" })}
              />
              <Button type="submit" className="bg-gray-900 hover:bg-gray-800">
                <Send size={15} className="mr-1" /> Send
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
