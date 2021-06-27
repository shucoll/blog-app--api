import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, 'Comment can not be empty!'],
    },
    isReply: {
      type: Boolean,
      default: false,
    },
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: 'Blog',
      required: [true, 'Comment must belong to a blog'],
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Comment must belong to a user'],
    },

    parentComment: {
      type: mongoose.Schema.ObjectId,
      ref: 'Comment',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

commentSchema.virtual('reply', {
  ref: 'Comment',
  foreignField: 'parentComment',
  localField: '_id',
});

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
