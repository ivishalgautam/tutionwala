"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useContext } from "react";

import { Muted, Small } from "@/components/ui/typography";

import { MainContext } from "@/store/context";
import { cn } from "@/lib/utils";

const tabs = [
  { value: "enquiries", label: "Enquiries", roles: ["student", "tutor"] },
  { value: "courses", label: "Courses", roles: ["tutor"] },
  { value: "profile", label: "Profile", roles: ["tutor", "student"] },
];

export default function DashboardLayout({ children }) {
  const { user, isUserLoading } = useContext(MainContext);

  console.log({ user });
  return (
    <div className="min-h-screen bg-gray-200 py-4">
      <div className="container grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <div className="overflow-hidden rounded bg-white shadow-sm">
            <div className="border-b-2 p-3">
              <Profile isUserLoading={isUserLoading} user={user} />
            </div>
            <ul className="space-y-[1px]">
              {tabs.map(
                (item, key) =>
                  item.roles.includes(user?.role) && (
                    <ListItem key={key} item={item} />
                  ),
              )}
            </ul>
          </div>
        </div>

        <div className="col-span-9">
          <div className="rounded bg-white p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const Profile = ({ isUserLoading, user }) => {
  return isUserLoading ? (
    "loading..."
  ) : (
    <div className="flex items-start justify-start gap-2">
      <figure className="size-20">
        <Image
          src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/${user?.profile_picture}`}
          width={100}
          height={100}
          alt={user?.fullname}
          className="h-full w-full rounded"
        />
      </figure>
      <div>
        <Small>{user?.fullname}</Small>
        <Muted className={"text-xs capitalize"}>{user?.role}</Muted>
      </div>
    </div>
  );
};

export const ListItem = ({ item }) => {
  const pathname = usePathname();
  const currTab = pathname.split("/dashboard/").pop();
  return (
    <li
      className={cn(
        "relative text-xs font-medium uppercase transition-all hover:bg-gray-100 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-1 hover:before:bg-primary",
        {
          "bg-gray-100 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary":
            currTab === item.value,
        },
      )}
    >
      <Link href={`/dashboard/${item.value}`} className="block p-3 px-6">
        {item.label}
      </Link>
    </li>
  );
};
