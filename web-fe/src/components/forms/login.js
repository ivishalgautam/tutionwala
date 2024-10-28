"use client";

import { useState } from "react";
import { H1, P } from "../ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button, buttonVariants } from "../ui/button";

import Link from "next/link";
import { useForm } from "react-hook-form";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import Image from "next/image";
import { X } from "lucide-react";

export default function LoginForm({ setIsOtpSent, setPhone }) {
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function loginUser(credentials) {
    setLoading(true);
    try {
      const response = await http().post(
        `${endpoints.auth.login}/otp-send`,
        credentials,
      );
      setIsOtpSent(true);

      return response.data;
    } catch (error) {
      // console.log(error);
      return toast.error(error.message ?? "error");
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    setPhone(data.phone);
    await loginUser({ mobile_number: data.phone });
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex items-center justify-start text-start">
        <div className="w-full space-y-6">
          <div className="relative mb-8 before:absolute before:-bottom-5 before:left-0 before:h-1.5 before:w-20 before:bg-black">
            <H1>Login</H1>
          </div>

          {/* phone */}
          <div>
            <Label>Phone</Label>
            <Input
              {...register("phone", {
                required: "required",
              })}
              placeholder="Enter your phone"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
          </div>

          <div>
            <Button className="rounded-full px-12 py-6">
              {loading && (
                <span className="mr-3 h-5 w-5 animate-spin rounded-full border-4 border-white/30 border-t-white"></span>
              )}
              LOGIN
            </Button>
          </div>

          <div className="translate-y-4">
            <P className={"text-center text-sm font-medium tracking-wide"}>
              Don&apos;t have an account?{" "}
              <AlertDialog>
                <AlertDialogTrigger className="text-primary">
                  Create one
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader className="relative">
                    <AlertDialogTitle className="text-center uppercase">
                      Sign up as?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="flex w-full items-center justify-center gap-2">
                        <AlertDialogCancel
                          className={`absolute right-2 top-2 border-none p-0 ${buttonVariants({ size: "icon", variant: "ghost" })}`}
                        >
                          <X size={20} />
                        </AlertDialogCancel>
                        {["tutor", "student"].map((item) => (
                          <div key={item}>
                            <Link
                              className={`group flex size-44 flex-col items-center justify-center gap-2 rounded-lg border text-lg font-semibold tracking-wider transition-colors hover:bg-gray-100`}
                              href={`/signup/${item}`}
                            >
                              <figure className="size-20">
                                <Image
                                  src={
                                    item === "tutor"
                                      ? "/images/teacher.png"
                                      : "/images/student.png"
                                  }
                                  width={100}
                                  height={100}
                                  alt={item}
                                  className="h-full w-full object-contain object-center transition-all"
                                />
                              </figure>
                              <div className={"text-center text-sm uppercase"}>
                                {item}
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                </AlertDialogContent>
              </AlertDialog>
            </P>
          </div>
        </div>
      </div>
    </form>
  );
}
