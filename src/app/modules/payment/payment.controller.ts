// src/modules/payment/payment.controller.ts
import { Request, Response } from 'express';
import { createPaymentIntentService } from './payment.service';

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'usd' } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const clientSecret = await createPaymentIntentService(amount, currency);

    return res.status(200).json({ clientSecret });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
