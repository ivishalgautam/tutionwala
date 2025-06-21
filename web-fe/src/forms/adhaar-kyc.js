import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";

const AadhaarForm = () => {
  // 2680 5271 5106
  const zoopKycInitMutation = useMutation({
    mutationFn: async (data) => {
      return await http().post(endpoints.auth.zoopKycInit);
    },
    onSuccess: ({ data }) => {
      console.log({ data });
      window.open(data.sdk_url, "_blank");
    },
    onError: (error) => {
      console.error(
        "Error sending OTP:",
        error?.response?.data?.message ?? error?.message ?? error,
      );
      setError("Failed to send OTP. Please try again.");
    },
  });

  return (
    <Button
      onClick={() => zoopKycInitMutation.mutate({})}
      disabled={zoopKycInitMutation.isLoading}
    >
      Proceed
    </Button>
  );
};

export default AadhaarForm;
