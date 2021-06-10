import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Must have title'],
    },
    data: {
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
  }
);

const Blog = mongoose.model('Blog', noteSchema);

export default Blog;
