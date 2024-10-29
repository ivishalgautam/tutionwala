"use client";
import { useContext, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { allRoutes } from "@/data/routes";
import { MainContext } from "@/store/context";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
const Header = dynamic(() => import("../header"), {
  loading: () => <HeaderLoader />,
});
const Footer = dynamic(() => import("../footer").then((data) => data.Footer), {
  loading: () => <Loading />,
});
import dynamic from "next/dynamic";
import Loading from "../loading";
import HeaderLoader from "../loaders/header";
import Lenis from "lenis";
import FadeUp from "../fade-up";

export default function Layout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { slug } = useParams();
  const { user, isUserLoading } = useContext(MainContext);

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (
      pathname === "/login" ||
      pathname === "/signup" ||
      pathname === "/signup/tutor" ||
      pathname === "/signup/student" ||
      pathname === "/verify" ||
      pathname === "/complete-profile/tutor" ||
      pathname === "/complete-profile/student"
    ) {
      return;
    }
    if (isUserLoading) return;

    // Find the current route in the AllRoutes array
    const currentRoute = allRoutes?.find(
      (route) => route.link.replace("[slug]", slug) === pathname,
    );

    if (user?.role === "tutor") {
      async function getTutorDetails(id) {
        const { data } = await http().get(
          `${endpoints.tutor.getAll}/getByUser/${id}`,
        );
        if (!data.is_profile_completed) {
          return router.replace("/complete-profile/tutor");
        } else {
          if (currentRoute?.roles.includes("tutor")) return;
          if (pathname.includes("dashboard")) return;
          return router.replace("/dashboard/enquiries");
        }
      }
      getTutorDetails(user.id);
    }

    if (user?.role === "student") {
      async function getStudentDetails(id) {
        const { data } = await http().get(
          `${endpoints.student.getAll}/getByUser/${id}`,
        );
        if (!data.is_profile_completed)
          return router.replace("/complete-profile/student");
      }
      getStudentDetails(user.id);
    }

    // If the current route is not found in the array or the user's role is not allowed for this route
    if (
      currentRoute &&
      currentRoute?.roles?.length &&
      !currentRoute?.roles?.includes(user?.role)
    ) {
      localStorage.clear();
      router.replace("/login");
    }
  }, [pathname, user, isUserLoading, slug, router]);

  const getContent = () => {
    // Array of all the paths that don't need the layout
    if (
      [
        "/login",
        "/signup",
        "/signup/tutor",
        "/signup/student",
        "/unauthorized",
      ].includes(pathname)
    ) {
      return children;
    }

    return (
      <div className="h-full">
        <Header />
        <div className="min-h-screen">{children}</div>
        <FadeUp y={20}>
          <Footer />
        </FadeUp>
      </div>
    );
  };

  // if (isUserLoading) return <Spinner />;

  return <main className="min-h-screen bg-gray-100">{getContent()}</main>;
}
