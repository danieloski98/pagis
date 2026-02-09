import { ROUTES } from "../api-routes";
import { IPayload } from "../types/Repository-payload";
import { IResponse } from "../types/Response-type";
import { ApiClient, apiClient } from "./api-client";

export interface IGenerateContentDto {
  prompt: string;
}

export interface IGeneratedContent {
  content: string;
}

export class AIRepository {
  private apiClient: ApiClient;

  constructor(apiClient: ApiClient) {
    this.apiClient = apiClient;
  }

  async generateContent(
    payload: IPayload<IGenerateContentDto, null>,
  ): Promise<IResponse<IGeneratedContent>> {
    return this.apiClient.post(ROUTES.generateContent, payload.body);
  }
}

export const aiRepository = new AIRepository(apiClient);
