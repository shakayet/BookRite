import express from 'express';
import auth from '../../middlewares/auth';

import { ServiceController } from './service.controller';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post('/', auth(USER_ROLES.PROVIDER), ServiceController.createService);
router.get('/', ServiceController.getAllServices);
router.get('/categories', ServiceController.getAllCategories);
router.get('/trending', ServiceController.getTrendingServices);
router.get('/recommendations', auth(), ServiceController.getRecommendedServices);
router.get('/review', ServiceController.getServiceReviews);
router.get('/portfolio', auth(), ServiceController.getServicePortfolio);
router.get('/:category', ServiceController.getServiceByCategory);
router.get('/details/:id', ServiceController.getServiceDetails);
router.delete('/:id', auth(USER_ROLES.ADMIN, USER_ROLES.PROVIDER), ServiceController.deleteService);
router.patch('/:id', auth(USER_ROLES.PROVIDER), ServiceController.updateService);
router.post('/book/:id', auth(USER_ROLES.USER), ServiceController.bookServiceSlot);


export const ServiceRoutes=router