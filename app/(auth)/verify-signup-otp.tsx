import OtpVerificationScreen from '@/components/screens/Otp-verification-screen'
import { router } from 'expo-router'
import React from 'react'

const VerifySignupOtp = () => {
  return (
    <OtpVerificationScreen onVerified={() => router.push('/account-setup')} />
  )
}

export default VerifySignupOtp
