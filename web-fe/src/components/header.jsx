"use client";
import {
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarCollapseBtn,
  NavbarContainer,
  NavbarItem,
  NavbarList,
} from "keep-react";

import Link from "next/link";
import { useContext, useState } from "react";
import { MainContext } from "@/store/context";
import { Button, buttonVariants } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { LucideLogOut, X } from "lucide-react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import SignUpAs from "./sign-up-as";
import Notification from "./notification";
import { cn } from "@/lib/utils";

export default function NavbarComponent() {
  const { user, setUser, isUserLoading } = useContext(MainContext);
  const router = useRouter();
  const pathname = usePathname();
  const [isModal, setIsModal] = useState(false);

  return (
    <>
      <Navbar>
        <NavbarContainer>
          <NavbarBrand>
            <div className="flex items-center justify-start gap-8">
              <Link href={"/"} className={`text-3xl`}>
                {/* <figure className="aspect-video"> */}
                <Image
                  src={"/logo.png"}
                  width={200}
                  height={200}
                  alt="logo"
                  className="rounded-lg object-cover object-center"
                  priority={false}
                />
                {/* </figure> */}
              </Link>
            </div>
          </NavbarBrand>

          {user?.role !== "tutor" && <Navigation pathname={pathname} />}

          <div className="mr-2 flex items-center justify-end gap-3">
            {isUserLoading ? (
              <Loader />
            ) : user ? (
              <>
                <Notification />
                <NavbarList className="">
                  <Link
                    className={buttonVariants({ variant: "default" })}
                    href={"/dashboard/enquiries"}
                  >
                    Dashboard
                  </Link>
                  <Button
                    type="button"
                    onClick={() => {
                      localStorage.clear();
                      setUser("");
                      router.replace("/login");
                    }}
                    variant="outline"
                  >
                    <LucideLogOut size={15} />
                    &nbsp;Logout
                  </Button>
                </NavbarList>
              </>
            ) : (
              <NavbarList>
                <NavbarItem>
                  <Link href={"/login"}>Login</Link>
                </NavbarItem>
                <NavbarItem
                  active={true}
                  onClick={() => setIsModal(true)}
                  className="bg-primary"
                >
                  Signup
                </NavbarItem>
              </NavbarList>
            )}
            <NavbarCollapseBtn />
          </div>

          <NavbarCollapse className="overflow-auto">
            {isUserLoading ? (
              <Loader />
            ) : user ? (
              <>
                {user?.role !== "tutor" && <Navigation pathname={pathname} />}
                <Link
                  className={buttonVariants({ variant: "default" })}
                  href={"/dashboard/enquiries"}
                >
                  Dashboard
                </Link>
                <Button
                  type="button"
                  onClick={() => {
                    localStorage.clear();
                    setUser("");
                    router.replace("/login");
                  }}
                  variant="outline"
                >
                  <LucideLogOut size={15} />
                  &nbsp;Logout
                </Button>
              </>
            ) : (
              <>
                {user?.role !== "tutor" && <Navigation pathname={pathname} />}
                <NavbarItem>
                  <Link href={"/login"}>Login</Link>
                </NavbarItem>
                <NavbarItem active={true}>
                  <Link href={"/signup/tutor"}>Signup as Tutor</Link>
                </NavbarItem>
              </>
            )}
          </NavbarCollapse>
        </NavbarContainer>
      </Navbar>
      <AlertDialog open={isModal} onOpenChange={setIsModal}>
        <AlertDialogTrigger className="sr-only text-primary">
          Create one
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="relative">
            <AlertDialogTitle className="text-center uppercase">
              Sign up as?
            </AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
            <div className="flex w-full items-center justify-center gap-2">
              <AlertDialogCancel
                className={`absolute right-2 top-2 border-none p-0 ${buttonVariants({ size: "icon", variant: "ghost" })}`}
              >
                <X size={20} />
              </AlertDialogCancel>
              <div>
                <SignUpAs />
              </div>
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function Loader() {
  return (
    <NavbarList className="flex">
      <Button className="pointer-events-none w-24 animate-pulse bg-gray-200"></Button>
      <Button className="pointer-events-none w-24 animate-pulse bg-gray-200"></Button>
    </NavbarList>
  );
}

function Navigation({ pathname }) {
  return (
    <NavbarList>
      <NavbarItem
        active={pathname === "/"}
        className={cn("hover:bg-primary hover:text-white", {
          "bg-primary": pathname === "/",
        })}
      >
        <Link href={"/"}>Home</Link>
      </NavbarItem>

      <NavbarItem
        active={pathname === "/tutors"}
        className={cn("hover:bg-primary hover:text-white", {
          "bg-primary": pathname === "/tutors",
        })}
      >
        <Link href={"/tutors"}>Find Tutors</Link>
      </NavbarItem>

      <NavbarItem
        active={pathname === "/about"}
        className={cn("hover:bg-primary hover:text-white", {
          "bg-primary": pathname === "/about",
        })}
      >
        <Link href={"/about"}>About Us</Link>
      </NavbarItem>

      <NavbarItem
        active={pathname === "/contact"}
        className={cn("hover:bg-primary hover:text-white", {
          "bg-primary": pathname === "/contact",
        })}
      >
        <Link href={"/contact"}>Contact Us</Link>
      </NavbarItem>
    </NavbarList>
  );
}
