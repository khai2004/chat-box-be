import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide your name'],
    },
    email: {
      type: String,
      required: [true, 'Please provide tour email address'],
      unique: [true, 'This email address already exist'],
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email address'],
    },
    picture: {
      type: String,
      default:
        'https://res-console.cloudinary.com/dmhed672d/media_explorer_thumbnails/fed7f60a5ec1dfbc679f3773ff1a94aa/detailed',
    },
    status: {
      type: String,
      default: 'Hi there ! I am using whatsapp',
    },
    password: {
      type: String,
      required: [true, 'Please provide your password'],
      minLength: [
        6,
        'Please provide your password is at least 6 characters long.',
      ],
      maxLength: [
        128,
        'Please provide your password is less than 128 characters long.',
      ],
    },
  },
  {
    collection: 'users',
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    }
  } catch (error) {
    next(error);
  }
});

const UserModel =
  mongoose.models.UserModel || mongoose.model('UserModel', userSchema);

export default UserModel;
