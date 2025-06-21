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

const getAllServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getAllServices(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All services fetched successfully',
    data: result,
  });
});

const getServiceByCategory = catchAsync(async (req: Request, res: Response) => {
  const category = req.params.category;
  const result = await ServiceService.getServicesByCategory(category);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Services under ${category} fetched successfully`,
    data: result,
  });
});

const getServiceDetails = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getServiceDetails(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service details fetched successfully',
    data: result,
  });
});

const getServicePortfolio = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ServiceService.getServicePortfolio(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Portfolio fetched successfully',
    data: result,
  });
});

const getServiceReviews = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getServiceReviews();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service reviews fetched successfully',
    data: result,
  });
});

const getTrendingServices = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getTrendingServices();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Trending services fetched successfully',
    data: result,
  });
});

const getRecommendedServices = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ServiceService.getRecommendedServices(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Recommended services fetched successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await ServiceService.getAllCategories();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'All categories fetched successfully',
    data: result,
  });
});

const deleteService = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const user = req.user;
  const result = await ServiceService.deleteService(serviceId, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service deleted successfully',
    data: result,
  });
});

const updateService = catchAsync(async (req: Request, res: Response) => {
  const serviceId = req.params.id;
  const user = req.user;
  const payload = req.body;
  const result = await ServiceService.updateService(serviceId, payload, user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service updated successfully',
    data: result,
  });
});

const bookServiceSlot = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ServiceService.bookServiceSlot(req.params.id, req.body, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Slot booked successfully',
    data: result,
  });
});

const getProviderDashboard = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const result = await ServiceService.getProviderDashboard(user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Provider dashboard fetched successfully',
    data: result,
  });
});

const updateBookingStatus = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { serviceId, bookingId } = req.params;
  console.log(req.body.serviceStatus);
  const result = await ServiceService.updateBookingStatus(serviceId, bookingId, req.body.serviceStatus, user);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Booking status updated successfully',
    data: result,
  });
});


const rateBooking = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;
  const { serviceId, bookingId } = req.params;
  const { rating, recommended } = req.body;

  const result = await ServiceService.rateBooking(serviceId, bookingId, user, rating, recommended);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Service rated successfully',
    data: result,
  });
});

const getTopRecommendedServices = catchAsync(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 20;
  const result = await ServiceService.getMostRecommendedServices(limit);
  
  if (result.length === 0) {
    // Log this for debugging
    console.warn('No recommended services found despite querying');
    // Optionally return different status code
    return sendResponse(res, {
      statusCode: httpStatus.NO_CONTENT,
      success: true,
      message: 'No recommended services found yet',
      data: []
    });
  }
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.length > 1 
      ? 'Top recommended services fetched successfully' 
      : 'Recommended service fetched successfully',
    data: result,
  });
});


export const ServiceController = {
  createService,
  getAllServices,
  getServiceByCategory,
  getServiceDetails,
  getServicePortfolio,
  getServiceReviews,
  getTrendingServices,
  getRecommendedServices,
  getAllCategories,
  deleteService,
  updateService,
  bookServiceSlot,
  getProviderDashboard,
  updateBookingStatus,
  rateBooking,
  getTopRecommendedServices,
};
