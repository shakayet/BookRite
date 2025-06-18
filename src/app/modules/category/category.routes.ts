// src/app/modules/category/category.routes.ts
import express from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import * as categoryController from './category.controller';
import { categoryValidationSchema } from './category.validation';

const router = express.Router();

router.post(
  '/',
  auth(),
  validateRequest(categoryValidationSchema),
  categoryController.createCategory
);

router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getSingleCategory);
router.delete('/:id', auth(), categoryController.deleteCategory);

export const CategoryRoutes = router;
