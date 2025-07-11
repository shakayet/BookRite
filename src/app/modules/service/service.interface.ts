// service.interface.ts
import { Types } from 'mongoose';

export type IBooking = {
  _id?: Types.ObjectId;
  date: string;
  timeSlot:
    | '9:00 AM'
    | '10:00 AM'
    | '11:00 AM'
    | '12:00 PM'
    | '1:00 PM'
    | '2:00 PM'
    | '3:00 PM'
    | '4:00 PM'
    | '5:00 PM';
  paymentStatus?: boolean;
  serviceStatus?: 'Pending' | 'Accept' | 'Complete' | 'Cancel';
  user: Types.ObjectId;
  rating?: number;
  recommended?: string;
  paymentDate?: Date;
};

export type IService = {
  title: string;
  category: Types.ObjectId;
  price: number;
  description: string;
  image?: string;
  location: string;
  createdBy: Types.ObjectId;
  bookings?: IBooking[];
  averageRating?: number;
  totalRatings?: number;
};
