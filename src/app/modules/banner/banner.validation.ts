import { z } from 'zod';

export const createBannerZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    tagLine: z.string().optional(),
    image: z.string({ required_error: 'Image is required' }),
  }),
});
