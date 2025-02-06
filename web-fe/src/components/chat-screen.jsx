import Image from "next/image";
import React from "react";
import moment from "moment";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";

export default function ChatScreen({
  chatsLoading,
  chats,
  onMessage,
  messageInput,
  setMessageInput,
  user,
  messagesEndRef,
}) {
  return (
    <div className="flex gap-4">
      <div className="w-full rounded-xl bg-white">
        <div className="flex items-center gap-6 rounded-xl bg-primary px-8 py-2 text-white">
          {/* <Image src={Community} alt="coummunity" className="w-20" /> */}
        </div>
        <div className="relative h-96">
          <ScrollArea className="h-[80%]">
            <div className="space-y-2 p-4">
              {chatsLoading ? (
                <div className="flex justify-center">Loading...</div>
              ) : chats?.length === 0 ? (
                <p className="text-center">No chats</p>
              ) : (
                <ul className="messages space-y-2">
                  {chats?.map((chat, index) => (
                    <li
                      key={index}
                      className={`flex items-start justify-start gap-2 ${
                        user?.id !== chat?.message_from_id
                          ? ""
                          : "flex-row-reverse"
                      }`}
                    >
                      <Image
                        width={100}
                        height={100}
                        src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${chat?.image_url}`}
                        alt={chat?.message_from_fullname}
                        className="h-10 w-10 rounded-full"
                      />
                      <div
                        key={index}
                        className={`rounded-lg p-[0.7rem] shadow-md ${
                          chat?.role === "teacher"
                            ? "bg-emerald-500 text-white"
                            : user?.id !== chat?.message_from_id
                              ? ""
                              : "bg-primary text-white"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-10 capitalize">
                          <h3 className="text-xs font-bold">
                            ~{chat?.message_from_fullname}
                          </h3>
                          <p className="text-xs">{chat?.role}</p>
                        </div>
                        <p className="text-[12px]">{chat?.message}</p>
                        <span
                          className={`text-[10px] ${
                            chat?.role === "teacher"
                              ? "text-white"
                              : user?.id !== chat?.message_from_id
                                ? "text-gray-400"
                                : "text-white"
                          } font-semibold`}
                        >
                          {moment(chat?.created_at)
                            .startOf("minute")
                            .format("DD/MM/YY HH:mm A")}
                        </span>
                      </div>
                    </li>
                  ))}
                  <li ref={messagesEndRef} />
                </ul>
              )}
            </div>
          </ScrollArea>
          <form
            className="absolute bottom-4 flex w-full items-center gap-4 p-4"
            onSubmit={(e) => onMessage(e, messageInput)}
          >
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Type your message?..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                className="inline-block w-full flex-1 rounded-full border border-gray-300 p-4 outline-none"
              />
              <Button
                type="submit"
                className="absolute right-2.5 top-1/2 block -translate-y-1/2 rounded-full bg-primary p-2 text-white"
              >
                <Send size={25} />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
