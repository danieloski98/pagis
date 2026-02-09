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

  return {
    generateContentMutation,
  };
};
