import { CategoriesService } from "@/modules/services/categories-service";
import { useQuery } from "@tanstack/react-query";

const service = new CategoriesService();

export const useCategories = () => {
  const useGetCategories = () =>
    useQuery({
      queryKey: ["categories"],
      queryFn: () => service.getCategories(),
    });

  return {
    useGetCategories,
  };
};
