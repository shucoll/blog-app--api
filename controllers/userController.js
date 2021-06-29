import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Comment from '../models/commentModel.js';
import Blog from '../models/blogModel.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';
import filterObj from '../utils/filterObj.js';
import cloudinary from '../utils/cloudinary.js';
import { dataUri } from '../utils/multer.js';

export const uploadUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  let uploadPreset = 'dev';
  if (process.env.NODE_ENV === 'production') uploadPreset = 'prod';

  req.file.filename = `${uploadPreset}/userProfile/user-${
    req.user.id
  }-${Date()}.jpg`;

  const file = dataUri(req).content;

  await cloudinary.uploader.upload(file, {
    upload_preset: uploadPreset,
    width: 500,
    height: 500,
    format: 'jpeg',
    crop: 'limit',
    public_id: `user-${req.user.id}-${Date()}`,
  });

  next();
});

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  }).select(['-role', '-isVerified']);

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  const query = User.findById(req.user.id).select(['-role', '-isVerified']);

  // if (popOptions) query = query.populate(popOptions);
  const doc = await query;

  const blogCount = await Blog.countDocuments({ user: doc._id });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { ...doc._doc, blogCount: blogCount },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

export const getUser = factory.getOne(User);
export const getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
export const updateUser = factory.updateOne(User);

export const deleteUser = catchAsync(async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const doc = await User.findByIdAndDelete(req.params.id).session(session);
    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    await Comment.deleteMany({ user: doc._id }).session(session);
    await Blog.deleteMany({ user: doc._id }).session(session);

    await session.commitTransaction();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    await session.abortTransaction();
    throw err;
  }
});
