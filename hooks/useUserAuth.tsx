import { ILoginDto } from "@/modules/dto/login-dto";
import { IResendOtpDto } from "@/modules/dto/resend-otp";
import { ISignupDto } from "@/modules/dto/signup-dto";
import { UpdateUserDto } from "@/modules/dto/update-user-dto";
import { IVerifyOtpDto } from "@/modules/dto/verify-otp";
import { UserAuthService } from "@/modules/services/user-auth-service";
import { IPayload } from "@/modules/types/Repository-payload";
import { useMutation, useQuery } from "@tanstack/react-query";

const service = new UserAuthService();

export const useUserAuth = () => {
  const loginMutation = useMutation({
    mutationFn: (payload: IPayload<ILoginDto, null>) => service.login(payload),
  });

  const signupMutation = useMutation({
    mutationFn: (payload: IPayload<ISignupDto, null>) =>
      service.signup(payload),
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: IPayload<IVerifyOtpDto, null>) =>
      service.verifyOtp(payload),
  });

  const resendOtpMutation = useMutation({
    mutationFn: (payload: IPayload<IResendOtpDto, null>) =>
      service.resendOtp(payload),
  });

  const useUserDetails = () =>
    useQuery({
      queryKey: ["user-details"],
      queryFn: () => service.getUserDetails(),
    });

  const updateUserMutation = useMutation({
    mutationFn: (payload: IPayload<UpdateUserDto, { id: string }>) =>
      service.updateUserAccountDetails(payload),
  });

  return {
    login: loginMutation,
    signup: signupMutation,
    verifyOtp: verifyOtpMutation,
    resendOtp: resendOtpMutation,
    useUserDetails,
    updateUser: updateUserMutation,
  };
};
