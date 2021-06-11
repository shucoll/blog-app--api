import Blog from '../models/blogModel.js';
import * as factory from './handlerFactory.js';
import filterObj from '../utils/filterObj.js';

// export const setUser = (req, res, next) => {
//   req.query.user = req.user._id;
//   next();
// };

export const filterCreate = (req, res, next) => {
  req.body = filterObj(req.body, 'blogData', 'title', 'user');
  next();
};

export const filterUpdate = (req, res, next) => {
  req.body = filterObj(req.body, 'blogData', 'title');
  next();
};

export const getAllBlogs = factory.getAll(Blog);

export const getBlog = factory.getOne(Blog, { path: 'comment' });

export const createBlog = factory.createOne(Blog);
export const updateBlog = factory.updateOne(Blog);
export const deleteBlog = factory.deleteOne(Blog);
