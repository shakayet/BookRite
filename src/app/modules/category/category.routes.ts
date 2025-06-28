// src/app/modules/category/category.routes.ts
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import * as categoryController from './category.controller';
import { categoryValidationSchema } from './category.validation';

const router = express.Router();

router.route('/')
  .post(
    auth(),
    validateRequest(categoryValidationSchema),
    categoryController.createCategory
  )
  .get(
    categoryController.getAllCategories
  );

router.route('/:id')
  .get(
    categoryController.getSingleCategory
  )
  .delete(
    auth(),
    categoryController.deleteCategory
  );

export const CategoryRoutes = router;
