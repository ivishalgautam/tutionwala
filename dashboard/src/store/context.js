"use client";
import { useEffect, createContext, useState } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { usePathname } from "next/navigation";
import Spinner from "@/components/Spinner";
import Loader from "@/components/loader";

export const MainContext = createContext(null);

export default function Context({ children }) {
  const [user, setUser] = useState();
  const [isUserLoading, setIsUserLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await http().get(endpoints.profile);
        setUser(response);
      } catch (error) {
        console.log(error);
      } finally {
        setIsUserLoading(false);
      }
    }

    fetchData();
  }, [pathname]);

  return (
    <MainContext.Provider
      value={{
        user,
        setUser,
        isUserLoading,
      }}
    >
      {!user || isUserLoading ? <Loader /> : children}
    </MainContext.Provider>
  );
}
