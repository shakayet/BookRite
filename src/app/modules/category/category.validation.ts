import { Types } from 'mongoose';
import { z } from 'zod';

export const categoryValidationSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    icon: z.string().optional(),
    // Remove the createdBy validation since it shouldn't come from the request body
  }),
});
