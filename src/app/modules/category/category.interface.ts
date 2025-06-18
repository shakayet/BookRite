import { Types } from 'mongoose';

export interface ICategory {
  title: string;
  icon?: string;
  createdBy: Types.ObjectId;  
}
