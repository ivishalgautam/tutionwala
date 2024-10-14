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

import { CategoryMenu } from "./category-menu";
import Link from "next/link";
import { useContext } from "react";
import { MainContext } from "@/store/context";
import { Button, buttonVariants } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { LucideLogOut } from "lucide-react";
import Image from "next/image";

export default function NavbarComponent() {
  const { user, setUser, isUserLoading } = useContext(MainContext);
  const router = useRouter();
  const pathname = usePathname();

  return (
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
                />
              </figure>
            </Link>
            <div>{user?.role !== "tutor" && <CategoryMenu />}</div>
          </div>
        </NavbarBrand>
        {user?.role !== "tutor" && (
          <NavbarList>
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
          </NavbarList>
        )}
        {isUserLoading ? (
          <Loader />
        ) : user ? (
          <NavbarList>
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
            <NavbarItem active={true}>
              <Link href={"/signup/tutor"}>Signup as Tutor</Link>
            </NavbarItem>
          </NavbarList>
        )}
        <NavbarCollapseBtn />
        <NavbarCollapse>
          {/* <NavbarItem>Projects</NavbarItem>
          <NavbarItem>Research</NavbarItem>
          <NavbarItem>Contact</NavbarItem> */}
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
