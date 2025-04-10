"use client";

import { useState } from "react";
import { H1, P } from "../components/ui/typography";
import { Label } from "@radix-ui/react-label";
import { Input } from "../components/ui/input";
import { Button, buttonVariants } from "../components/ui/button";

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
} from "../components/ui/alert-dialog";
import { X } from "lucide-react";
import SignUpAs from "@/components/sign-up-as";

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
                required: "required*",
              })}
              placeholder="Enter your phone"
              className="mt-2 rounded-full bg-gray-100 px-4 py-6"
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )}
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
                <AlertDialogContent className="max-w-3xl">
                  <AlertDialogHeader className="relative">
                    <AlertDialogTitle className="text-center uppercase">
                      Sign up as?
                    </AlertDialogTitle>
                    <AlertDialogDescription></AlertDialogDescription>
                    <div className="flex w-full items-center justify-center gap-2">
                      <AlertDialogCancel
                        className={`absolute right-2 top-2 border-none p-0 ${buttonVariants({ size: "icon", variant: "ghost" })}`}
                      >
                        <X size={20} />
                      </AlertDialogCancel>
                      <div>
                        <SignUpAs />
                      </div>
                    </div>
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
