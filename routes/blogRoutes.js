import express from 'express';
import * as blogController from '../controllers/blogController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(authController.protect, blogController.createBlog);

router
  .route('/:id')
  .get(blogController.getBlog)
  .patch(
    authController.protect,
    authController.restrictToSelf('blog'),
    blogController.updateBlog
  )
  .delete(
    authController.protect,
    authController.restrictToSelf('blog'),
    blogController.deleteBlog
  );

export default router;
