import { z } from 'zod';

const sizeEnum = z.enum(['S', 'M', 'L', 'XL']);

export const createClothZodSchema = z.object({
  body: z.object({
    title: z.string(),
    size: sizeEnum,
    color: z.string(),
    price: z.number(),
    category: z.string().optional(),
  }),
});

export const updateClothZodSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    size: sizeEnum.optional(),
    color: z.string().optional(),
    price: z.number().optional(),
    category: z.string().optional(),
  }),
});
