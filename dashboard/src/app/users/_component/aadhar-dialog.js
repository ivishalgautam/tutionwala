import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Home,
  Building,
  Navigation,
  Map,
  Landmark,
  MapPin,
  Calendar,
  User,
} from "lucide-react";
import { Muted } from "@/components/ui/typography";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";
import Spinner from "@/components/spinner";

export default function AadhaarDialog({ isOpen, setIsOpen, userId }) {
  const { data, isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const { data } = await http().get(
        `${endpoints.users.getAadhaar}/${userId}`,
      );
      return data;
    },
    queryKey: ["aadhaar-details", userId],
    enabled: !!userId,
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Details as per Aadhaar</DialogTitle>
          <DialogDescription className="sr-only">
            Details as per Aadhaar
          </DialogDescription>
          {isLoading ? (
            <Spinner />
          ) : isError ? (
            error?.message
          ) : (
            <ScrollArea className="h-[500px]">
              <UserProfile data={data} />
            </ScrollArea>
          )}
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function UserProfile({ data }) {
  if (!data) return "KYC Not Done.";
  const userData = data.details;

  const { user_address: addressData } = userData;
  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-primary/5 pb-4">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">
                {userData.user_full_name}
              </CardTitle>
              <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>
                    {userData.user_gender === "M"
                      ? "Male"
                      : userData.user_gender === "F"
                        ? "Female"
                        : userData.user_gender}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{userData.user_dob}</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                <Home className="h-4 w-4" />
                <span>Aadhaar no.</span>
              </div>
              <Muted className={"text-gray-600"}>
                {data.customer_aadhaar_number}
              </Muted>
            </div>

            {userData.user_parent_name && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <User className="h-4 w-4" />
                  <span>Parent name</span>
                </div>
                <Muted className={"text-gray-600"}>
                  {userData.user_parent_name}
                </Muted>
              </div>
            )}

            {addressData.house && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Home className="h-4 w-4" />
                  <span>House</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.house}</Muted>
              </div>
            )}

            {addressData.street && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Navigation className="h-4 w-4" />
                  <span>Street</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.street}</Muted>
              </div>
            )}

            {addressData.landmark && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Landmark className="h-4 w-4" />
                  <span>Landmark</span>
                </div>
                <Muted className={"text-gray-600"}>
                  {addressData.landmark}
                </Muted>
              </div>
            )}

            {addressData.loc && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Map className="h-4 w-4" />
                  <span>Locality</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.loc}</Muted>
              </div>
            )}

            {addressData.vtc && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <Building className="h-4 w-4" />
                  <span>Village/Town/City</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.vtc}</Muted>
              </div>
            )}

            {addressData.po && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>Post Office</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.po}</Muted>
              </div>
            )}

            {addressData.dist && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>District</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.dist}</Muted>
              </div>
            )}

            {addressData.subdist && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>Sub-District</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.subdist}</Muted>
              </div>
            )}

            {addressData.state && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>State</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.state}</Muted>
              </div>
            )}

            {addressData.country && (
              <div className="space-y-1">
                <div className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  <span>Country</span>
                </div>
                <Muted className={"text-gray-600"}>{addressData.country}</Muted>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
