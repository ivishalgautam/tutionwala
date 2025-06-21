"use client";
import React, { useContext, useEffect, useState } from "react";
import {
  Shield,
  CheckCircle,
  Clock,
  FileText,
  Loader2,
  Smartphone,
  Cloud,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainContext } from "@/store/context";

export default function DigiLockerKYCPage() {
  const router = useRouter();
  const { user } = useContext(MainContext);

  useEffect(() => {
    if (user?.is_aadhaar_verified) {
      router.replace("/dashboard/profile");
    }
  }, [user, router]);

  const zoopKycInitMutation = useMutation({
    mutationFn: async (data) => {
      return await http().post(endpoints.auth.zoopKycInit);
    },
    onSuccess: ({ data }) => {
      window.open(data.sdk_url, "_blank");
      router.replace("/");
    },
    onError: (error) => {
      toast.error(error?.message ?? "Something went wrong!");
    },
  });

  const verificationSteps = [
    {
      icon: Smartphone,
      title: "DigiLocker Login",
      description: "Securely login to your DigiLocker account",
    },
    {
      icon: Cloud,
      title: "Document Access",
      description: "Access your verified documents from DigiLocker",
    },
    {
      icon: CheckCircle,
      title: "Instant Verification",
      description: "Complete verification in seconds",
    },
  ];

  const benefits = [
    "Government-verified documents from DigiLocker",
    "No document upload required",
    "Instant authentication with digital signatures",
    "100% paperless and secure process",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="mx-auto max-w-4xl space-y-8 py-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-blue-100 p-3">
              <Cloud className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            DigiLocker KYC Verification
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Complete your identity verification instantly using your DigiLocker
            account with government-verified documents
          </p>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Government Digital Platform
          </Badge>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main KYC Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg">
              <CardHeader className="rounded-t-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <CardTitle className="text-xl">
                  Start Your DigiLocker Verification
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Verify instantly using your DigiLocker digital documents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Requirements */}
                  <div>
                    <h3 className="mb-3 font-semibold text-gray-900">
                      What you&apos;ll need:
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        Active DigiLocker account with verified documents
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        Mobile number linked to DigiLocker
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 flex-shrink-0 text-green-500" />
                        Stable internet connection
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  {/* Verification Steps */}
                  <div>
                    <h3 className="mb-4 font-semibold text-gray-900">
                      Verification Process:
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      {verificationSteps.map((step, index) => (
                        <div key={index} className="text-center">
                          <div className="mb-2 flex justify-center">
                            <div className="rounded-full bg-blue-100 p-2">
                              <step.icon className="h-5 w-5 text-blue-600" />
                            </div>
                          </div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {step.title}
                          </h4>
                          <p className="mt-1 text-xs text-gray-500">
                            {step.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Action Button */}
                  <div className="space-y-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={"/dashboard/profile"}
                        className={`w-full sm:w-auto ${buttonVariants({ variant: "outline", size: "lg" })}`}
                      >
                        I will do it later
                      </Link>
                      <Button
                        onClick={() => zoopKycInitMutation.mutate({})}
                        disabled={zoopKycInitMutation.isLoading}
                        size="lg"
                        className="w-full sm:w-auto"
                      >
                        {zoopKycInitMutation.isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting to DigiLocker...
                          </>
                        ) : (
                          <>
                            <Cloud className="mr-2 h-4 w-4" />
                            Verify with DigiLocker
                          </>
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      You&apos;ll be redirected to DigiLocker for secure
                      authentication
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits Card */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                  Why DigiLocker KYC?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="mr-2 mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                      <span className="text-gray-600">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Time Estimate */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-5 w-5 text-blue-500" />
                  Time Estimate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    30 secs
                  </div>
                  <p className="text-sm text-gray-500">
                    Average completion time
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-0 bg-gray-50 shadow-lg">
              <CardContent className="p-4">
                <div className="space-y-2 text-center">
                  <h4 className="font-medium text-gray-900">Need Help?</h4>
                  <p className="text-xs text-gray-600">
                    Having trouble with DigiLocker? Our support team is here to
                    help you complete your verification.
                  </p>
                  <Button variant="outline" size="sm" className="text-xs">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Shield className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-600" />
              <div>
                <h4 className="font-medium text-yellow-800">
                  Security & Privacy with DigiLocker
                </h4>
                <p className="mt-1 text-sm text-yellow-700">
                  DigiLocker ensures maximum security with government-grade
                  encryption. Your documents are digitally signed and verified
                  by issuing authorities. We only access necessary information
                  for verification and never store your DigiLocker credentials.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
