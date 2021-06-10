import Blog from '../models/blogModel.js';

import * as factory from './handlerFactory.js';

export const getAllBlogs = factory.getAll(Blog);

export const getBlog = factory.getOne(Blog);

export const createBlog = factory.createOne(Blog);
export const updateBlog = factory.updateOne(Blog);
export const deleteBlog = factory.deleteOne(Blog);
