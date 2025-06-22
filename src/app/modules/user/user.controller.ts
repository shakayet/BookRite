import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import { getSingleFilePath } from '../../../shared/getFilePath';
import sendResponse from '../../../shared/sendResponse';
import { UserService } from './user.service';
import httpStatus from 'http-status-codes';
import ApiError from '../../../errors/ApiError';

const createUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { ...userData } = req.body;
    const result = await UserService.createUserToDB(userData);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'User created successfully',
      data: result,
    });
  }
);

const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserProfileFromDB(user);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Profile data retrieved successfully',
    data: result,
  });
});

//update profile
const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    let image = getSingleFilePath(req.files, 'image');

    const data = {
      image,
      ...req.body,
    };
    const result = await UserService.updateProfileToDB(user, data);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: 'Profile updated successfully',
      data: result,
    });
  }
);

const addPortfolioItem = catchAsync(async (req: Request, res: Response) => {
  const { title, description, images } = req.body;

  if (!images || !images.length) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please provide at least one image URL');
  }

  // Validate image URLs (basic check)
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  if (!images.every(isValidUrl)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'One or more invalid image URLs provided');
  }

  const result = await UserService.addPortfolioItem(
    req.user.id, // Using user ID from auth token
    title,
    description,
    images
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Portfolio item added successfully',
    data: result.portfolio?.slice(-1)[0] // Return the newly added item
  });
});

const getPortfolioItems = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getPortfolioItems(req.params.userId);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio items fetched successfully',
    data: result
  });
});

const getSinglePortfolioItem = catchAsync(async (req: Request, res: Response) => {
  const { userId, portfolioId } = req.params;
  const result = await UserService.getSinglePortfolioItem(userId, portfolioId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio item fetched successfully',
    data: result,
  });
});


const deletePortfolioItem = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.deletePortfolioItem(
    req.user.id, // Using user ID from auth token
    req.params.itemId
  );
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio item deleted successfully',
    data: result
  });
});

const getUserBookings = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await UserService.getUserBookings(user.id);

  console.log(result);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User bookings fetched successfully',
    data: result
  });
});

export const UserController = { createUser, getUserProfile, updateProfile, addPortfolioItem, getPortfolioItems, deletePortfolioItem, getSinglePortfolioItem, getUserBookings };
