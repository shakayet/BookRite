import { z } from 'zod';

export const createServiceZodSchema = z.object({
  body: z.object({
    title: z.string({ required_error: 'Title is required' }),
    category: z.string({ required_error: 'Category is required' }),
    price: z.number({ required_error: 'Price is required' }),
    description: z.string({ required_error: 'Description is required' }),
    image: z.string().optional(),
    location: z.string().optional(),
    booking: z
      .object({
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
          message: 'Booking date must be in YYYY-MM-DD format',
        }),
        slot: z.string().refine(
          val =>
            [
              '9:00 AM',
              '10:00 AM',
              '11:00 AM',
              '12:00 PM',
              '1:00 PM',
              '2:00 PM',
              '3:00 PM',
              '4:00 PM',
              '5:00 PM',
            ].includes(val),
          {
            message: 'Slot must be one of the available time slots',
          }
        ),
      })
      .optional(),
  }),
});
