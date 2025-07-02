import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";

const AadhaarForm = () => {
 
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
