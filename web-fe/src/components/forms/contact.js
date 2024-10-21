"use client";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { H2 } from "../ui/typography";
import { cn } from "@/lib/utils";

const createQuery = async (data) => {
  return await http().post(endpoints.queries.getAll, data);
};

export default function ContactForm() {
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm();

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

  const className =
    "border-primary focus-visible:border-white/40 bg-black/10 text-white placeholder:text-white";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <H2 className={"border-none text-white"}>Contact Us</H2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            <span className="text-red-600">{errors.name.message}</span>
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
            <span className="text-red-600">{errors.email.message}</span>
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
            <span className="text-red-600">{errors.address.message}</span>
          )}
        </div>

        {/* phone */}
        <div>
          <Input
            type="number"
            placeholder="Phone"
            {...register("phone", {
              required: "required",
              valueAsNumber: true,
              min: 10,
            })}
            className={className}
          />
          {errors.phone && (
            <span className="text-red-600">{errors.phone.message}</span>
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
            <span className="text-red-600">{errors.subject.message}</span>
          )}
        </div>

        {/* message */}
        <div className="md:col-span-2">
          <Textarea
            placeholder="Message"
            {...register("message", {
              required: "required",
            })}
            className={cn(`min-h-[200px] outline-none ring-0`, className)}
          />
          {errors.message && (
            <span className="text-red-600">{errors.message.message}</span>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Button className="w-full bg-white text-gray-700 transition-colors hover:bg-white/90">
          Submit
        </Button>
      </div>
    </form>
  );
}
