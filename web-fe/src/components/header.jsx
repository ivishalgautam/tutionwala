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

const CategoryMenu = dynamic(
  () => import("./category-menu").then((data) => data.CategoryMenu),
  {
    loading: () => <CategoryMenuLoader />,
  },
);

import Link from "next/link";
import { useContext, useState } from "react";
import { MainContext } from "@/store/context";
import { Button, buttonVariants } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { LucideLogOut, X } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import CategoryMenuLoader from "./loaders/category-menu";
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
                <figure className="aspect-video w-24">
                  <Image
                    src={"/images/logo.jpeg"}
                    width={200}
                    height={200}
                    alt="logo"
                    className="h-full w-full rounded-lg object-cover object-center"
                    priority={false}
                  />
                </figure>
              </Link>
              {/* {user?.role !== "tutor" && <CategoryMenu />} */}
            </div>
          </NavbarBrand>

          {user?.role !== "tutor" && (
            <NavbarList>
              <NavbarItem active={pathname === "/"}>
                <Link href={"/"}>Home</Link>
              </NavbarItem>

              <NavbarItem active={pathname === "/tutors"}>
                <Link href={"/tutors"}>Find Tutors</Link>
              </NavbarItem>

              <NavbarItem active={pathname === "/about"}>
                <Link href={"/about"}>About Us</Link>
              </NavbarItem>

              <NavbarItem active={pathname === "/contact"}>
                <Link href={"/contact"}>Contact Us</Link>
              </NavbarItem>
            </NavbarList>
          )}
          {isUserLoading ? (
            <Loader />
          ) : user ? (
            <NavbarList>
              {/* <Notification /> */}

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
          ) : (
            <NavbarList>
              <NavbarItem>
                <Link href={"/login"}>Login</Link>
              </NavbarItem>
              <NavbarItem active={true} onClick={() => setIsModal(true)}>
                Signup
              </NavbarItem>
            </NavbarList>
          )}
          <NavbarCollapseBtn />

          <NavbarCollapse className="overflow-auto">
            {isUserLoading ? (
              <Loader />
            ) : user ? (
              <>
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
                {user?.role !== "tutor" && (
                  <>
                    <NavbarItem active={pathname === "/"}>
                      <Link href={"/"}>Home</Link>
                    </NavbarItem>

                    <NavbarItem active={pathname === "/tutors"}>
                      <Link href={"/tutors"}>Tutors</Link>
                    </NavbarItem>

                    <NavbarItem active={pathname === "/about"}>
                      <Link href={"/about"}>About Us</Link>
                    </NavbarItem>

                    <NavbarItem active={pathname === "/contact"}>
                      <Link href={"/contact"}>Contact Us</Link>
                    </NavbarItem>
                  </>
                )}
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
