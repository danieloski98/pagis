import { ICreatePaymentDto } from "../dto/create-payment-dto";
import { ApiClient } from "../repositories/api-client";
import { PaymentRepository } from "../repositories/payment-repository";
import { IPlan } from "../types/PlansType";
import { IPayload } from "../types/Repository-payload";
import { IResponse } from "../types/Response-type";

const apiClient = new ApiClient();
const repository = new PaymentRepository(apiClient);

export class PaymentService {
  async getPlans() {
    const response = (await repository.getPlans()) as IResponse<IPlan[]>;
    return response;
  }

  async createPayment(payload: IPayload<ICreatePaymentDto, null>) {
    const response = (await repository.createPayment(
      payload
    )) as IResponse<any>;
    return response;
  }

  async verifyPayment(payload: IPayload<null, { paymentId: string }>) {
    const response = (await repository.verifyPayment(
      payload
    )) as IResponse<any>;
    return response;
  }

  async getPaymentHistory(
    payload: IPayload<null, { userId: string; page: number }>
  ) {
    const response = (await repository.getPaymentHistory(
      payload
    )) as IResponse<any>;
    return response;
  }
}
