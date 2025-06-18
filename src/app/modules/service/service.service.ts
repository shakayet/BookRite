import { User } from '../user/user.model';
import { IService } from './service.interface';
import { Service } from './service.model';

const createService = async (payload: IService, user: any): Promise<IService> => {

const userData = await User.findById({ _id: user.id })

console.log(userData);

  const result = await Service.create({
    ...payload,
    location: userData?.address,
    createdBy: user.id,
  });
  return result;
};

export const ServiceService = { createService };
