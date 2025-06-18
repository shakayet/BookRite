import { Types } from 'mongoose';

export interface IService {
  title: string;
  category: Types.ObjectId;
  price: number;
  description: string;
  image?: string;
  location: string;
  createdBy: Types.ObjectId;
}
