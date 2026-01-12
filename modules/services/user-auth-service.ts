import { ILoginDto } from "../dto/login-dto";
import { IResendOtpDto } from "../dto/resend-otp";
import { ISignupDto } from "../dto/signup-dto";
import { UpdateUserDto } from "../dto/update-user-dto";
import { IVerifyOtpDto } from "../dto/verify-otp";
import { ApiClient } from "../repositories/api-client";
import { UserAuthRepository } from "../repositories/user-auth-repository";
import { OtpVerified } from "../types/OtpVerifiedType";
import { IPayload } from "../types/Repository-payload";
import { IResponse } from "../types/Response-type";

const apiClient = new ApiClient();
const repository = new UserAuthRepository(apiClient);

export class UserAuthService {
  async login(payload: IPayload<ILoginDto>) {
    const response = (await repository.login(payload)) as IResponse<any>;
    return response;
  }

  async signup(payload: IPayload<ISignupDto>) {
    const response = (await repository.signup(payload)) as IResponse<any>;
    return response;
  }

  async verifyOtp(payload: IPayload<IVerifyOtpDto>) {
    const response = (await repository.verifyOtp(
      payload
    )) as IResponse<OtpVerified>;
    return response;
  }

  async resendOtp(payload: IPayload<IResendOtpDto>) {
    const response = (await repository.resendOtp(payload)) as IResponse<any>;
    return response;
  }

  async getUserDetails() {
    const response = (await repository.getUserDetails()) as IResponse<any>;
    return response;
  }

  async updateUserAccountDetails(
    payload: IPayload<UpdateUserDto, { id: string }>
  ) {
    const response = (await repository.updateUserAccountDetails(
      payload
    )) as IResponse<any>;
    return response;
  }
}
