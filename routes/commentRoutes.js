import express from 'express';
import * as commentController from '../controllers/commentController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(commentController.setBlogId, commentController.getAllComments)
  .post(
    authController.protect,
    commentController.setBlogUserIds,
    commentController.createComment
  );

router
  .route('/reply/:commentId')
  .post(
    authController.protect,
    commentController.setBlogUserIds,
    commentController.setCommentId,
    commentController.filterCreate,
    commentController.createComment
  );

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(
    authController.protect,
    authController.restrictToSelf('comment'),
    commentController.filterUpdate,
    commentController.updateComment
  )
  .delete(
    authController.protect,
    authController.restrictToSelf('comment'),
    commentController.deleteComment
  );

export default router;
