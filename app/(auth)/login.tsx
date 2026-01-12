import { useTheme } from "@shopify/restyle";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Formik } from "formik";
import { Facebook, Google } from "iconsax-react-nativejs";
import { Mail, Sparkles } from "lucide-react-native";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Yup from "yup";

import Box from "@/components/ui/Box";
import CustomText from "@/components/ui/CustomText";
import CustomTextInput from "@/components/ui/TextInput";
import { useUserAuth } from "@/hooks/useUserAuth";
import { setEmail } from "@/states/slices/otp.reducer";
import { Theme } from "@/utils/theme";
import { useDispatch } from "react-redux";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

const Login = () => {
  const theme = useTheme<Theme>();
  const { login } = useUserAuth();
  const dispatch = useDispatch();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.secondaryBackgroundColor,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          padding: theme.spacing.l,
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        {/* Header Logo */}
        <Box alignItems="center" marginBottom="xl">
          <LinearGradient
            colors={["#C27AFF", "#AD46FF"]}
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 24,
              shadowColor: "#AD46FF",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            <Sparkles color="white" size={40} />
          </LinearGradient>

          <CustomText
            variant="header"
            style={{
              marginBottom: 8,
              textAlign: "center",
              fontSize: 28,
              fontWeight: "bold",
            }}
          >
            Welcome Back
          </CustomText>
          <CustomText
            variant="body"
            style={{ color: "gray", textAlign: "center" }}
          >
            Sign in to continue
          </CustomText>
        </Box>

        {/* Form */}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            console.log(values);
            dispatch(setEmail(values.email));
            login.mutate(
              { body: { ...values } },
              {
                onSuccess: (data) => {
                  console.log(data);
                  router.replace("/(auth)/verify-login-otp");
                },
              }
            );
            // Handle login logic here
          }}
        >
          {({ handleSubmit }) => (
            <Box>
              <CustomText
                variant="body"
                style={{ marginBottom: 8, fontWeight: "600" }}
              >
                Email
              </CustomText>
              <CustomTextInput
                name="email"
                leftIcon={
                  <Mail size={20} color="gray" style={{ marginRight: 8 }} />
                }
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
              />
              <Box height={16} />

              <TouchableOpacity
                onPress={() => handleSubmit()}
                activeOpacity={0.8}
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
                    marginBottom: 24,
                    marginTop: 20,
                    shadowColor: "#51A2FF",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <CustomText
                    style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                  >
                    Sign in
                  </CustomText>
                </LinearGradient>
              </TouchableOpacity>
            </Box>
          )}
        </Formik>

        {/* Divider */}
        <Box
          flexDirection="row"
          alignItems="center"
          marginBottom="l"
          paddingHorizontal="m"
        >
          <Box flex={1} height={1} backgroundColor="borderColor" />
          <CustomText
            style={{ marginHorizontal: 16, color: "gray", fontSize: 14 }}
          >
            Or continue with
          </CustomText>
          <Box flex={1} height={1} backgroundColor="borderColor" />
        </Box>

        {/* Social Buttons */}
        <Box
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="xl"
        >
          <TouchableOpacity
            style={[
              styles.socialButton,
              { borderColor: theme.colors.borderColor },
            ]}
          >
            <Google variant="Bold" size={20} color="red" />
            <CustomText
              style={{ marginLeft: 12, fontWeight: "600", fontSize: 16 }}
            >
              Google
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.socialButton,
              { borderColor: theme.colors.borderColor },
            ]}
          >
            <Facebook variant="Bold" size={20} color="blue" />
            <CustomText
              style={{ marginLeft: 12, fontWeight: "600", fontSize: 16 }}
            >
              Facebook
            </CustomText>
          </TouchableOpacity>
        </Box>

        {/* Footer */}
        <Box flexDirection="row" justifyContent="center">
          <CustomText style={{ color: "gray" }}>
            Don&apos;t have an account?{" "}
          </CustomText>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <CustomText
              style={{ color: theme.colors.primaryColor, fontWeight: "bold" }}
            >
              Sign Up
            </CustomText>
          </TouchableOpacity>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  socialButton: {
    flex: 0.47,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 56,
    borderWidth: 1,
    borderRadius: 16,
    backgroundColor: "white",
  },
});

export default Login;
