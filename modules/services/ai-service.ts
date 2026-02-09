import { aiRepository } from "../repositories/ai-repository";

export class AIService {
  async generateContent(prompt: string) {
    return aiRepository.generateContent({
      body: { prompt },
    });
  }
}

export const aiService = new AIService();