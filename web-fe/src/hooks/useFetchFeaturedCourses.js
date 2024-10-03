import { endpoints } from "@/utils/endpoints";
import http from "@/utils/http";
import { useQuery } from "@tanstack/react-query";

export default function useFetchFeaturedCourses({ limit = 10 }) {
  return useQuery({
    queryFn: async () => {
      const { data } = await http().get(
        `${endpoints.subCategories.getAll}/?featured=true&limit=${limit}`,
      );
      return data;
    },
    queryKey: [`featured-courses`],
  });
}
