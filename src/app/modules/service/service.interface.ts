import { Types } from 'mongoose';


export interface IBooking {
    date: string; // format: YYYY-MM-DD
    timeSlot: '9:00 AM' | '10:00 AM' | '11:00 AM' | '12:00 PM' | '1:00 PM' | '2:00 PM' | '3:00 PM' | '4:00 PM' | '5:00 PM';
    paymentStatus?: boolean;
    user: Types.ObjectId;
  }


export interface IService {
  title: string;
  category: Types.ObjectId;
  price: number;
  description: string;
  image?: string;
  location: string;
  createdBy: Types.ObjectId;
  bookings?: IBooking;
}
