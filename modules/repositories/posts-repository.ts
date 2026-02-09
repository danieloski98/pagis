import { ROUTES } from "../api-routes";
import { ICreatePostDto } from "../dto/create-post-dto";
import { IPayload } from "../types/Repository-payload";
import { IPost } from "../types/SocialMediaTypes";
import { ApiClient, apiClient } from "./api-client";

export class PostsRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async getUserPosts(
    payload: IPayload<null, { userId: string; page?: number; limit?: number }>,
  ): Promise<IPost[]> {
    const { userId, page = 1, limit = 20 } = payload.params!;
    return this.apiClient.get(
      `${ROUTES.getUserPosts}?userId=${userId}&page=${page}&limit=${limit}`,
    );
  }

  async createPost(payload: IPayload<ICreatePostDto, null>): Promise<IPost> {
    const postData = payload.body;

    if (!postData) {
      throw new Error("Post data is required");
    }

    // Use /posts/schedule endpoint if scheduledAt is provided, otherwise use /posts for drafts
    const endpoint = postData.scheduledAt
      ? ROUTES.schedulePost
      : ROUTES.getUserPosts;

    return this.apiClient.post(endpoint, postData);
  }

  async deletePost(id: string): Promise<void> {
    return this.apiClient.delete(ROUTES.deletePost(id));
  }
}

export const postsRepository = new PostsRepository(apiClient);
