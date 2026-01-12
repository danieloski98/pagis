import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import { Theme } from "@/utils/theme";

interface CustomProgressbarProps {
  currentStep: number;
  totalSteps: number;
}

const CustomProgressbar = ({
  currentStep,
  totalSteps,
}: CustomProgressbarProps) => {
  const theme = useTheme<Theme>();
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <Box width="100%">
      <Box flexDirection="row" justifyContent="space-between" marginBottom="s">
        <CustomText
          variant="body"
          style={{ color: theme.colors.headerTextColor, fontWeight: "600" }}
        >
          Step {currentStep} of {totalSteps}
        </CustomText>
        <CustomText
          variant="body"
          style={{ color: theme.colors.headerTextColor, fontWeight: "600" }}
        >
          {percentage}%
        </CustomText>
      </Box>
      <Box
        height={8}
        backgroundColor="borderColor"
        borderRadius={4}
        overflow="hidden"
      >
        <LinearGradient
          colors={["#C27AFF", "#51A2FF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ width: `${percentage}%`, height: "100%" }}
        />
      </Box>
    </Box>
  );
};

export default CustomProgressbar;
