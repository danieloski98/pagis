import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsService } from "@/modules/services/posts-service";
import { ICreatePostDto } from "@/modules/dto/create-post-dto";
import { Toast } from "toastify-react-native";

export const usePosts = () => {
  const queryClient = useQueryClient();

  const useGetUserPosts = (params: {
    userId: string;
    page?: number;
    limit?: number;
  }) => {
    return useQuery({
      queryKey: ["posts", params.userId, params.page],
      queryFn: () =>
        postsService.getUserPosts({
          params,
        }),
      enabled: !!params.userId,
    });
  };

  const createPostMutation = useMutation({
    mutationFn: (data: ICreatePostDto) =>
      postsService.createPost({
        body: data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Toast.success("Post created successfully");
    },
    onError: (error: any) => {
      console.error("Create Post Error:", error);
      Toast.error(error.message || "Failed to create post");
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: string) => postsService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      Toast.success("Post deleted successfully");
    },
    onError: (error: any) => {
      console.error("Delete Post Error:", error);
      Toast.error("Failed to delete post");
    },
  });

  return {
    useGetUserPosts,
    createPostMutation,
    deletePostMutation,
  };
};
