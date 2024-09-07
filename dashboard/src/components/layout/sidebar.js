"use client";
import React, { useContext, useState } from "react";
import { redirect, usePathname } from "next/navigation";
import { ALLROUTES } from "@/data/sidebarData";
import { MainContext } from "@/store/context";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { FaDumbbell } from "react-icons/fa";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export const logout = () => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
    localStorage.clear();
  }
  redirect("/login");
};

export default function SidebarLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user } = useContext(MainContext);
  const pathname = usePathname();

  const filteredMenu = ALLROUTES.filter(
    (item) =>
      !item.path.includes("edit") &&
      !item.path.includes("create") &&
      !item.path.includes("[id]"),
  );

  const sidebarData = filteredMenu.filter((item) =>
    item.roles.includes(user.role),
  );

  const isLinkActive = (link) => {
    if (link === "/") {
      return pathname === "/";
    }
    return pathname.includes(link);
  };

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 md:flex-row",
        "h-screen",
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden rounded-lg bg-white p-3">
            {/* {open ? <Logo /> : <LogoIcon />} */}
            <div className="flex items-center justify-center">
              <Logo />
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {sidebarData.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={{
                    label: link.title,
                    href: link.path,
                    icon: link.icon,
                  }}
                  className={cn("rounded-lg p-3 text-center", {
                    "bg-primary text-white": pathname === link.path,
                  })}
                />
              ))}
              <SidebarLink
                link={{
                  label: "Logout",
                  href: "/login",
                  icon: <LogOut />,
                }}
                className={"rounded-lg p-3"}
                onClick={() => {
                  localStorage.clear();
                }}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 overflow-hidden p-2 *:w-full">{children}</div>
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 font-grotesk text-sm font-normal text-black"
    >
      {/* <div className="h-5 w-6 flex-shrink-0 rounded-bl-sm rounded-br-lg rounded-tl-lg rounded-tr-sm bg-black dark:bg-white" /> */}

      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-pre font-grotesk text-xl font-extrabold text-black dark:text-white"
      >
        Tution
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center justify-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <FaDumbbell size={28} />
    </Link>
  );
};
