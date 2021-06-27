import Blog from '../models/blogModel.js';
import * as factory from './handlerFactory.js';
import filterObj from '../utils/filterObj.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const setUser = (req, res, next) => {
  req.body.user = req.user._id;
  next();
};

export const filterCreate = (req, res, next) => {
  req.body = filterObj(req.body, 'blogData', 'title', 'user', 'description');
  next();
};

export const filterUpdate = (req, res, next) => {
  req.body = filterObj(req.body, 'blogData', 'title', 'description');
  next();
};

export const getAllBlogs = factory.getAll(Blog);

export const getBlog = factory.getOne(Blog, { path: 'comment' });

export const getBlogBySlug = catchAsync(async (req, res, next) => {
  let query = Blog.findOne({ slug: req.params.slug });

  query = query.populate({
    path: 'comment',
  });
  const doc = await query;

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: doc,
  });
});

export const createBlog = factory.createOne(Blog);
export const updateBlog = factory.updateOne(Blog);
export const deleteBlog = factory.deleteOne(Blog);
