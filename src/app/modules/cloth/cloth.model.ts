import { Schema, model, Types } from 'mongoose';
import { ICloth } from './cloth.interface';

const clothSchema = new Schema<ICloth>(
  {
    title: { type: String, required: true },
    size: { type: String, enum: ['S', 'M', 'L', 'XL'], required: true },
    color: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String },
  },
  { timestamps: true }
);

export const Cloth = model<ICloth>('Cloth', clothSchema);
