"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { H2 } from "../components/ui/typography";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const feedbackSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  address: z.string().min(1, "Address is required"),
  phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

const createQuery = async (data) => {
  return await http().post(endpoints.feedbacks.getAll, data);
};

function countWords(str) {
  return str.trim().split(/\s+/).length;
}

export default function FeedbackForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm({ resolver: zodResolver(feedbackSchema) });

  const createMutation = useMutation(createQuery, {
    onSuccess: (data) => {
      toast.success(data.message);
      reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (data) => {
    createMutation.mutate(data);
  };

  const className = "bg-gray-50 text-black";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <H2 className={"border-none text-black"}>Feedback</H2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* name */}
        <div>
          <Input
            type="text"
            placeholder="Name"
            {...register("name", {
              required: "required",
            })}
            className={className}
          />
          {errors.name && (
            <p className="text-start text-sm text-red-500">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* email */}
        <div>
          <Input
            type="text"
            placeholder="Email"
            {...register("email", {
              required: "required",
            })}
            className={className}
          />
          {errors.email && (
            <p className="text-start text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* address */}
        <div>
          <Input
            type="text"
            placeholder="Address"
            {...register("address", {
              required: "required",
            })}
            className={className}
          />
          {errors.address && (
            <p className="text-start text-sm text-red-500">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* phone */}
        <div>
          <Input
            type="number"
            placeholder="Phone"
            {...register("phone", {
              required: "required",
              min: 10,
            })}
            className={className}
          />
          {errors.phone && (
            <p className="text-start text-sm text-red-500">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* subject */}
        <div className="md:col-span-2">
          <Input
            type="text"
            placeholder="Subject"
            {...register("subject", {
              required: "required",
            })}
            className={className}
          />
          {errors.subject && (
            <p className="text-start text-sm text-red-500">
              {errors.subject.message}
            </p>
          )}
        </div>

        {/* message */}
        <div className="md:col-span-2">
          <Textarea
            placeholder="Message"
            {...register("message", {
              required: "required",
              validate: (value) => {
                if (countWords(value) > 240) {
                  return "Message must be less than 240 words.";
                }
              },
            })}
            className={cn(`min-h-[200px] outline-none ring-0`, className)}
          />
          {errors.message && (
            <p className="text-start text-sm text-red-500">
              {errors.message.message}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Button className="w-full">Submit</Button>
      </div>
    </form>
  );
}
