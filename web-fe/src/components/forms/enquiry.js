"use client";
import React, { useContext } from "react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { MainContext } from "@/store/context";

const enquiry = async ({ id }) => {
  return await http().post(`${endpoints.enquiries.getAll}/${id}`);
};

export default function EnquiryForm({ tutorId }) {
  const { user } = useContext(MainContext);
  const { mutate, isLoading } = useMutation(enquiry, {
    onSuccess: (data) => {
      console.log({ data });
      toast.success(data.message ?? "Enquiry submit.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Error creating enquiry.");
    },
  });

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      return toast.warning("You are not logged in!");
    }

    mutate({ id: tutorId });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Button disabled={isLoading}>
        {isLoading ? "Sending..." : "Enquire now"}
      </Button>
    </form>
  );
}
