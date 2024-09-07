"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import Context, { MainContext } from "@/store/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import Sidebar from "./sidebar";
import { useEffect } from "react";
import { ALLROUTES } from "@/data/sidebarData";

export default function Layout({ children }) {
  const pathname = usePathname();
  const { id } = useParams();
  const router = useRouter();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: true,
      },
    },
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const currentUser = JSON.parse(storedUser);
    if (pathname === "/login" || pathname === "/signup") {
      return;
    }
    const currentRoute = ALLROUTES?.find(
      (route) => route.path === pathname.replace(id, "[id]"),
    );

    if (!currentRoute || !currentRoute?.roles?.includes(currentUser?.role)) {
      router.replace("/unauthorized");
    }
  }, [pathname]);

  const getContent = () => {
    if (["/login", "/signup"].includes(pathname)) {
      return children;
    }

    return (
      <Context>
        <Sidebar>{children}</Sidebar>
      </Context>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      {getContent()}
    </QueryClientProvider>
  );
}
