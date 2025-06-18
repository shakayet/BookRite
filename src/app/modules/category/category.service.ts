
import { Category } from './category.model';
import { ICategory } from './category.interface';

export const createCategory = async (data: ICategory) => {
  const category = await Category.create(data);
  return category;
};

export const getAllCategories = async () => {
  return await Category.find().populate('createdBy', 'name email');
};

export const getSingleCategory = async (id: string) => {
  return await Category.findById(id).populate('createdBy', 'name email');
};

export const deleteCategory = async (id: string) => {
  return await Category.findByIdAndDelete(id);
};
