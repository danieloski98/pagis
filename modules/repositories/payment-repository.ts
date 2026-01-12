import { ROUTES } from "../api-routes";
import { ICreatePaymentDto } from "../dto/create-payment-dto";
import { IPayload } from "../types/Repository-payload";
import { ApiClient } from "./api-client";

export class PaymentRepository {
     private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async getPlans() {
        return this.apiClient.get(ROUTES.getPaymentPlans);
    }

    async createPayment(payload: IPayload<ICreatePaymentDto, null>) {
        return this.apiClient.post(ROUTES.createPayment, payload.body);
    }

    async verifyPayment(payload: IPayload<null, { paymentId: string }>) {
        return this.apiClient.get(ROUTES.verifyPayment(payload.params?.paymentId as string));
    }

    async getPaymentHistory(payload: IPayload<null, { userId: string, page: number }>) {
        return this.apiClient.get(`${ROUTES.getUserPayments(payload.params?.userId as string)}?page=${payload.params?.page}`);
    }
}