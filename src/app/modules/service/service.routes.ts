import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { ServiceController } from './service.controller';
import { createServiceZodSchema } from './service.validation';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLES.ADMIN, USER_ROLES.PROVIDER),
  validateRequest(createServiceZodSchema),
  ServiceController.createService
);

export const ServiceRoutes = router;
