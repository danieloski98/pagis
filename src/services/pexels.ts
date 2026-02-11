import axios from "axios";

const PEXELS_API_KEY = process.env.EXPO_PUBLIC_PEXELS_API_KEY;
const BASE_URL = "https://api.pexels.com/v1";

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: {
    original: string;
    large2x: string;
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

export interface PexelsResponse {
  page: number;
  per_page: number;
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
}

const pexelsClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: PEXELS_API_KEY,
  },
});

export const searchImages = async (
  query: string,
  page = 1,
  perPage = 20
): Promise<PexelsPhoto[]> => {
  if (!PEXELS_API_KEY) {
    console.warn("Pexels API Key is missing");
    return [];
  }

  try {
    const response = await pexelsClient.get<PexelsResponse>("/search", {
      params: {
        query,
        page,
        per_page: perPage,
      },
    });
    return response.data.photos;
  } catch (error) {
    console.error("Error searching Pexels images:", error);
    return [];
  }
};

export const getCuratedImages = async (
  page = 1,
  perPage = 20
): Promise<PexelsPhoto[]> => {
  if (!PEXELS_API_KEY) {
    console.warn("Pexels API Key is missing");
    return [];
  }

  try {
    const response = await pexelsClient.get<PexelsResponse>("/curated", {
      params: {
        page,
        per_page: perPage,
      },
    });
    return response.data.photos;
  } catch (error) {
    console.error("Error fetching curated Pexels images:", error);
    return [];
  }
};
