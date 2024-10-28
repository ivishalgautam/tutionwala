"use client";
import PersonalInfoForm from "@/forms/personal-info";
import TutorProfileForm from "@/forms/tutor-profile";
import Loading from "@/components/loading";
import Map from "@/components/map";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentCoords } from "@/lib/get-current-coords";
import { MainContext } from "@/store/context";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const subTabs = [
  {
    label: "Personal Information",
    href: "?tab=details&stab=personal-information",
    roles: ["tutor", "student"],
  },
  {
    label: "Tutor Profile",
    href: "?tab=details&stab=tutor-profile",
    roles: ["tutor"],
  },
  // {
  //   label: "Address",
  //   href: "/dashboard/profile?tab=address",
  // },
];

export default function Page() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") ?? "details";
  const stab = searchParams.get("stab");
  const [coordinates, setCoordinates] = useState([0, 0]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const { user, setUser } = useContext(MainContext);
  const getCurrentLatLng = async () => {
    try {
      const coords = await getCurrentCoords();
      setCoordinates(coords);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const {
    data: tutor,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["tutotDetails"],
    queryFn: async () => {
      const { data } = await http().get(
        `${endpoints.tutor.getAll}/getTutorDetail`,
      );
      return data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      return await http().put(`${endpoints.tutor.getAll}/${tutor.id}`, data);
    },
    onSuccess: () => {
      toast.success("Updated.");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Error updating!");
    },
  });

  const handleUpdate = (data) => {
    updateMutation.mutate(data);
  };

  const handleUpdateLocation = () => {
    updateMutation.mutate({
      coords: coordinates,
      id: tutor.id,
      location: selectedPlace,
    });
  };
  useEffect(() => {
    if (tutor) {
      setCoordinates(tutor.coords);
    }
  }, [tutor]);

  if (isLoading) return <Loading />;
  if (isError) return error.message ?? "error";

  return (
    <div>
      <Tabs defaultValue={tab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="details" className="w-1/2">
            <Link href={`?tab=details`}>Details</Link>
          </TabsTrigger>
          <TabsTrigger value="address" className="w-1/2">
            <Link href={`?tab=address`}>Address</Link>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          {stab ? (
            stab === "personal-information" ? (
              <PersonalInfoForm user={user} setUser={setUser} />
            ) : (
              <TutorProfileForm user={user} setUser={setUser} />
            )
          ) : (
            <div className="space-y-2">
              {subTabs
                .filter((ele) => ele.roles.includes(user?.role))
                .map((tab, ind) => (
                  <div
                    key={tab.label}
                    className="flex items-center justify-between rounded border p-4 text-sm font-medium"
                  >
                    <Link href={tab.href} className="flex-shrink-0 flex-grow">
                      {ind + 1}.&nbsp;{tab.label}
                    </Link>
                    <ChevronRight />
                  </div>
                ))}
            </div>
          )}
        </TabsContent>
        <TabsContent value="address">
          <Map
            coordinates={coordinates}
            setCoordinates={setCoordinates}
            getCurrentLatLng={getCurrentLatLng}
            handleUpdate={handleUpdate}
            setSelectedPlace={setSelectedPlace}
          />
          <div className="text-end">
            <Button type="button" onClick={handleUpdateLocation}>
              Update location
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
