"use client";
import { useContext, useState } from "react";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { MainContext } from "@/store/context";
import Modal from "../components/Modal";
import LoginForm from "./login";
import OTPForm from "./otp";

const enquiry = async ({ id }) => {
  return await http().post(`${endpoints.enquiries.getAll}/${id}`);
};

export default function EnquiryForm({ tutorId }) {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [isModal, setIsModal] = useState(false);
  const { user } = useContext(MainContext);
  const { mutate, isLoading } = useMutation(enquiry, {
    onSuccess: (data) => {
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
      toast.warning("Please Login First!");
      setIsModal(true);
      return;
    }

    mutate({ id: tutorId });
  };

  return (
    <>
      <Button disabled={isLoading} onClick={handleSubmit}>
        {isLoading ? "Sending..." : "Enquire now"}
      </Button>
      <Modal isOpen={isModal} onClose={() => setIsModal(false)}>
        {!isOtpSent ? (
          <LoginForm setIsOtpSent={setIsOtpSent} setPhone={setPhone} />
        ) : (
          <OTPForm phone={phone} />
        )}
      </Modal>
    </>
  );
}
