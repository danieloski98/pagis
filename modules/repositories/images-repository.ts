import { ROUTES } from "../api-routes";
import { IPayload } from "../types/Repository-payload";
import { ApiClient } from "./api-client";

export class ImagesRepository {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async getImages(payload: IPayload<null, { page: number, categoryId: string }>) {
        return this.apiClient.get(`${ROUTES.getImages}?page=${payload.params?.page}&categoryId=${payload.params?.categoryId}`);
    }
}