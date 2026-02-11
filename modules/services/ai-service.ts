import { aiRepository } from "../repositories/ai-repository";

export class AIService {
  async generateContent(prompt: string) {
    return aiRepository.generateContent({
      body: { prompt },
    });
  }

  async generateContentPlan(prompt: string) {
    return aiRepository.generateContentPlan({
      body: { prompt },
    });
  }

  async generateImagePost(prompt: string, imageUrl: string) {
    return aiRepository.generateImagePost({
      body: { prompt, imageUrl },
    });
  }
}

export const aiService = new AIService();
