import { ROUTES } from "../api-routes";
import { ICreatePostDto, IPublishPostDto } from "../dto/create-post-dto";
import { IPayload } from "../types/Repository-payload";
import { ApiClient } from "./api-client";

export class SocialMediaRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  getConnectFacebookUrl(userId: string): Promise<{ url: string }> {
    return this.apiClient.get(`${ROUTES.connectFacebook}?userId=${userId}`);
  }

  async getConnectedAccounts(
    payload: IPayload<null, { userId: string; page?: number; limit?: number }>,
  ) {
    const { userId, page = 1, limit = 20 } = payload.params!;
    return this.apiClient.get(
      `${ROUTES.getConnectedSocialAccounts}?userId=${userId}&page=${page}&limit=${limit}`,
    );
  }

  async disconnectAccount(payload: IPayload<null, { id: string }>) {
    return this.apiClient.post(
      ROUTES.disconnectSocialAccount(payload.params!.id),
      {},
    );
  }

  async schedulePost(payload: IPayload<ICreatePostDto, null>) {
    return this.apiClient.post(ROUTES.schedulePost, payload.body);
  }

  async publishPost(payload: IPayload<IPublishPostDto, { id: string }>) {
    return this.apiClient.post(
      ROUTES.publishDraftPost(payload.params!.id),
      payload.body || {},
    );
  }
}
