import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

export default app;

// const server = app.listen(port, () => {
//   console.log(`App running on port ${port}...`);
// });

// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);

//   server.close(() => {
//     process.exit(1);
//   });
// });

// process.on('SIGTERM', () => {
//   console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
//   server.close(() => {
//     console.log('💥 Process terminated!');
//   });
// });

