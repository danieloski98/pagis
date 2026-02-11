export enum SocialPlatform {
  FACEBOOK = "FACEBOOK",
  INSTAGRAM = "INSTAGRAM",
  TWITTER = "TWITTER",
}

export interface ISocialAccount {
  _id: string;
  platform: SocialPlatform;
  accountHandle: string;
  externalId: string;
  connectedAt: string;
  isRevoked: boolean;
}

export enum PostStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  SCHEDULED = "SCHEDULED",
  FAILED = "FAILED",
}

export interface IPost {
  _id: string;
  status: PostStatus;
  scheduledAt: string;
  body: string;
  platform: SocialPlatform[];
  userId: string;
}
