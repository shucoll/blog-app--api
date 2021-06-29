import path from 'path';

import mongoose from 'mongoose';
import dotenv from 'dotenv';

import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
import hpp from 'hpp';
import compression from 'compression';

import cors from 'cors';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';

//import routes here
import blogRouter from './routes/blogRoutes.js';
import userRouter from './routes/userRoutes.js';
import commentRouter from './routes/commentRoutes.js';

import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();

let DB = process.env.DATABASE;

if (process.env.NODE_ENV === 'production')
  DB = process.env.DATABASE_PRODUCTION.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connected'));

const app = express();

app.use(cors());
// app.use(cors({
//   origin: `${process.env.CLIENT_URL}`
// }))

app.use(express.static(path.join(__dirname, 'public')));

app.use(helmet());

if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!',
  });
  app.use('/api', limiter);
}

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '50kb' }));

app.use(mongoSanitize());

// app.use(xss());

app.use(hpp());

app.use(compression());

//Define the routes here
app.use('/api/v1/blogs', blogRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/comments', commentRouter);

//not available routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
