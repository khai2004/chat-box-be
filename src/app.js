import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import fileUpload from 'express-fileupload';
import cors from 'cors';

dotenv.config();

const app = express();

//morgan
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

//helmet
app.use(helmet());

//parse json req url
app.use(express.json());

//parse json req body
app.use(express.urlencoded({ extended: true }));

//sanitize request data
app.use(ExpressMongoSanitize());

//Enanble cookies parser
app.use(cookieParser());

//gzip compression
app.use(compression());

//file upload
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//cors
app.use(cors());

export default app;
