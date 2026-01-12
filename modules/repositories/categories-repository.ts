import { ROUTES } from "../api-routes";
import { ApiClient } from "./api-client";

export class CategoryRepository {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async getCategories() {
        return this.apiClient.get(ROUTES.getCategories);
    }
}