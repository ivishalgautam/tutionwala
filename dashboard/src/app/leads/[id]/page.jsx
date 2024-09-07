"use client";

import FollowUps from "@/components/follow-ups";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H2, H3, H4, P } from "@/components/ui/typography";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";
import { LocateIcon, Mail, Phone, Timer, User, UserSearch } from "lucide-react";
import moment from "moment";
import Link from "next/link";

const fetchLead = async (id) => {
  const { data } = await http().get(`${endpoints.leads.getAll}/${id}`);
  return data;
};

export default function Page({ params: { id } }) {
  const { data: lead } = useQuery({
    queryKey: [`lead-${id}`],
    queryFn: () => fetchLead(id),
    enabled: !!id,
  });

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 h-auto md:col-span-5 lg:col-span-4 xl:col-span-3">
        <div className="space-y-4 rounded-lg border bg-white p-6 shadow">
          <div className="flex items-center justify-start gap-4">
            <Avatar>
              <AvatarImage src={lead?.avatar} alt={lead?.fullname} />
              <AvatarFallback className="uppercase">
                {lead?.fullname?.charAt(0) +
                  lead?.fullname.split(" ")[1].charAt(0)}
              </AvatarFallback>
            </Avatar>
            <H4>{lead?.fullname}</H4>
          </div>

          <div>
            <H2>Details</H2>
          </div>

          <div className="space-y-4 text-gray-500">
            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-1 text-primary">
                <User size={20} />
              </span>
              <span className="col-span-4 font-medium">Fullname:</span>
              <span className="col-span-6 capitalize">{lead?.fullname}</span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-1 text-primary">
                <Mail size={20} />
              </span>
              <span className="col-span-4 font-medium">Email:</span>
              <span className="col-span-6">{lead?.email}</span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-1 text-primary">
                <Phone size={20} />
              </span>
              <span className="col-span-4 font-medium">Phone:</span>
              <span className="col-span-6">{lead?.mobile_number}</span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-1 text-primary">
                <LocateIcon size={20} />
              </span>
              <span className="col-span-4 font-medium">Location:</span>
              <span className="col-span-6 capitalize">{lead?.location}</span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-1 text-primary">
                <UserSearch size={20} />
              </span>
              <span className="col-span-4 font-medium">Source:</span>
              <span className="col-span-6 capitalize">{lead?.source}</span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-1 text-primary">
                <UserSearch size={20} />
              </span>
              <span className="col-span-4 font-medium">Status:</span>
              <span className="col-span-6 capitalize">
                <Badge>
                  {lead?.is_converted_to_member ? "Member" : "Follow up"}
                </Badge>
              </span>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <span className="col-span-1 text-primary">
                <Timer size={20} />
              </span>
              <span className="col-span-4 font-medium">Created At:</span>
              <span className="col-span-6 capitalize">
                {moment(lead?.created_at).format("DD/MM/YYYY")}
              </span>
            </div>
          </div>

          <div>
            {lead?.is_converted_to_member ? (
              <Button className="w-full cursor-not-allowed bg-gray-300 hover:bg-gray-300">
                Coverted to member
              </Button>
            ) : (
              <Link
                href={`${id}/convert-to-member`}
                variant="primary"
                className={`w-full ${buttonVariants("primary")}`}
              >
                Convert to member
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-12 overflow-y-scroll rounded-lg pt-0 md:col-span-7 lg:col-span-8 xl:col-span-9">
        <Tabs defaultValue="follow-ups" className="">
          <div className="sticky top-0 z-50 pt-6">
            <TabsList className="w-full rounded-lg bg-white">
              {["follow-ups", "notes", "tasks", "documents"].map((tab, idx) => (
                <TabsTrigger
                  key={idx}
                  className="flex flex-1 rounded-md capitalize"
                  value={tab}
                >
                  {tab.split("-").join(" ")}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          <TabsContent value="follow-ups" className="mt-6">
            <FollowUps leadId={id} />
          </TabsContent>
          <TabsContent value="notes">Notes.</TabsContent>
          <TabsContent value="tasks">tasks.</TabsContent>
          <TabsContent value="documents">Documents.</TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
