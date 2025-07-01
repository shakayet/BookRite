import express from 'express';
import auth from '../../middlewares/auth';

import { USER_ROLES } from '../../../enums/user';
import { ServiceController } from './service.controller';

const router = express.Router();

router
  .route('/')
  .post(auth(USER_ROLES.PROVIDER), ServiceController.createService)
  .get(ServiceController.getAllServices);

router.get('/categories', ServiceController.getAllCategories);
router.get('/trending', ServiceController.getTrendingServices);
// router.get('/recommendations', auth(), ServiceController.getRecommendedServices);
router.get('/review', ServiceController.getServiceReviews);
router.get('/portfolio', auth(), ServiceController.getServicePortfolio);
router.get('/:category', ServiceController.getServiceByCategory);
router.get('/details/:id', ServiceController.getServiceDetails);
router.post(
  '/book/:id',
  auth(USER_ROLES.USER),
  ServiceController.bookServiceSlot
);
router.get(
  '/provider/dashboard',
  auth(USER_ROLES.PROVIDER),
  ServiceController.getProviderDashboard
);
router.patch(
  '/update-booking/:serviceId/:bookingId',
  auth(USER_ROLES.PROVIDER),
  ServiceController.updateBookingStatus
);
router.patch(
  '/rate-booking/:serviceId/:bookingId',
  auth(USER_ROLES.USER),
  ServiceController.rateBooking
);
router.get('/recommended/top', ServiceController.getTopRecommendedServices);

router
  .route('/:id')
  .patch(auth(USER_ROLES.PROVIDER), ServiceController.updateService)
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.PROVIDER),
    ServiceController.deleteService
  );

export const ServiceRoutes = router;
