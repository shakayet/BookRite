import { Schema, model } from 'mongoose';
import { IService } from './service.interface';

const serviceSchema = new Schema<IService>(
  {
    title: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String },
    location: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookings: [
      {
        date: { type: String, required: true },
        timeSlot: {
          type: String,
          enum: [
            '9:00 AM',
            '10:00 AM',
            '11:00 AM',
            '12:00 PM',
            '1:00 PM',
            '2:00 PM',
            '3:00 PM',
            '4:00 PM',
            '5:00 PM',
          ],
          required: true,
        },
        paymentStatus: { 
          type: Boolean,
          default: false,
          required: true, 
        },
        serviceStatus: {
          type: String,
          enum: ['Pending', 'Accept', 'Complete', 'Cancel'],
          default: 'Pending',
        },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        rating: { type: Number, min: 1, max: 5 },
        recommended: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export const Service = model<IService>('Service', serviceSchema);
