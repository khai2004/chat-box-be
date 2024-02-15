import createHttpError from 'http-errors';
import UserModel from '../models/userModel.js';

export const findUser = async (userId) => {
  const user = await UserModel.findById(userId);
  if (!user) throw createHttpError.BadRequest('Please fill all fields.');

  return user;
};

export const searchUsersService = async (keyword) => {
  const users = await UserModel.find({
    $or: [
      {
        name: { $regex: keyword, $options: 'i' },
      },
      {
        email: { $regex: keyword, $options: 'i' },
      },
    ],
  });
  return users;
};
