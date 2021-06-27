import mongoose from 'mongoose';
import slugify from 'slugify';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Must have title'],
      unique: true,
    },
    description: { type: String, default: '' },
    slug: String,
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
  options: { sort: { createdAt: -1 } },
});

blogSchema.pre('save', function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

blogSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
