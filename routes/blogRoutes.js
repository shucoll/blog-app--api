import express from 'express';
import * as blogController from '../controllers/blogController.js';
import * as authController from '../controllers/authController.js';

import commentRouter from './commentRoutes.js';

const router = express.Router();

router.use('/:blogId/comments', commentRouter);

router
  .route('/')
  .get(blogController.getAllBlogs)
  .post(
    authController.protect,
    blogController.filterCreate,
    blogController.createBlog
  );

// router
//   .route('/my-blogs')
//   .get(
//     authController.protect,
//     blogController.setUser,
//     blogController.getAllBlogs
//   );

router
  .route('/:id')
  .get(blogController.getBlog)
  .patch(
    authController.protect,
    authController.restrictToSelf('blog'),
    blogController.filterUpdate,
    blogController.updateBlog
  )
  .delete(
    authController.protect,
    authController.restrictToSelf('blog'),
    blogController.deleteBlog
  );

export default router;
