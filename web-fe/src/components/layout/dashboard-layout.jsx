"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

import { Muted, Small } from "@/components/ui/typography";

import { MainContext } from "@/store/context";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { AlignLeft, ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";

const tabs = [
  { value: "students", label: "Students", roles: ["tutor"] },
  { value: "tutors", label: "Tutors", roles: ["student"] },
  { value: "enquiries", label: "Enquiries", roles: ["student", "tutor"] },
  { value: "courses", label: "Courses", roles: ["tutor"] },
  { value: "profile", label: "Profile", roles: ["tutor", "student"] },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-200 py-4">
      <div className="container grid grid-cols-12 gap-4">
        <div className="lg:col-span-3">
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>

        <div className="col-span-12 space-y-3 lg:col-span-9 lg:space-y-0">
          <div className="lg:hidden">
            <SideSheet>
              <Sidebar />
            </SideSheet>
          </div>
          <Button type="button" className="!mb-2" onClick={() => router.back()}>
            <ChevronLeft size={20} />
            Back
          </Button>
          <div className="rounded bg-white p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const Profile = ({ isUserLoading, user }) => {
  const [imageError, setImageError] = useState(false);
  useEffect(() => {
    if (imageError) {
      setImageError(true);
    }
  }, [imageError]);

  return isUserLoading ? (
    "loading..."
  ) : (
    <div className="flex items-start justify-start gap-2">
      <figure className="size-20">
        <Image
          src={
            imageError || !user?.profile_picture
              ? "/images/not-found.png"
              : user?.profile_picture
          }
          width={100}
          height={100}
          alt={user?.fullname}
          className="h-full w-full rounded object-cover object-center"
          onError={() => setImageError(true)}
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
        "relative text-start text-xs font-medium uppercase transition-all hover:bg-gray-100 hover:before:absolute hover:before:left-0 hover:before:top-0 hover:before:h-full hover:before:w-1 hover:before:bg-primary",
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

export const Sidebar = () => {
  const { user, isUserLoading } = useContext(MainContext);

  return (
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
  );
};

export const SideSheet = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger className="rounded bg-white p-2">
        <AlignLeft size={20} />
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="sr-only">Mobile sidebar</SheetTitle>
          <SheetDescription className="sr-only">
            Mobile sidebar
          </SheetDescription>
          {children}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
