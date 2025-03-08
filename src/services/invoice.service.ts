import { IInvoice, Invoice } from "@/models/invoice.module";

export class InvoiceService {
  static async createInvoice(createInvoiceInput: Partial<IInvoice>) {
    return await Invoice.create(createInvoiceInput);
  }
}
