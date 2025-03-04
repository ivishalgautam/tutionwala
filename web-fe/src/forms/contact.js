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

  const className = "bg-gray-50 text-black";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <H2 className={"border-none text-black"}>Contact Us</H2>

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
              valueAsNumber: true,
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
