import httpStatus from 'http-status-codes';
import ApiError from '../../../errors/ApiError';
import { IBooking, IService } from './service.interface';
import { Service } from './service.model';
import { Types, Document } from 'mongoose';

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
  return await Service.find({ createdBy: user.id });
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

  if (service.createdBy.toString() !== user.id.toString()) {
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

  if (service.createdBy.toString() !== user.id.toString()) {
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
  data: { date: string; timeSlot: IBooking['timeSlot']; paymentStatus: IBooking['paymentStatus']; serviceStatus: IBooking['serviceStatus'] },
  user: any
) => {
  const { date, timeSlot, paymentStatus, serviceStatus, } = data;

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
        paymentStatus,
        serviceStatus,
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
          paymentStatus,
          serviceStatus,
          user: new Types.ObjectId(user.id),
        },
      },
    },
    { new: true }
  );

  return updatedService;
};

const getProviderDashboard = async (user: any) => {
  console.log(`Fetching dashboard for provider: ${user.id}`);
  
  const services = await Service.find({ createdBy: user.id }).populate('bookings.user');
  console.log(`Found ${services.length} services for this provider`);

  const totalBookings: Array<any> = [];
  let pending = 0;
  let accepted = 0;
  let completed = 0;

  services.forEach(service => {
    console.log(`Service ${service._id} has ${service.bookings?.length || 0} bookings`);
    
    if (service.bookings && service.bookings.length > 0) {
      service.bookings.forEach(booking => {
        const bookingObj = booking instanceof Document ? booking.toObject() : booking;
        console.log(`Booking status: ${bookingObj.serviceStatus}`);
        
        totalBookings.push({
          ...bookingObj,
          serviceId: service._id,
          serviceTitle: service.title
        });

        switch (bookingObj.serviceStatus) {
          case 'Pending':
            pending++;
            break;
          case 'Accept':
            accepted++;
            break;
          case 'Complete':
            completed++;
            break;
          default:
            console.warn(`Unknown booking status: ${bookingObj.serviceStatus}`);
        }
      });
    }
  });

  console.log('Final counts:', { pending, accepted, completed });

  return {
    totalBookings,
    stats: {
      pending,
      accepted,
      completed,
      total: pending + accepted + completed
    },
  };
};

// const updateBookingStatus = async (
//   serviceId: string,
//   bookingId: string,
//   status: 'Accept' | 'Complete',
//   user: any
// ) => {
//   const service = await Service.findOne({ _id: serviceId, createdBy: user.id });

//   if (!service) throw new ApiError(httpStatus.NOT_FOUND, 'Service not found or unauthorized');

//   const booking = service.bookings?.find(b => b._id?.toString() === bookingId);
//   if (!booking) throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');

//   booking.serviceStatus = status;

//   await service.save();
//   return booking;
// };


