import app from './app.js';
import logger from './configs/logger.config.js';
import mongoose from 'mongoose';

const { MONGODB_URL } = process.env;
const PORT = process.env.PORT | 8000;

//mongodb connection
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('Connected to mongodb');
  });

//exit on mongodb error
mongoose.connection.on('error', (err) => {
  logger.error(`Mongodb connection error: ${err}`);
  process.exit(1);
});

//mongodb debug mode
if (process.env.NODE_ENV !== 'production') {
  mongoose.set('debug', true);
}

let server;

server = app.listen(PORT, () => {
  logger.info(`Server is listening at ${PORT}...`);
});

//hanlde server errors

const exitHandler = () => {
  if (server) {
    logger.info('Server closed.');
    process.exit(1);
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
