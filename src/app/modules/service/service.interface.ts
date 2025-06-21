// Updated service.interface.ts
import { Types } from 'mongoose';

export interface IBooking {
   _id?: Types.ObjectId;
  date: string;
  timeSlot: '9:00 AM' | '10:00 AM' | '11:00 AM' | '12:00 PM' | '1:00 PM' | '2:00 PM' | '3:00 PM' | '4:00 PM' | '5:00 PM';
  paymentStatus?: boolean;
  serviceStatus?: 'Pending' | 'Accept' | 'Complete' | 'Cancel';
  user: Types.ObjectId;
  rating?: number;
  recommended?: boolean;
}

export interface IService {
  title: string;
  category: Types.ObjectId;
  price: number;
  description: string;
  image?: string;
  location: string;
  createdBy: Types.ObjectId;
  bookings?: IBooking[];
}
