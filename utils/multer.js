import multer from 'multer';
import Datauri from 'datauri/parser.js';
import AppError from './appError.js';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
const multerUpload = upload.single('photo');

const dUri = new Datauri();

const dataUri = (req) => dUri.format('jpeg', req.file.buffer);

export { multerUpload, dataUri };
