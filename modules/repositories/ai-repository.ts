import { ROUTES } from "../api-routes";
import { IPayload } from "../types/Repository-payload";
import { IResponse } from "../types/Response-type";
import { ApiClient, apiClient } from "./api-client";

export interface IGenerateContentDto {
  prompt: string;
}

export interface IGenerateImagePostDto {
  prompt: string;
  imageUrl: string;
}

export interface IGeneratedContent {
  content: string;
}

export interface IGeneratedPlanPost {
  body: string;
  scheduledAt: string;
}

export interface IGeneratedPlan {
  posts: IGeneratedPlanPost[];
}

export interface IGeneratedImagePost {
  body: string;
  overlayText: string;
  scheduledAt: string;
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

  async generateContentPlan(
    payload: IPayload<IGenerateContentDto, null>,
  ): Promise<IResponse<IGeneratedPlan>> {
    return this.apiClient.post(ROUTES.generateContentPlan, payload.body);
  }

  async generateImagePost(
    payload: IPayload<IGenerateImagePostDto, null>,
  ): Promise<IResponse<IGeneratedImagePost>> {
    return this.apiClient.post(ROUTES.generateImagePost, payload.body);
  }
}

export const aiRepository = new AIRepository(apiClient);
