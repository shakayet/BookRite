import httpStatus from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBooking, IService } from './service.interface';
import { Service } from './service.model';
import { Types } from 'mongoose';

const createService = async (data: any, user: any) => {
  const serviceData = { ...data, createdBy: user.id };
  const result = await Service.create(serviceData);
  return result;
};

const getAllServices = async (query: any) => {
  return await Service.find(query).populate('createdBy');
};

const getServicesByCategory = async (category: string) => {
  return await Service.find({ category }).populate('createdBy');
};

const getServiceDetails = async (id: string) => {
  const service = await Service.findById(id).populate('createdBy');
  if (!service) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  return service;
};

const getServicePortfolio = async (user: any) => {
  return await Service.find({ createdBy: user._id });
};

const getServiceReviews = async () => {
  return [];
};

const getTrendingServices = async () => {
  return await Service.find().sort({ createdAt: -1 }).limit(5);
};

const getRecommendedServices = async (user: any) => {
  return await Service.find({}).limit(5);
};

const getAllCategories = async () => {
  return await Service.distinct('category');
};

const deleteService = async (id: string, user: any) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }

  if (service.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to delete this service');
  }

  const deletedService = await Service.findByIdAndDelete(id);
  return deletedService;
};

const updateService = async (id: string, payload: Partial<IService>, user: any) => {
  const service = await Service.findById(id);
  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }

  if (service.createdBy.toString() !== user._id.toString()) {
    throw new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to update this service');
  }

  const updatedService = await Service.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updatedService;
};

const bookServiceSlot = async (
  id: string,
  data: { date: string; timeSlot: IBooking['timeSlot'] },
  user: any
) => {
  const { date, timeSlot } = data;

  // Check if service exists
  const serviceExists = await Service.exists({ _id: id });
  if (!serviceExists) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found');
  }

  // Check for existing booking conflict using MongoDB query
  const conflict = await Service.findOne({
    _id: id,
    bookings: {
      $elemMatch: {
        date,
        timeSlot,
      },
    },
  });

  if (conflict) {
    throw new ApiError(httpStatus.CONFLICT, 'This slot is already booked.');
  }

  // Book the new slot using atomic push
  const updatedService = await Service.findByIdAndUpdate(
    id,
    {
      $push: {
        bookings: {
          date,
          timeSlot,
          user: new Types.ObjectId(user.id),
        },
      },
    },
    { new: true }
  );

  return updatedService;
};


export const ServiceService = {
  createService,
  getAllServices,
  getServicesByCategory,
  getServiceDetails,
  getServicePortfolio,
  getServiceReviews,
  getTrendingServices,
  getRecommendedServices,
  getAllCategories,
  deleteService,
  updateService,
  bookServiceSlot,
};