const updateBookingStatus = async (
  serviceId: string,
  bookingId: string,
  status: 'Accept' | 'Complete',
  user: any
) => {
  // First validate the service exists and belongs to the provider
  const service = await Service.findOne({
    _id: new Types.ObjectId(serviceId),
    createdBy: new Types.ObjectId(user.id)
  });

  if (!service) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Service not found or unauthorized');
  }

  // Use atomic update with arrayFilters to directly modify the booking
  const updatedService = await Service.findOneAndUpdate(
    {
      _id: new Types.ObjectId(serviceId),
      'bookings._id': new Types.ObjectId(bookingId)
    },
    {
      $set: {
        'bookings.$.serviceStatus': status,
        'bookings.$.updatedAt': new Date()
      }
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('bookings.user');

  if (!updatedService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  // Find and return the updated booking
  const updatedBooking = updatedService.bookings?.find(b => 
    b._id?.toString() === bookingId
  );

  if (!updatedBooking) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found after update');
  }

  return updatedBooking;
};


const cancelBooking = async (serviceId: string, bookingId: string, user: any) => {
  // Atomic update using arrayFilters
  const updatedService = await Service.findOneAndUpdate(
    {
      _id: new Types.ObjectId(serviceId),
      'bookings._id': new Types.ObjectId(bookingId),
      'bookings.user': new Types.ObjectId(user.id)
    },
    {
      $set: {
        'bookings.$.cancelled': true,
        'bookings.$.serviceStatus': 'Pending',
        'bookings.$.updatedAt': new Date()
      }
    },
    {
      new: true,
      runValidators: true
    }
  ).populate('bookings.user');

  if (!updatedService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found or unauthorized');
  }

  const cancelledBooking = updatedService.bookings?.find(b => 
    b._id?.toString() === bookingId
  );

  return cancelledBooking;
};

// const rateBooking = async (
//   serviceId: string,
//   bookingId: string,
//   user: any,
//   rating: number,
//   recommended: boolean
// ) => {
//   // Validate rating range
//   if (rating < 1 || rating > 5) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Rating must be between 1 and 5');
//   }

//   // Atomic update using arrayFilters
//   const updatedService = await Service.findOneAndUpdate(
//     {
//       _id: new Types.ObjectId(serviceId),
//       'bookings._id': new Types.ObjectId(bookingId),
//       'bookings.user': new Types.ObjectId(user.id)
//     },
//     {
//       $set: {
//         'bookings.$.rating': rating,
//         'bookings.$.recommended': recommended,
//         'bookings.$.updatedAt': new Date()
//       }
//     },
//     {
//       new: true,
//       runValidators: true
//     }
//   ).populate('bookings.user');

//   console.log(rating, recommended);

//   if (!updatedService) {
//     throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found or unauthorized');
//   }

//   const ratedBooking = updatedService.bookings?.find(b => 
//     b._id?.toString() === bookingId
//   );

//   return updatedService;
// };

const rateBooking = async (
  serviceId: string,
  bookingId: string,
  user: any,
  rating: number,
  recommended: boolean
) => {
  // Validate rating range
  if (rating < 1 || rating > 5) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Rating must be between 1 and 5');
  }

  // Convert IDs to ObjectId
  const serviceObjId = new Types.ObjectId(serviceId);
  const bookingObjId = new Types.ObjectId(bookingId);
  const userObjId = new Types.ObjectId(user.id);

  // First verify the booking exists and belongs to the user
  const existingService = await Service.findOne({
    _id: serviceObjId,
    'bookings._id': bookingObjId,
    'bookings.user': userObjId
  });

  if (!existingService) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Booking not found or unauthorized');
  }

  // Perform the atomic update
  const updatedService = await Service.findOneAndUpdate(
    {
      _id: serviceObjId,
      'bookings._id': bookingObjId
    },
    {
      $set: {
        'bookings.$.rating': rating,
        'bookings.$.recommended': recommended,
        'bookings.$.updatedAt': new Date()
      }
    },
    {
      new: true,
      runValidators: true
    }
  );

  if (!updatedService) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to update booking');
  }

  // Find the specific updated booking
  const ratedBooking = updatedService.bookings?.find(b => 
    b._id?.equals(bookingObjId)
  );

  if (!ratedBooking) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to retrieve updated booking');
  }

  // Now populate just the user for this specific booking
  await Service.populate(ratedBooking, {
    path: 'user',
    model: 'User'
  });

  return updatedService;
};

const getMostRecommendedServices = async (limit: number = 20) => {
  const result = await Service.aggregate([
    // First match services that have at least one recommended booking
    {
      $match: {
        "bookings.recommended": true
      }
    },
    // Then unwind the bookings array
    { $unwind: "$bookings" },
    // Filter only recommended bookings
    { $match: { "bookings.recommended": true } },
    // Group by service and count recommendations
    {
      $group: {
        _id: "$_id",
        title: { $first: "$title" },
        category: { $first: "$category" },
        price: { $first: "$price" },
        description: { $first: "$description" },
        image: { $first: "$image" },
        location: { $first: "$location" },
        createdBy: { $first: "$createdBy" },
        recommendationCount: { $sum: 1 }
      }
    },
    // Sort by recommendation count (descending)
    { $sort: { recommendationCount: -1 } },
    // Limit to top results
    { $limit: limit },
    // Lookup category details
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category"
      }
    },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    // Lookup provider details
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "provider"
      }
    },
    { $unwind: { path: "$provider", preserveNullAndEmptyArrays: true } },
    // Project the final format
    {
      $project: {
        _id: 1,
        title: 1,
        category: "$category.name",
        price: 1,
        description: 1,
        image: 1,
        location: 1,
        provider: {
          name: "$provider.name",
          image: "$provider.image"
        },
        recommendationCount: 1
      }
    }
  ]);

  // Debug log to check raw data
  console.log('Recommended services aggregation result:', result);
  
  return result;
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
  getProviderDashboard,
  updateBookingStatus,
  rateBooking,
  getMostRecommendedServices,
};
