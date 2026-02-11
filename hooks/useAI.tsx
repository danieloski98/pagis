import { useMutation } from "@tanstack/react-query";
import { aiService } from "@/modules/services/ai-service";
import { Toast } from "toastify-react-native";

export const useAI = () => {
  const generateContentMutation = useMutation({
    mutationFn: (prompt: string) => aiService.generateContent(prompt),
    onError: (error: any) => {
      Toast.error(error.message || "Failed to generate content");
    },
  });

  const generateContentPlanMutation = useMutation({
    mutationFn: (prompt: string) => aiService.generateContentPlan(prompt),
    onError: (error: any) => {
      Toast.error(error.message || "Failed to generate post plan");
    },
  });

  const generateImagePostMutation = useMutation({
    mutationFn: (payload: { prompt: string; imageUrl: string }) =>
      aiService.generateImagePost(payload.prompt, payload.imageUrl),
    onError: (error: any) => {
      Toast.error(error.message || "Failed to generate image post");
    },
  });

  return {
    generateContentMutation,
    generateContentPlanMutation,
    generateImagePostMutation,
  };
};
