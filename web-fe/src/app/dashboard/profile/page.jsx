"use client";
import Loading from "@/components/loading";
import Map from "@/components/map";
import { Button } from "@/components/ui/button";
import { getCurrentCoords } from "@/lib/get-current-coords";
import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [coordinates, setCoordinates] = useState([0, 0]);
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

  console.log(tutor);

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
    updateMutation.mutate({ coords: coordinates, id: tutor.id });
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
      <Map
        coordinates={coordinates}
        setCoordinates={setCoordinates}
        getCurrentLatLng={getCurrentLatLng}
        handleUpdate={handleUpdate}
      />
      <div className="text-end">
        <Button type="button" onClick={handleUpdateLocation}>
          Update location
        </Button>
      </div>
    </div>
  );
}
