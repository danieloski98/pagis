import { Theme } from "@/utils/theme";
import { LinearGradient } from "expo-linear-gradient";
import { useFormikContext } from "formik";
import React from "react";
import {
  ActivityIndicator,
  DimensionValue,
  TouchableOpacity,
} from "react-native";
import CustomText from "./CustomText";

type BtnType = "FLAT" | "OUTLINE";

interface IProps {
  title: string;
  width?: DimensionValue;
  height?: DimensionValue;
  backgroundColor?: keyof Theme["colors"];
  color?: string;
  borderWidth?: number;
  borderRadius?: number;
  type?: BtnType;
  isLoading?: boolean;
  gradientColors?: [string, string, ...string[]];
  disabled?: boolean;
}

const SubmitButton = ({
  title,
  width = "100%",
  height = 56,
  backgroundColor = "primaryColor",
  color = "white",
  borderWidth = 0,
  borderRadius = 16,
  type = "FLAT",
  isLoading = false,
  gradientColors = ["#C27AFF", "#51A2FF"],
  disabled = false,
}: IProps) => {
  const { handleSubmit } = useFormikContext();
  const isDisabled = disabled || isLoading;

  return (
    <TouchableOpacity
      onPress={() => handleSubmit()}
      activeOpacity={0.8}
      disabled={isDisabled}
      style={{
        width,
        shadowColor: isDisabled ? "transparent" : "#51A2FF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: isDisabled ? 0 : 0.3,
        shadowRadius: 8,
        elevation: isDisabled ? 0 : 5,
        marginTop: 20,
        marginBottom: 24,
        opacity: isDisabled ? 0.6 : 1,
      }}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          height,
          borderRadius,
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        {isLoading ? (
          <ActivityIndicator color={color} />
        ) : (
          <CustomText
            style={{
              color,
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            {title}
          </CustomText>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default SubmitButton;
