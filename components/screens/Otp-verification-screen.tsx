import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { ArrowLeft, Mail } from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import { useUserAuth } from "@/hooks/useUserAuth";
import { RootState } from "@/states";
import { setToken } from "@/states/slices/token.reducer";
import { updateDetails } from "@/states/slices/user.reducer";
import { Theme } from "@/utils/theme";
import { useDispatch, useSelector } from "react-redux";
import { Toast } from "toastify-react-native";

interface IProps {
  onVerified: () => void;
}

const OTP_LENGTH = 6;

const OtpVerificationScreen = ({ onVerified }: IProps) => {
  const theme = useTheme<Theme>();
  const [otp, setOtp] = useState<string[]>(new Array(OTP_LENGTH).fill(""));
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [timer, setTimer] = useState(59);

  // reducer
  const dispatch = useDispatch();

  const { verifyOtp, resendOtp } = useUserAuth();

  // redux state
  const email = useSelector((state: RootState) => state.otpPage.email);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Move to next input if text is entered
    if (text && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveInputIndex(index + 1);
    }

    // If we filled the last digit, we could auto-submit or just dismiss keyboard
    if (index === OTP_LENGTH - 1 && text) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        // If current is empty, move back and delete previous
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
        setActiveInputIndex(index - 1);
      }
    }
  };

  const handleInputFocus = (index: number) => {
    setActiveInputIndex(index);
  };

  const handleResend = () => {
    setTimer(59);
    resendOtp
      .mutateAsync({
        body: {
          email,
        },
      })
      .then(() => {
        // Handle success
        Toast.success("OTP resent successfully");
      })
      .catch(() => {
        // Handle error
      });
    // Add resend logic here
  };

  const handleVerify = () => {
    const code = otp.join("");
    console.log("Verifying code:", code);
    verifyOtp
      .mutateAsync({
        body: {
          email,
          code,
        },
      })
      .then((data) => {
        console.log("DATA", data);
        // Dispatch action to update user state
        dispatch(updateDetails(data?.data?.user));
        dispatch(setToken(data?.data?.access_token));
        // SecureStore.setItemAsync(TOKEN_KEY, data?.data?.access_token || "");
        onVerified();
      })
      .catch(() => {
        // Handle error
      });
    // Add verification logic here
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.colors.mainBackgroundColor }}
    >
      <Box flex={1} paddingHorizontal="l">
        {/* Header */}
        <Box marginTop="m" marginBottom="xl">
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={theme.colors.headerTextColor} size={24} />
          </TouchableOpacity>
        </Box>

        {/* Content */}
        <Box alignItems="center" flex={1}>
          {/* Icon */}
          <Box
            width={80}
            height={80}
            backgroundColor="mainBackgroundColor"
            borderRadius={24}
            justifyContent="center"
            alignItems="center"
            marginBottom="l"
            style={{
              shadowColor: "#AD46FF",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
              backgroundColor: "white", // Force white background for the icon container to match design
            }}
          >
            <Mail color={theme.colors.primaryColor} size={32} />
          </Box>

          {/* Texts */}
          <CustomText
            variant="header"
            style={{
              marginBottom: 8,
              textAlign: "center",
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            Check Your Email
          </CustomText>

          <CustomText
            variant="body"
            style={{ color: "gray", textAlign: "center", marginBottom: 32 }}
          >
            We&lsquo;ve sent a verification code to{"\n"}
            <CustomText
              style={{
                fontWeight: "bold",
                color: theme.colors.headerTextColor,
              }}
            >
              {email}
            </CustomText>
          </CustomText>

          {/* OTP Inputs */}
          <Box width="100%" marginBottom="xl">
            <CustomText
              style={{
                textAlign: "center",
                marginBottom: 16,
                color: theme.colors.bodyTextColor,
              }}
            >
              Enter Verification Code
            </CustomText>

            <Box flexDirection="row" justifyContent="space-between">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  onFocus={() => handleInputFocus(index)}
                  maxLength={1}
                  keyboardType="number-pad"
                  style={[
                    styles.otpInput,
                    {
                      borderColor:
                        activeInputIndex === index
                          ? theme.colors.primaryColor
                          : theme.colors.borderColor,
                      color: theme.colors.headerTextColor,
                      backgroundColor: theme.colors.mainBackgroundColor,
                    },
                  ]}
                  selectionColor={theme.colors.primaryColor}
                />
              ))}
            </Box>
          </Box>

          {/* Verify Button */}
          <TouchableOpacity
            onPress={handleVerify}
            activeOpacity={0.8}
            style={{ width: "100%", marginBottom: 24 }}
          >
            <LinearGradient
              colors={["#C27AFF", "#51A2FF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                height: 56,
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#51A2FF",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              {verifyOtp?.isPending ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <CustomText
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Verify Code
                </CustomText>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Resend Timer */}
          <Box alignItems="center">
            <CustomText style={{ color: "gray", marginBottom: 8 }}>
              Didn&apos;t receive the code?
            </CustomText>
            <TouchableOpacity onPress={handleResend} disabled={timer > 0}>
              <CustomText
                style={{
                  color: timer > 0 ? "gray" : theme.colors.primaryColor,
                  fontWeight: "600",
                }}
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
              </CustomText>
            </TouchableOpacity>
          </Box>
        </Box>
      </Box>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1.5,
    borderRadius: 12,
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default OtpVerificationScreen;
