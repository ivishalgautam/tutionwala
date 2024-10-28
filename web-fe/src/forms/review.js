import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "../components/ui/textarea";
import { H4 } from "../components/ui/typography";
import { Button } from "../components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import http from "@/utils/http";
import { endpoints } from "@/utils/endpoints";

export default function ReviewForm({ tutorId, enquiryId }) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    watch,
  } = useForm({ defaultValues: { rating: 0, review: "" } });

  const createMutation = useMutation({
    mutationFn: (data) => http().post(endpoints.reviews.getAll, data), //! complete this endpoint
    onSuccess: () => {
      toast.success("Review submitted.");
    },
    onError: (error) => {
      toast.error(
        (error?.response?.data?.message || error.message) ?? "Error occured!",
      );
    },
  });

  const handleCreate = (data) => {
    createMutation.mutate(data);
  };

  const onSubmit = (data) => {
    const payload = {
      tutor_id: tutorId,
      enquiry_id: enquiryId,
      rating: data.rating,
      review: data.review,
    };

    handleCreate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <H4>Review</H4>
        <div className="flex flex-col items-center justify-center ">
          <Controller
            control={control}
            name="rating"
            rules={{
              required: "Required*",
              min: {
                value: 1,
                message: "Required*",
              },
            }}
            render={({ field }) => (
              <Rating
                onChange={field.onChange}
                value={field.value}
                style={{ maxWidth: 150 }}
              />
            )}
          />
          {errors.rating && (
            <span className="text-red-500">{errors.rating.message}</span>
          )}
        </div>

        <div>
          <Textarea
            {...register("review", { required: "Required*" })}
            placeholder="Write your review..."
          />
          {errors.review && (
            <span className="text-red-500">{errors.review.message}</span>
          )}
        </div>

        <div className="text-right">
          <Button>Submit</Button>
        </div>
      </div>
    </form>
  );
}
