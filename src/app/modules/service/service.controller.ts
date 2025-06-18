import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import { ServiceService } from './service.service';

const createService = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ServiceService.createService(req.body, user);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Service created successfully',
    data: result,
  });
});

export const ServiceController = { createService };
