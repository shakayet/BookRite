import { ICloth } from './cloth.interface';
import { Cloth } from './cloth.model';
import QueryBuilder from '../../builder/QueryBuilder';

export const createCloth = async (payload: ICloth) => {
  return await Cloth.create(payload);
};

export const getAllCloths = async (query: Record<string, unknown>) => {
  const queryBuilder = new QueryBuilder(Cloth.find(), query)
    .search(['title', 'color', 'category'])
    .filter()
    .sort()
    .paginate()
    .fields()

  const data = await queryBuilder.modelQuery;
  const meta = await queryBuilder.getPaginationInfo();

  return { meta, data };
};

export const getSingleCloth = async (id: string) => {
  return await Cloth.findById(id);
};

export const updateCloth = async (id: string, payload: Partial<ICloth>) => {
  return await Cloth.findByIdAndUpdate(id, payload, { new: true });
};

export const deleteCloth = async (id: string) => {
  return await Cloth.findByIdAndDelete(id);
};
