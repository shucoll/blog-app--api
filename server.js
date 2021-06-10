// import mongoose from 'mongoose';
// import dotenv from 'dotenv';

// import express from 'express';
// import morgan from 'morgan';

// import mongoSanitize from 'express-mongo-sanitize';
// import xss from 'xss-clean';
// import hpp from 'hpp';

// import cors from 'cors';

// import AppError from './utils/appError.js';
// import globalErrorHandler from './controllers/errorController.js';

// //import routes here
// import blogRouter from './routes/blogRoutes.js';
// import userRouter from './routes/userRoutes.js';

// process.on('uncaughtException', (err) => {
//   console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   process.exit(1);
// });

// dotenv.config();

// const DB = process.env.DATABASE;

// mongoose
//   .connect(DB, {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true,
//     useFindAndModify: false,
//   })
//   .then(() => console.log('DB connected'));

// const app = express();

// app.use(cors());

// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
//   );
//   next();
// });

// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// }

// app.use(express.json({ limit: '10kb' }));

// app.use(mongoSanitize());

// app.use(xss());

// app.use(hpp());

// //Define the routes here
// app.use('/api/v1/blogs', blogRouter);
// app.use('/api/v1/users', userRouter);

// //not available routes
// app.all('*', (req, res, next) => {
//   next(new AppError(`Cant find ${req.originalUrl} on this server!`, 404));
// });

// app.use(globalErrorHandler);

import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! Shutting down...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
