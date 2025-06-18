import { Schema, model } from 'mongoose';
import { IBanner } from './banner.interface';

const bannerSchema = new Schema<IBanner>(
  {
    title: { type: String, required: true },
    tagLine: { type: String },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export const Banner = model<IBanner>('Banner', bannerSchema);
