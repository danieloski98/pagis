import { ICreatePostDto, IPublishPostDto } from "../dto/create-post-dto";
import { ApiClient } from "../repositories/api-client";
import { SocialMediaRepository } from "../repositories/social-media-repository";
import { IPayload } from "../types/Repository-payload";
import { IResponse } from "../types/Response-type";
import { IPost, ISocialAccount } from "../types/SocialMediaTypes";

const apiClient = new ApiClient();
const repository = new SocialMediaRepository(apiClient);

export class SocialMediaService {
  getConnectFacebookUrl(userId: string) {
    return repository.getConnectFacebookUrl(userId);
  }

  async getConnectedAccounts(
    payload: IPayload<null, { userId: string; page?: number; limit?: number }>,
  ) {
    const response = (await repository.getConnectedAccounts(
      payload,
    )) as IResponse<ISocialAccount[]>;
    return response;
  }

  async disconnectAccount(payload: IPayload<null, { id: string }>) {
    const response = (await repository.disconnectAccount(
      payload,
    )) as IResponse<any>;
    return response;
  }

  async schedulePost(payload: IPayload<ICreatePostDto, null>) {
    const response = (await repository.schedulePost(
      payload,
    )) as IResponse<IPost>;
    return response;
  }

  async publishPost(payload: IPayload<IPublishPostDto, { id: string }>) {
    const response = (await repository.publishPost(
      payload,
    )) as IResponse<IPost>;
    return response;
  }
}
