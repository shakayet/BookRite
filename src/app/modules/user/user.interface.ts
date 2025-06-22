// user.interface.ts
import { Model, Types } from 'mongoose';
import { USER_ROLES } from '../../../enums/user';

export interface IPortfolioItem {
  _id?: Types.ObjectId;
  title: string;
  images: string[];
  description?: string;
  createdAt?: Date;
}

export interface IUserBookingRef {
  bookingId: Types.ObjectId;
  serviceId: Types.ObjectId;
}

export type IUser = {
  name: string;
  role: USER_ROLES;
  contact: string;
  email: string;
  password: string;
  location: string;
  isLocationGranted: boolean;
  image?: string;
  address?: string;
  status: 'active' | 'delete';
  portfolio?: IPortfolioItem[];
  verified: boolean;
  bookings?: IUserBookingRef[]; // Add bookings to user
  authentication?: {
    isResetPassword: boolean;
    oneTimeCode: number;
    expireAt: Date;
  };
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;