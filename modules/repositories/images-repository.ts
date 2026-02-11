import { ROUTES } from "../api-routes";
import { IPayload } from "../types/Repository-payload";
import { ApiClient } from "./api-client";

export class ImagesRepository {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async getImages(payload: IPayload<null, { page?: number; limit?: number; categoryId?: string }>) {
        const page = payload.params?.page ?? 1;
        const limit = payload.params?.limit ?? 20;
        const categoryId = payload.params?.categoryId;
        const query = new URLSearchParams({
          page: String(page),
          limit: String(limit),
        });
        if (categoryId) query.append("categoryId", categoryId);
        return this.apiClient.get(`${ROUTES.getImages}?${query.toString()}`);
    }
}
