"use client";
import { useContext, useId, useState } from "react";
import { Button } from "../components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RiBankCardLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
const enquiry = async (id, searchParams = "") => {
  return await http().post(
    `${endpoints.enquiries.getAll}/${id}?${searchParams}`,
  );
};
export default function DialogEnquiryForm({
  tutorId,
  courses = [],
  boards,
  modes,
}) {
  const [mode, setMode] = useState(null);
  const [category, setCategory] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [phone, setPhone] = useState("");
  const [isModal, setIsModal] = useState(false);
  const { user } = useContext(MainContext);
  const { mutate, isLoading } = useMutation({
    mutationFn: ({ id }) =>
      enquiry(
        id,
        `mode=${mode}&category=${category}&subject=${encodeURIComponent(selectedSubjects.join(" "))}`,
      ),
    onSuccess: (data) => {
      toast.success(data.message ?? "Enquiry submit.");
      setMode("");
      setCategory("");
      setOpen(false);
      setSelectedSubjects([]);
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

    if (!category) {
      setOpen(true);
      return open ? toast.warning("Select a category!") : null;
    }

    mutate({ id: tutorId });
  };

  const handleSelectSubject = (subject, checked) => {
    setSelectedSubjects((prev) =>
      checked
        ? [...new Set([...prev, subject])]
        : prev.filter((item) => item !== subject),
    );
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

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setMode("");
          setCategory("");
          setOpen(value);
          setSelectedSubjects([]);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select category you want to enquire for.</DialogTitle>
            <DialogDescription className="sr-only">
              Mode of the enquiry.
            </DialogDescription>
            <div className="space-y-2">
              <div>
                <Label>Course</Label>
                <Select
                  onValueChange={(value) => {
                    setCategory(value);
                    setMode("");
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Select Course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses?.map(({ value, label }) => (
                      <SelectItem value={value} key={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-1.5">
                {boards[category]?.map((item) => (
                  <div className="flex items-center space-x-2" key={item}>
                    <label
                      htmlFor={item}
                      className="flex items-center justify-center gap-1 rounded-md border p-2 text-sm font-medium capitalize leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      <Checkbox
                        id={item}
                        onCheckedChange={(checked) =>
                          handleSelectSubject(item, checked)
                        }
                      />
                      {item}
                    </label>
                  </div>
                ))}
              </div>

              <RadioGroup
                className="grid-cols-3"
                defaultValue={mode}
                onValueChange={(mode) => setMode(mode)}
              >
                {modes[category]?.map((item) => (
                  <div
                    key={item}
                    className={cn(
                      "relative flex cursor-pointer flex-col items-center gap-3 rounded-md border border-input px-2 py-3 text-center outline-none transition-[color,box-shadow]",
                      {
                        "border-primary": mode === item,
                      },
                    )}
                  >
                    <RadioGroupItem
                      id={item}
                      value={item}
                      className="sr-only"
                    />
                    <RiBankCardLine
                      className="opacity-60"
                      size={20}
                      aria-hidden="true"
                    />
                    <label
                      htmlFor={item}
                      className="cursor-pointer text-xs font-medium capitalize leading-none text-foreground after:absolute after:inset-0"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </RadioGroup>

              <Button disabled={isLoading} onClick={handleSubmit}>
                {isLoading ? "Sending..." : "Enquire now"}
              </Button>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
