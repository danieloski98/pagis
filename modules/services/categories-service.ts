import { ApiClient } from "../repositories/api-client";
import { CategoryRepository } from "../repositories/categories-repository";
import { Category } from "../types/CategoriesTypes";
import { IResponse } from "../types/Response-type";

const apiClient = new ApiClient();
const repository = new CategoryRepository(apiClient);

export class CategoriesService {
  async getCategories() {
    const response = (await repository.getCategories()) as IResponse<
      Category[]
    >;
    return response;
  }
}
