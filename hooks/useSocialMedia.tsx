import { ICreatePostDto, IPublishPostDto } from "@/modules/dto/create-post-dto";
import { SocialMediaService } from "@/modules/services/social-media-service";
import { IPayload } from "@/modules/types/Repository-payload";
import { IResponse } from "@/modules/types/Response-type";
import { ISocialAccount } from "@/modules/types/SocialMediaTypes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const service = new SocialMediaService();

export const useSocialMedia = () => {
  const queryClient = useQueryClient();

  const getConnectFacebookUrl = async (userId: string) => {
    const data = await service.getConnectFacebookUrl(userId);
    console.log("RETURNED DATA: HOOK", data);
    return data;
  };

  const useGetConnectedAccounts = (params: {
    userId: string;
    page?: number;
    limit?: number;
  }) =>
    useQuery<IResponse<ISocialAccount[]>>({
      queryKey: ["connected-accounts", params.userId],
      queryFn: () => service.getConnectedAccounts({ params }),
      enabled: !!params.userId,
    });

  const disconnectAccountMutation = useMutation({
    mutationFn: (params: { id: string }) =>
      service.disconnectAccount({ params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connected-accounts"] });
    },
  });

  const schedulePostMutation = useMutation({
    mutationFn: (payload: IPayload<ICreatePostDto, null>) =>
      service.schedulePost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const publishPostMutation = useMutation({
    mutationFn: (payload: IPayload<IPublishPostDto, { id: string }>) =>
      service.publishPost(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    getConnectFacebookUrl,
    useGetConnectedAccounts,
    disconnectAccountMutation,
    schedulePostMutation,
    publishPostMutation,
  };
};
