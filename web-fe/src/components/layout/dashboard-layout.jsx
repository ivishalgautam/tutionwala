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
import { Button, buttonVariants } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Warning } from "phosphor-react";
import { Progress } from "../ui/progress";

const tabs = [
  { value: "students", label: "Students", roles: ["tutor"] },
  { value: "tutors", label: "Tutors", roles: ["student"] },
  { value: "enquiries", label: "Enquiries", roles: ["student", "tutor"] },
  { value: "courses", label: "Courses", roles: ["tutor"] },
  { value: "profile", label: "Profile", roles: ["tutor", "student"] },
  { value: "chats", label: "Chats", roles: ["tutor", "student"] },
];

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { user } = useContext(MainContext);

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

          {!user.is_aadhaar_verified && (
            <Alert variant="destructive" className="!mb-2 bg-white">
              <Warning className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>
                  Your KYC is not completed. Please complete your KYC.
                </span>
                <Link
                  href={"/aadhaar-kyc"}
                  className={`h-6 ${buttonVariants({ variant: "destructive" })}`}
                >
                  Complete
                </Link>
              </AlertDescription>
            </Alert>
          )}
          {!user.is_email_verified && (
            <Alert variant="destructive" className="!mb-2 bg-white">
              <AlertDescription className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-3">
                  <Warning className="h-4 w-4" />
                  <span>
                    Your Email is not verified. Please verify your email.
                  </span>
                </div>
                <Link
                  href={"/email-verification"}
                  className={`h-6 ${buttonVariants({ variant: "destructive" })}`}
                >
                  Verify
                </Link>
              </AlertDescription>
            </Alert>
          )}

          <div className="rounded bg-white p-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const Profile = ({ isUserLoading, user }) => {
  console.log({ user });
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
          alt={user?.fullname ?? ""}
          className="h-full w-full rounded object-cover object-center"
          onError={() => setImageError(true)}
        />
      </figure>
      <div>
        <Small>
          {user?.tutor_type === "institute"
            ? user.institute_name
            : user?.fullname}
        </Small>
        <Muted className={"text-xs capitalize"}>
          {user?.tutor_type === "institute" ? "Institute" : user?.role}
        </Muted>
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
  const is_aadhaar_verified = user.is_aadhaar_verified;
  const is_email_verified = user.is_email_verified;
  const completed = 3 + is_aadhaar_verified + is_email_verified;
  const progress = (completed / 5) * 100;

  console.log({ progress });

  return (
    <div className="overflow-hidden rounded bg-white shadow-sm">
      <div className="border-b-2 p-3">
        <Profile isUserLoading={isUserLoading} user={user} />
        <div className="mt-2">
          <div
            className={"mt-0.5 text-end text-[10px] text-xs text-gray-400"}
          >{`${progress}% Completed`}</div>
          <Progress value={progress} className="h-2 bg-gray-300" />
        </div>
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
