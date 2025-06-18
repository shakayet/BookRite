import { z } from 'zod';

export const createServiceZodSchema = z.object({
    body: z.object({
        title: z.string({ required_error: 'Title is required' }),
        category: z.string({ required_error: 'Category is required' }),
        price: z.number({ required_error: 'Price is required' }),
        description: z.string({ required_error: 'Description is required' }),
        image: z.string().optional(),
        location: z.string().optional(),
    }),
});
