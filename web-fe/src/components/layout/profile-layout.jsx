import Link from "next/link";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { CiLogout } from "react-icons/ci";
import { IoBagHandleOutline, IoCartOutline } from "react-icons/io5";
import { LiaUserEditSolid } from "react-icons/lia";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "../loading";
import { MainContext } from "@/store/context";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { rupee } from "@/lib/Intl";
import { Check } from "lucide-react";

export default function ProfileLayout({ children }) {
  const pathname = usePathname();
  const { user, setUser } = useContext(MainContext);
  const { data, isLoading } = useQuery({
    queryKey: ["points", user?.id],
    queryFn: fetchPoints,
    enabled: !!user,
  });

  async function fetchPoints() {
    const { data } = await http().get(endpoints.points.getAll);
    return data[0];
  }

  if (!user) return <Spinner />;

  return (
    <section className="py-10">
      <div className="container">
        <div className="space-y-2">
          <div className="flex items-center justify-end gap-2">
            {user?.channel_financing && (
              <>
                <Button
                  className={cn("border", {
                    "border-yellow-300 bg-yellow-100 text-yellow-500 hover:bg-yellow-100":
                      user?.channel_financing === "initiated",
                    "border-emerald-300 bg-emerald-100 text-emerald-500 hover:bg-emerald-100":
                      user?.channel_financing === "approved",
                  })}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>
                      {user?.channel_financing === "initiated"
                        ? "In processing"
                        : "Approved"}
                    </span>
                    {user?.channel_financing === "initiated" ? (
                      <Spinner color="text-yellow-500" />
                    ) : (
                      <Check size={20} className="text-emerald-500" />
                    )}
                  </div>
                </Button>
                <Button type="button" variant="outline">
                  <div className="inline-flex flex-col items-start justify-start text-xs">
                    <span>Credit limit:</span>
                    <span>
                      {user?.channel_financing === "initiated"
                        ? rupee.format(0)
                        : rupee.format(data?.points)}
                    </span>
                  </div>
                </Button>
              </>
            )}
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 md:col-span-4 lg:col-span-3">
              <div className="rounded-md bg-white p-4">
                <Sidebar {...user} setUser={setUser} pathname={pathname} />
              </div>
            </div>
            <div className="col-span-12 md:col-span-8 lg:col-span-9">
              <div className="rounded-md bg-white p-4">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Sidebar({ pathname, setUser }) {
  const router = useRouter();

  const tabs = [
    {
      title: "Enquiries",
      href: "enquiries",
      icon: <IoCartOutline size={18} />,
    },
    {
      title: "Orders",
      href: "orders",
      icon: <IoCartOutline size={18} />,
    },
    {
      title: "Details",
      href: "details",
      icon: <LiaUserEditSolid size={18} />,
    },
  ];

  return (
    <div className="">
      <ul className="divide-y overflow-hidden rounded border">
        {tabs.map(({ title, href, icon }) => (
          <li
            key={href}
            className={cn("text-sm hover:bg-primary hover:text-white", {
              "bg-primary text-white": pathname.includes(href),
            })}
          >
            <Link
              className="flex items-center justify-start gap-4 p-4"
              href={`/profile/${href}${href === "enquiries" ? "?status=pending_enquiry" : href === "orders" ? "?status=pending_orders" : ""}`}
            >
              <div>{icon}</div>
              <div>{title}</div>
            </Link>
          </li>
        ))}
        <li className="text-sm">
          <Button
            onClick={() => {
              localStorage.clear();
              setUser("");
              router.replace("/auth/login");
            }}
            className="flex w-full items-center justify-start gap-4 rounded-none bg-transparent px-4 py-6 text-sm text-black hover:bg-transparent"
          >
            <CiLogout />
            Logout
          </Button>
        </li>
      </ul>
    </div>
  );
}
