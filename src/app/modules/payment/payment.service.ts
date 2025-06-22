// src/modules/payment/payment.service.ts
import stripe from '../../../shared/stripe';

export const createPaymentIntentService = async (amount: number, currency: string = 'usd') => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // convert to cents
    currency,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent.client_secret;
};
