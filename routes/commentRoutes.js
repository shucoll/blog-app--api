import express from 'express';
import * as commentController from '../controllers/commentController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);

//the blogId passed through the blog router to this router is caught here and is used in the post method to create the comment for that particular blog
router
  .route('/')
  .get(commentController.getAllComments)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    commentController.setBlogUserIds,
    commentController.createComment
  );

router
  .route('/reply/:commentId')
  .post(
    authController.protect,
    authController.restrictTo('user'),
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
