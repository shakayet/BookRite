import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { USER_ROLES } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import { emailHelper } from '../../../helpers/emailHelper';
import { emailTemplate } from '../../../shared/emailTemplate';
import unlinkFile from '../../../shared/unlinkFile';
import generateOTP from '../../../util/generateOTP';
import { IUser } from './user.interface';
import { User } from './user.model';
import httpStatus from 'http-status-codes';
import { Types } from 'mongoose';
import { Service } from '../service/service.model';
import { IBooking } from '../service/service.interface';

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  //set role
  //payload.role = USER_ROLES.PROVIDER;    /*SEND IT MANUALLY*/
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };
  const createAccountTemplate = emailTemplate.createAccount(values);
  emailHelper.sendEmail(createAccountTemplate);

  //save to DB
  const authentication = {
    oneTimeCode: otp,
    expireAt: new Date(Date.now() + 3 * 60000),
  };
  await User.findOneAndUpdate(
    { _id: createUser._id },
    { $set: { authentication } }
  );

  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.image) {
    unlinkFile(isExistUser.image);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });

  return updateDoc;
};

const addPortfolioItem = async (
  userId: string,
  title: string,
  description: string,
  imageLinks: string[]
) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $push: {
        portfolio: {
          title,
          description,
          images: imageLinks
        }
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

const getPortfolioItems = async (userId: string) => {
  const user = await User.findById(userId).select('portfolio');
  
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user.portfolio || [];
};

const deletePortfolioItem = async (userId: string, itemId: string) => {
  const user = await User.findOneAndUpdate(
    {
      _id: userId,
      'portfolio._id': itemId
    },
    {
      $pull: { portfolio: { _id: itemId } }
    },
    { new: true }
  );

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Portfolio item not found');
  }

  return user;
};

const getSinglePortfolioItem = async (userId: string, portfolioId: string) => {
  const user = await User.findById(userId).select('portfolio');

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  const portfolioItem = user.portfolio?.find(item => item._id?.toString() === portfolioId);

  if (!portfolioItem) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Portfolio item not found');
  }

  return portfolioItem;
};

const getUserBookings = async (userId: string) => {
  console.log(`[getUserBookings] Aggregating bookings for user: ${userId}`);

  const bookings = await Service.aggregate([
    { $unwind: '$bookings' },
    { $match: { 'bookings.user': new Types.ObjectId(userId) } },
    {
      $project: {
        _id: 0,
        booking: '$bookings',
        service: {
          _id: '$_id',
          title: '$title',
          image: '$image',
          price: '$price'
        }
      }
    }
  ]);

  if (!bookings.length) {
    return {
      stats: {
        Pending: 0,
        Accept: 0,
        Complete: 0,
        Cancel: 0,
        Total: 0
      },
      bookings: {}
    };
  }

  const grouped: Record<string, any[]> = {
    Pending: [],
    Accept: [],
    Complete: [],
    Cancel: []
  };

  for (const { booking, service } of bookings) {
    const status = booking.serviceStatus || 'Other';
    const entry = {
      _id: booking._id,
      date: new Date(booking.date),
      timeSlot: booking.timeSlot,
      paymentStatus: booking.paymentStatus,
      serviceStatus: booking.serviceStatus,
      createdAt: booking.createdAt || new Date(),
      service
    };
    if (grouped[status]) {
      grouped[status].push(entry);
    } else {
      if (!grouped.Other) grouped.Other = [];
      grouped.Other.push(entry);
    }
  }

  const stats = {
    Pending: grouped.Pending.length,
    Accept: grouped.Accept.length,
    Complete: grouped.Complete.length,
    Cancel: grouped.Cancel.length,
    Total: bookings.length
  };

  return {
    stats,
    bookings: grouped
  };
};


export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  addPortfolioItem,
  getPortfolioItems,
  deletePortfolioItem,
  getSinglePortfolioItem,
  getUserBookings,
};
