import { Request, Response, NextFunction } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import * as clothService from './cloth.service';
import { ICloth } from './cloth.interface';
import { StatusCodes } from 'http-status-codes';

export const createCloth = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await clothService.createCloth(req.body);
    sendResponse<ICloth>(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: 'Cloth created successfully',
      data: result,
    });
  }
);

export const getAllCloths = catchAsync(
  async (req: Request, res: Response) => {
    const result = await clothService.getAllCloths(req.query);
    sendResponse<ICloth[]>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Cloths retrieved successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

export const getSingleCloth = catchAsync(
  async (req: Request, res: Response) => {
    const result = await clothService.getSingleCloth(req.params.id);
    sendResponse<ICloth>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Cloth fetched successfully',
      data: result,
    });
  }
);

export const updateCloth = catchAsync(
  async (req: Request, res: Response) => {
    const result = await clothService.updateCloth(req.params.id, req.body);
    sendResponse<ICloth>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Cloth updated successfully',
      data: result,
    });
  }
);

export const deleteCloth = catchAsync(
  async (req: Request, res: Response) => {
    const result = await clothService.deleteCloth(req.params.id);
    sendResponse<ICloth>(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: 'Cloth deleted successfully',
      data: result,
    });
  }
);
