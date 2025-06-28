import express from 'express';
import * as clothController from './cloth.controller';
import validateRequest from '../../middlewares/validateRequest';
import {
  createClothZodSchema,
  updateClothZodSchema,
} from './cloth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLES } from '../../../enums/user';

const router = express.Router();

router.route('/')
  .post(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(createClothZodSchema),
    clothController.createCloth
  )
  .get(
    clothController.getAllCloths
  );


router.route('/:id')
  .patch(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN),
    validateRequest(updateClothZodSchema),
    clothController.updateCloth
  )
  .get(
    clothController.getSingleCloth 
  )
  .delete(
    auth(USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN), 
    clothController.deleteCloth
  );

export const ClothRoutes = router;
