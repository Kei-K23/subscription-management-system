import { IPayment, Payment } from "@/models/payment.model";

export class PaymentService {
  static async createPayment(createPaymentInput: Partial<IPayment>) {
    return await Payment.create(createPaymentInput);
  }
}
