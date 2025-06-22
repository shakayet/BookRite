// src/modules/payment/payment.validation.ts
import { z } from 'zod';

export const createPaymentSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().optional(),
  }),
});
