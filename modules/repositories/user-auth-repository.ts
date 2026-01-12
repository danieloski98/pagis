import { ROUTES } from "../api-routes";
import { ILoginDto } from "../dto/login-dto";
import { IResendOtpDto } from "../dto/resend-otp";
import { ISignupDto } from "../dto/signup-dto";
import { UpdateUserDto } from "../dto/update-user-dto";
import { IVerifyOtpDto } from "../dto/verify-otp";
import { IPayload } from "../types/Repository-payload";
import { ApiClient } from "./api-client";

export class UserAuthRepository {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async login(payload: IPayload<ILoginDto, null>) {
        return this.apiClient.post(ROUTES.login, payload.body);
    }

    async signup(payload: IPayload<ISignupDto, null>) {
        return this.apiClient.post(ROUTES.signup, payload.body);
    }

    async verifyOtp(payload: IPayload<IVerifyOtpDto, null>) {
        return this.apiClient.post(ROUTES.verifyOtp, payload.body);
    }

    async resendOtp(payload: IPayload<IResendOtpDto, null>) {
        return this.apiClient.post(ROUTES.resendOtp, payload.body);
    }

    async getUserDetails() {
        return this.apiClient.get(ROUTES.details);
    }

    async updateUserAccountDetails(payload: IPayload<UpdateUserDto, { id: string }>) {
        return this.apiClient.patch(ROUTES.updateUser(payload.params?.id as string), payload.body);
    }
}