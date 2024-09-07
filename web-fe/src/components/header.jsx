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
import { useRouter } from "next/navigation";
import { LucideLogOut } from "lucide-react";
import Image from "next/image";

export default function NavbarComponent() {
  const { user, setUser, isUserLoading } = useContext(MainContext);
  const router = useRouter();

  return (
    <Navbar>
      <NavbarContainer>
        <NavbarBrand>
          <div className="flex items-center justify-start gap-8">
            <Link href={"/"} className={`text-3xl`}>
              <figure className="aspect-video w-24">
                <Image
                  src={"/images/logo.png"}
                  width={200}
                  height={200}
                  alt="logo"
                  className="rounded-lg"
                />
              </figure>
            </Link>
            <div>
              <CategoryMenu />
            </div>
          </div>
          {/* <Image src={KeepLogo} alt="keep" width="88" height="40" /> */}
        </NavbarBrand>
        {/* <NavbarList>
          <NavbarItem active={true}>Home</NavbarItem>
          <NavbarItem>Research</NavbarItem>
          <NavbarItem>Contact</NavbarItem>
        </NavbarList> */}
        {isUserLoading ? (
          <Loader />
        ) : user ? (
          <NavbarList>
            <Link
              className={buttonVariants({ variant: "default" })}
              href={"/dashboard"}
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
          <NavbarItem>
            <Link href={"/login"}>Login</Link>
          </NavbarItem>
          <NavbarItem active={true}>
            <Link href={"/signup/tutor"}>Signup as Tutor</Link>
          </NavbarItem>
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
