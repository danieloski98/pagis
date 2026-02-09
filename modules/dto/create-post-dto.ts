import { SocialPlatform } from "../types/SocialMediaTypes";

export interface ICreatePostDto {
  userId: string;
  body: string;
  platform: SocialPlatform[];
  scheduledAt?: string; // Optional - if not provided, post will be saved as draft
}

export interface IPublishPostDto {
  platforms?: SocialPlatform[];
}
