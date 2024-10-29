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
import { useContext } from "react";
import { MainContext } from "@/store/context";
import { Button, buttonVariants } from "./ui/button";
import { usePathname, useRouter } from "next/navigation";
import { LucideLogOut } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import CategoryMenuLoader from "./loaders/category-menu";
import FadeUp from "./fade-up";

export default function NavbarComponent() {
  const { user, setUser, isUserLoading } = useContext(MainContext);
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Navbar>
      <NavbarContainer>
        <NavbarBrand>
          <div className="flex items-center justify-start gap-8">
            <FadeUp x={-100} rotate={-45} delay={0.6} duration={1}>
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
            </FadeUp>
            <FadeUp x={-100} delay={0.5}>
              <div>{user?.role !== "tutor" && <CategoryMenu />}</div>
            </FadeUp>
          </div>
        </NavbarBrand>
        {user?.role !== "tutor" && (
          <NavbarList>
            <FadeUp delay={0.1} y={-15}>
              <NavbarItem active={pathname === "/"}>
                <Link href={"/"}>Home</Link>
              </NavbarItem>
            </FadeUp>

            <FadeUp delay={0.2} y={-15}>
              <NavbarItem active={pathname === "/tutors"}>
                <Link href={"/tutors"}>Tutors</Link>
              </NavbarItem>
            </FadeUp>

            <FadeUp delay={0.3} y={-15}>
              <NavbarItem active={pathname === "/about"}>
                <Link href={"/about"}>About Us</Link>
              </NavbarItem>
            </FadeUp>

            <FadeUp delay={0.4} y={-15}>
              <NavbarItem active={pathname === "/contact"}>
                <Link href={"/contact"}>Contact Us</Link>
              </NavbarItem>
            </FadeUp>
          </NavbarList>
        )}
        <FadeUp x={100} delay={0.5}>
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
        </FadeUp>
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
                  <FadeUp delay={0.1} y={15}>
                    <NavbarItem active={pathname === "/"}>
                      <Link href={"/"}>Home</Link>
                    </NavbarItem>
                  </FadeUp>

                  <FadeUp delay={0.2} y={15}>
                    <NavbarItem active={pathname === "/tutors"}>
                      <Link href={"/tutors"}>Tutors</Link>
                    </NavbarItem>
                  </FadeUp>

                  <FadeUp delay={0.3} y={15}>
                    <NavbarItem active={pathname === "/about"}>
                      <Link href={"/about"}>About Us</Link>
                    </NavbarItem>
                  </FadeUp>

                  <FadeUp delay={0.4} y={15}>
                    <NavbarItem active={pathname === "/contact"}>
                      <Link href={"/contact"}>Contact Us</Link>
                    </NavbarItem>
                  </FadeUp>
                </>
              )}
              <FadeUp delay={0.5} y={15}>
                <NavbarItem>
                  <Link href={"/login"}>Login</Link>
                </NavbarItem>
              </FadeUp>
              <FadeUp delay={0.6} y={15}>
                <NavbarItem active={true}>
                  <Link href={"/signup/tutor"}>Signup as Tutor</Link>
                </NavbarItem>
              </FadeUp>
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
