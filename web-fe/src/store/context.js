"use client";
import { useEffect, createContext, useState } from "react";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { usePathname } from "next/navigation";
import Loading from "@/components/loading";

export const MainContext = createContext(null);

function Context({ children }) {
  const [user, setUser] = useState();
  const [isUserLoading, setIsUserLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    setIsUserLoading(true);
    async function fetchData() {
      await http()
        .get(endpoints.profile)
        .then((data) => {
          setUser(data);
          setIsUserLoading(false);
        })
        .catch((error) => {
          // console.log(error);
          setIsUserLoading(false);
        });
    }
    if (!["/login", "/signup/student", "/signup/tutor"].includes(pathname)) {
      fetchData();
    } else {
      setIsUserLoading(false);
    }
  }, [pathname]);

  if (isUserLoading) return <Loading />;

  return (
    <MainContext.Provider
      value={{
        user,
        setUser,
        isUserLoading,
      }}
    >
      {children}
    </MainContext.Provider>
  );
}

export default Context;
