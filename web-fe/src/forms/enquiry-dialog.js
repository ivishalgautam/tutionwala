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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Apple, CreditCard } from "lucide-react";
import { LiaPaypal } from "react-icons/lia";
const enquiry = async (id, searchParams = "") => {
  return await http().post(
    `${endpoints.enquiries.getAll}/${id}?${searchParams}`,
  );
};

export default function DialogEnquiryForm({ tutorId }) {
  const [mode, setMode] = useState(null);
  const [open, setOpen] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [isModal, setIsModal] = useState(false);
  const { user } = useContext(MainContext);
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ id }) => enquiry(id, `mode=${mode}`),
    onSuccess: (data) => {
      toast.success(data.message ?? "Enquiry submit.");
    },
    onError: (error) => {
      toast.error(error.message ?? "Error creating enquiry.");
    },
    onSettled: () => {
      setOpen(false);
      setMode(null);
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

    if (!mode) {
      setOpen(true);
      return open ? toast.warning("Select a mode!") : null;
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select mode you want to enquire for.</DialogTitle>
            <DialogDescription className="sr-only">
              Mode of th enquiry.
            </DialogDescription>

            <RadioGroup
              className="grid-cols-2"
              onValueChange={(value) => setMode(value)}
            >
              {/* online */}
              <div className="has-data-[state=checked]:border-ring shadow-xs relative flex cursor-pointer flex-col items-center gap-3 rounded-md border border-input px-2 py-3 text-center outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                <RadioGroupItem
                  id={"online"}
                  value="online"
                  className="sr-only"
                />
                <CreditCard
                  className="opacity-60"
                  size={20}
                  aria-hidden="true"
                />
                <label
                  htmlFor={"online"}
                  className="cursor-pointer text-xs font-medium leading-none text-foreground after:absolute after:inset-0"
                >
                  Online
                </label>
              </div>

              {/* offline */}
              <div className="has-data-[state=checked]:border-ring shadow-xs relative flex cursor-pointer flex-col items-center gap-3 rounded-md border border-input px-2 py-3 text-center outline-none transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50">
                <RadioGroupItem
                  id={"offline"}
                  value="offline"
                  className="sr-only"
                />
                <CreditCard
                  className="opacity-60"
                  size={20}
                  aria-hidden="true"
                />
                <label
                  htmlFor={"offline"}
                  className="cursor-pointer text-xs font-medium leading-none text-foreground after:absolute after:inset-0"
                >
                  Offline
                </label>
              </div>
            </RadioGroup>

            <Button disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Sending..." : "Enquire now"}
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
