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
  },
  {
    timestamps: true,
  }
);

export const Service = model<IService>('Service', serviceSchema);
