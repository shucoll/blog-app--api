import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Must have title'],
    },
    blogData: {
      time: {
        type: Date,
        required: [true, 'Must have time!'],
      },
      version: {
        type: String,
        required: [true, 'Must have version!'],
      },
      blocks: [{}],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Blog must belong to a user'],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

blogSchema.virtual('comment', {
  ref: 'Comment',
  foreignField: 'blog',
  localField: '_id',
  match: { isReply: false },
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
