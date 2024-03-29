import express from 'express';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

import { default as placesRouter } from './routes/places-routes.js';
import { default as usersRouter } from './routes/users-routes.js';
import HttpError from './models/http-error.js';

const app = express();

app.use(express.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/places', placesRouter);
app.use('/api/users', usersRouter);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route', 404);
  throw error;
});

app.use((error, req, res, next) => {
  console.log(
    `Error-handling middlware start: ${error}, headersSent: ${res.headersSent}`
  );
  if (req.file) {
    console.log('File detected in this request, rolling back');
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred.' });
}); // error-handling middleware function

const mongooseConnStr = `mongodb+srv://${process.env.IMAGER_APP_USERNAME}:${process.env.IMAGER_APP_KEY}@${process.env.IMAGER_APP_HOSTNAME}/?retryWrites=true&w=majority`;

mongoose
  .connect(mongooseConnStr, { dbName: process.env.IMAGER_APP_DBNAME })
  .then(() => {
    console.log('Connected to mongoDB.');
    app.listen(process.env.PORT);
  })
  .catch((error) => {
    console.error(error);
  });
