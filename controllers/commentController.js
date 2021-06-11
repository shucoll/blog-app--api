import Comment from '../models/commentModel.js';
import Blog from '../models/blogModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import filterObj from '../utils/filterObj.js';

export const filterCreate = (req, res, next) => {
  req.body = filterObj(
    req.body,
    'user',
    'blog',
    'comment',
    'isReply',
    'parentComment'
  );
  next();
};

export const filterUpdate = (req, res, next) => {
  req.body = filterObj(req.body, 'comment');
  next();
};

export const setBlogUserIds = catchAsync(async (req, res, next) => {
  const blog = await Blog.findById(req.params.blogId);

  if (!blog) {
    return next(new AppError('No blog found with that ID', 404));
  }
  req.body.parentComment = undefined;
  req.body.isReply = false;
  req.body.blog = req.params.blogId;
  req.body.user = req.user._id;
  next();
});

export const setCommentId = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }
  req.body.isReply = true;
  req.body.parentComment = req.params.commentId;
  next();
});

export const getAllComments = factory.getAll(Comment);
export const getComment = factory.getOne(Comment, { path: 'reply' });
export const createComment = factory.createOne(Comment);
export const updateComment = factory.updateOne(Comment);
export const deleteComment = factory.deleteOne(Comment);
