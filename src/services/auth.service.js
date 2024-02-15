import createHttpError from 'http-errors';
import validator from 'validator';
import UserModel from '../models/userModel.js';
import bcrypt from 'bcrypt';

const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;
export const createUser = async (userData) => {
  const { name, email, picture, status, password } = userData;

  console.log(userData);

  //check if field are empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest('Please fill all fields.');
  }

  if (
    !validator.isLength(name, {
      min: 2,
      max: 16,
    })
  ) {
    throw createHttpError.BadRequest(
      'Please make sure your name is between 2 and 16 characters.'
    );
  }

  //Check status length
  if (status) {
    if (status.length > 64) {
      throw new createHttpError.BadRequest(
        'Please make sure your status less than 4 characters.'
      );
    }
  }

  //check if email address is valid
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest(
      'Please make sure to provide a valid email address'
    );
  }

  //check if your email already exist
  const checkDb = await UserModel.findOne({ email });
  if (checkDb) {
    throw createHttpError.Conflict(
      'Please try again with a different email address, this email already exist.'
    );
  }

  //check password length
  if (
    !validator.isLength(password, {
      min: 6,
      max: 128,
    })
  ) {
    throw createHttpError.BadRequest(
      'Please make sure your password is between 6 and 12 characters.'
    );
  }

  const user = await new UserModel({
    name,
    email,
    picture: picture || DEFAULT_PICTURE,
    status: status || DEFAULT_STATUS,
    password,
  }).save();

  return user;
};

export const signUser = async (email, password) => {
  const user = await UserModel.findOne({ email: email.toLowerCase() }).lean();

  //check if user exist
  if (!user) throw createHttpError.NotFound('Invalid credentials.');

  //compare password
  let passwordMatched = await bcrypt.compare(password, user.password);

  if (!passwordMatched) {
    throw createHttpError.NotFound('Invalid credentials.');
  }

  return user;
};
