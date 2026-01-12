import { useQuery } from '@tanstack/react-query';
import { ImagesService } from '@/modules/services/images-service';

const service = new ImagesService();

export const useImages = () => {
  const useGetImages = (params: { page: number; categoryId: string }) => useQuery({
    queryKey: ['images', params.page, params.categoryId],
    queryFn: () => service.getImages({ params }),
  });

  return {
    useGetImages,
  };
};
