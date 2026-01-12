import OtpVerificationScreen from "@/components/screens/Otp-verification-screen";
import { router } from "expo-router";
import React from "react";

const VerifyLoginOtp = () => {
  return (
    <OtpVerificationScreen onVerified={() => router.push("/dashboard/home")} />
  );
};

export default VerifyLoginOtp;
