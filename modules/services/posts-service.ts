import { ICreatePostDto } from "../dto/create-post-dto";
import { postsRepository } from "../repositories/posts-repository";
import { IPayload } from "../types/Repository-payload";
import { IResponse } from "../types/Response-type";
import { IPost } from "../types/SocialMediaTypes";

export class PostsService {
  async getUserPosts(
    payload: IPayload<null, { userId: string; page?: number; limit?: number }>
  ): Promise<IResponse<IPost[]>> {
    const response = await postsRepository.getUserPosts(payload);
    return response as unknown as IResponse<IPost[]>;
  }

  async createPost(payload: IPayload<ICreatePostDto, null>): Promise<IResponse<IPost>> {
    const response = await postsRepository.createPost(payload);
    return response as unknown as IResponse<IPost>;
  }

  async deletePost(id: string): Promise<void> {
    return postsRepository.deletePost(id);
  }
}

export const postsService = new PostsService();
