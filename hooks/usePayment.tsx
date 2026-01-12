import { ICreatePaymentDto } from "@/modules/dto/create-payment-dto";
import { PaymentService } from "@/modules/services/payment-service";
import { IPlan } from "@/modules/types/PlansType";
import { IPayload } from "@/modules/types/Repository-payload";
import { IResponse } from "@/modules/types/Response-type";
import { useMutation, useQuery } from "@tanstack/react-query";

const service = new PaymentService();

export const usePayment = () => {
  const useGetPlans = () =>
    useQuery<IResponse<IPlan[]>>({
      queryKey: ["payment-plans"],
      queryFn: () => service.getPlans(),
      refetchOnMount: true,
    });

  const createPaymentMutation = useMutation({
    mutationFn: (payload: IPayload<ICreatePaymentDto, null>) =>
      service.createPayment(payload),
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (params: { paymentId: string }) =>
      service.verifyPayment({ params }),
  });

  const usePaymentHistory = (params: { userId: string; page: number }) =>
    useQuery({
      queryKey: ["payment-history", params.userId, params.page],
      queryFn: () => service.getPaymentHistory({ params }),
      enabled: !!params.userId,
    });

  return {
    useGetPlans,
    createPayment: createPaymentMutation,
    verifyPayment: verifyPaymentMutation,
    usePaymentHistory,
  };
};
