import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import Blog from '../models/blogModel.js';
import Comment from '../models/commentModel.js';

import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

import Email from '../utils/email.js';

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  user.role = undefined;
  user.isVerified = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  //if user tries to login without verification allow user to resend the verification token
  if (!user.isVerified)
    return next(
      new AppError(
        'Your account has not been verified. Please verify account to login',
        401
      )
    );

  createSendToken(user, 200, res);
});

const createSendSignupToken = async (user, req, res, next) => {
  const signupToken = user.createSignupToken();

  await user.save({ validateBeforeSave: false });

  const signupURL = `${process.env.CLIENT_URL}/auth/confirmSignup/${signupToken}`;

  try {
    await new Email(user, signupURL).sendSignup();

    res.status(200).json({
      status: 'success',
      message: 'Signup Successful',
    });
  } catch (err) {
    user.signupToken = undefined;
    user.signupTokenExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
};

export const signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  createSendSignupToken(user, req, res, next);
});

export const resendSignupToken = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  if (user.isVerified) {
    return next(
      new AppError(
        'Your account is already verified. Please login to continue',
        400
      )
    );
  }

  createSendSignupToken(user, req, res, next);
});

export const confirmSignup = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  // let user;

  // user = await User.findOne({
  //   email: req.body.email,
  // });

  // if (user.isVerified)
  //   return next(new AppError('User has already been verified', 400));

  const user = await User.findOne({
    // email: req.body.email,
    signupToken: hashedToken,
    signupTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.isVerified = true;

  user.signupToken = undefined;
  user.signupTokenExpires = undefined;

  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    status: 'success',
    message: 'Verification Successful. Please login to continue',
  });
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  if (!user.isVerified) {
    return next(
      new AppError(
        'Your account is not verified. Please verify account to continue.',
        401
      )
    );
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${process.env.CLIENT_URL}/auth/resetPassword/${resetToken}`;

  try {
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    // email: req.body.email,
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // createSendToken(user, 200, res);
  res.status(200).json({
    status: 'success',
    message: 'Password changed successfully. Please login to continue',
  });
});

export const updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  await user.save();
  createSendToken(user, 200, res);
});

export const protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;

  next();
});

export const restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403) //403 for unauthorized access
      );
    }

    next();
  };

//TODO - allow admins - by taking argument
export const restrictToSelf = (model) =>
  catchAsync(async (req, res, next) => {
    let Model;
    if (model === 'blog') Model = Blog;
    if (model === 'comment') Model = Comment;

    const doc = await Model.findById(req.params.id);
    if (!doc.user._id.equals(req.user._id)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  });
