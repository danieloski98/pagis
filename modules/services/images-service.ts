import { ApiClient } from "../repositories/api-client";
import { ImagesRepository } from "../repositories/images-repository";
import { IPayload } from "../types/Repository-payload";
import { IResponse } from "../types/Response-type";

const apiClient = new ApiClient();
const repository = new ImagesRepository(apiClient);

export class ImagesService {
    async getImages(payload: IPayload<null, { page: number, categoryId: string }>) {
        const response = await repository.getImages(payload) as IResponse<any>;
        return response;
    }
}
